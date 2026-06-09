"""
Questful Living API - Central Gamification Service for The Forge
Version: 1.0.0

This API handles:
- XP events from all Forge apps (Zen ToT, Forge Fit, Zen Reset, FineLine)
- User profiles (level, total XP, streaks)
- Daily quests and completions
- Stats aggregation for The Forge Hub
"""

import os
import json
import logging
from datetime import datetime, date, timedelta
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

import boto3
from botocore.config import Config
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# =============================================================================
# S3 Configuration
# =============================================================================

S3_ENDPOINT = os.getenv("IONOS_S3_ENDPOINT", "https://s3-eu-central-1.ionoscloud.com")
S3_ACCESS_KEY = os.getenv("IONOS_S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("IONOS_S3_SECRET_KEY")
S3_BUCKET = os.getenv("IONOS_S3_BUCKET", "the-forge-data")
S3_REGION = os.getenv("IONOS_S3_REGION", "eu-central-1")

s3_client = None

def get_s3_client():
    global s3_client
    if s3_client is None:
        s3_client = boto3.client(
            's3',
            endpoint_url=S3_ENDPOINT,
            aws_access_key_id=S3_ACCESS_KEY,
            aws_secret_access_key=S3_SECRET_KEY,
            region_name=S3_REGION,
            config=Config(signature_version='s3v4')
        )
    return s3_client

# =============================================================================
# XP Configuration
# =============================================================================

# XP rewards for different actions
XP_REWARDS = {
    # Zen ToT (Mind)
    "zen-tot": {
        "note_created": 10,
        "note_updated": 5,
        "folder_created": 15,
        "youtube_transcript": 25,
        "audio_transcription": 30,
        "file_upload": 10,
    },
    # Forge Fit (Body)
    "forge-fit": {
        "workout_completed": 100,
        "workout_logged": 50,
        "exercise_added": 10,
        "personal_record": 150,
        "streak_milestone": 200,
    },
    # Zen Reset (Spirit)
    "zen-reset": {
        "meditation_completed": 30,
        "breathing_exercise": 20,
        "session_5min": 25,
        "session_10min": 50,
        "session_20min": 100,
        "daily_practice": 40,
    },
    # FineLine (Reflect)
    "fineline": {
        "journal_entry": 25,
        "mood_logged": 10,
        "reflection_completed": 35,
        "weekly_review": 75,
        "monthly_review": 150,
    },
}

# Level thresholds (XP required for each level)
LEVEL_THRESHOLDS = [
    0,      # Level 1
    100,    # Level 2
    250,    # Level 3
    500,    # Level 4
    850,    # Level 5
    1300,   # Level 6
    1900,   # Level 7
    2600,   # Level 8
    3500,   # Level 9
    4600,   # Level 10
    6000,   # Level 11
    7700,   # Level 12
    9700,   # Level 13
    12000,  # Level 14
    15000,  # Level 15
    18500,  # Level 16
    22500,  # Level 17
    27000,  # Level 18
    32000,  # Level 19
    40000,  # Level 20
]

def calculate_level(total_xp: int) -> dict:
    """Calculate level and progress from total XP."""
    level = 1
    for i, threshold in enumerate(LEVEL_THRESHOLDS):
        if total_xp >= threshold:
            level = i + 1
        else:
            break

    current_threshold = LEVEL_THRESHOLDS[level - 1] if level <= len(LEVEL_THRESHOLDS) else LEVEL_THRESHOLDS[-1]
    next_threshold = LEVEL_THRESHOLDS[level] if level < len(LEVEL_THRESHOLDS) else current_threshold + 5000

    xp_in_level = total_xp - current_threshold
    xp_for_next = next_threshold - current_threshold

    return {
        "level": level,
        "total_xp": total_xp,
        "xp_in_level": xp_in_level,
        "xp_for_next_level": xp_for_next,
        "progress_percent": round((xp_in_level / xp_for_next) * 100, 1) if xp_for_next > 0 else 100
    }

# =============================================================================
# Pydantic Models
# =============================================================================

class XPEvent(BaseModel):
    """XP event from an app."""
    app: str = Field(..., description="App identifier (zen-tot, forge-fit, zen-reset, fineline)")
    action: str = Field(..., description="Action performed (e.g., note_created, workout_completed)")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Additional event data")

class XPEventResponse(BaseModel):
    """Response after recording an XP event."""
    success: bool
    xp_earned: int
    total_xp: int
    level: int
    level_up: bool = False
    new_level: Optional[int] = None
    message: str

class UserProfile(BaseModel):
    """User profile with stats."""
    user_id: str
    total_xp: int
    level: int
    xp_in_level: int
    xp_for_next_level: int
    progress_percent: float
    streak_days: int
    last_active: str
    created_at: str
    app_stats: Dict[str, Dict[str, int]]

class DailyQuest(BaseModel):
    """A daily quest."""
    id: str
    app: str
    action: str
    title: str
    description: str
    xp_reward: int
    completed: bool = False
    completed_at: Optional[str] = None

class DailyQuestsResponse(BaseModel):
    """Daily quests for a user."""
    date: str
    quests: List[DailyQuest]
    completed_count: int
    total_xp_earned: int

class ForgeStats(BaseModel):
    """Aggregated stats for The Forge Hub."""
    user_id: str
    level: int
    total_xp: int
    xp_to_next: int
    progress_percent: float
    streak_days: int
    completed_today: int
    app_summaries: Dict[str, Dict[str, Any]]

# =============================================================================
# S3 Helper Functions
# =============================================================================

def get_user_profile(user_id: str) -> dict:
    """Get or create user profile from S3."""
    s3 = get_s3_client()
    key = f"{user_id}/profile.json"

    try:
        response = s3.get_object(Bucket=S3_BUCKET, Key=key)
        return json.loads(response['Body'].read().decode('utf-8'))
    except s3.exceptions.NoSuchKey:
        # Create new profile
        profile = {
            "user_id": user_id,
            "total_xp": 0,
            "streak_days": 0,
            "last_active": None,
            "created_at": datetime.utcnow().isoformat(),
            "app_stats": {
                "zen-tot": {"events": 0, "xp": 0},
                "forge-fit": {"events": 0, "xp": 0},
                "zen-reset": {"events": 0, "xp": 0},
                "fineline": {"events": 0, "xp": 0},
            }
        }
        save_user_profile(user_id, profile)
        return profile
    except Exception as e:
        logger.error(f"Error getting profile for {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def save_user_profile(user_id: str, profile: dict):
    """Save user profile to S3."""
    s3 = get_s3_client()
    key = f"{user_id}/profile.json"

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=key,
        Body=json.dumps(profile, indent=2),
        ContentType='application/json'
    )

def get_events_log(user_id: str) -> list:
    """Get events log from S3."""
    s3 = get_s3_client()
    key = f"{user_id}/events.json"

    try:
        response = s3.get_object(Bucket=S3_BUCKET, Key=key)
        return json.loads(response['Body'].read().decode('utf-8'))
    except:
        return []

def append_event(user_id: str, event: dict):
    """Append event to events log."""
    s3 = get_s3_client()
    events = get_events_log(user_id)
    events.append(event)

    # Keep last 1000 events
    if len(events) > 1000:
        events = events[-1000:]

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=f"{user_id}/events.json",
        Body=json.dumps(events, indent=2),
        ContentType='application/json'
    )

def get_daily_quests(user_id: str, date_str: str) -> dict:
    """Get daily quests for a specific date."""
    s3 = get_s3_client()
    key = f"{user_id}/daily/{date_str}.json"

    try:
        response = s3.get_object(Bucket=S3_BUCKET, Key=key)
        return json.loads(response['Body'].read().decode('utf-8'))
    except:
        # Generate daily quests
        quests = generate_daily_quests(date_str)
        save_daily_quests(user_id, date_str, quests)
        return quests

def save_daily_quests(user_id: str, date_str: str, quests: dict):
    """Save daily quests to S3."""
    s3 = get_s3_client()
    key = f"{user_id}/daily/{date_str}.json"

    s3.put_object(
        Bucket=S3_BUCKET,
        Key=key,
        Body=json.dumps(quests, indent=2),
        ContentType='application/json'
    )

def generate_daily_quests(date_str: str) -> dict:
    """Generate daily quests for a date."""
    quests = [
        {
            "id": f"{date_str}-mind",
            "app": "zen-tot",
            "action": "note_created",
            "title": "Morning Reflection",
            "description": "Create a note capturing your thoughts",
            "xp_reward": 50,
            "completed": False,
        },
        {
            "id": f"{date_str}-body",
            "app": "forge-fit",
            "action": "workout_completed",
            "title": "Complete Workout",
            "description": "Finish a workout session",
            "xp_reward": 100,
            "completed": False,
        },
        {
            "id": f"{date_str}-spirit",
            "app": "zen-reset",
            "action": "meditation_completed",
            "title": "Mindful Moment",
            "description": "Complete a 10-minute meditation",
            "xp_reward": 50,
            "completed": False,
        },
        {
            "id": f"{date_str}-reflect",
            "app": "fineline",
            "action": "journal_entry",
            "title": "Journal Entry",
            "description": "Write in your journal",
            "xp_reward": 50,
            "completed": False,
        },
    ]

    return {
        "date": date_str,
        "quests": quests,
        "completed_count": 0,
        "total_xp_earned": 0,
    }

def update_streak(profile: dict) -> dict:
    """Update streak based on last active date."""
    today = date.today().isoformat()
    last_active = profile.get("last_active")

    if last_active:
        last_date = date.fromisoformat(last_active)
        today_date = date.today()
        diff = (today_date - last_date).days

        if diff == 0:
            # Same day, no change
            pass
        elif diff == 1:
            # Consecutive day, increment streak
            profile["streak_days"] = profile.get("streak_days", 0) + 1
        else:
            # Streak broken
            profile["streak_days"] = 1
    else:
        profile["streak_days"] = 1

    profile["last_active"] = today
    return profile

# =============================================================================
# FastAPI App
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Questful Living API starting up...")
    logger.info(f"S3 Bucket: {S3_BUCKET}")
    yield
    # Shutdown
    logger.info("Questful Living API shutting down...")

app = FastAPI(
    title="Questful Living API",
    description="Central gamification service for The Forge personal growth suite",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# API Endpoints
# =============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "questful-living",
        "version": "1.0.0",
        "bucket": S3_BUCKET,
    }

@app.post("/api/xp/event", response_model=XPEventResponse)
async def record_xp_event(
    event: XPEvent,
    user_id: str = Query(default="default", description="User identifier")
):
    """
    Record an XP event from any Forge app.

    This is the main endpoint that all apps call when a user completes an action.
    """
    # Validate app
    if event.app not in XP_REWARDS:
        raise HTTPException(status_code=400, detail=f"Unknown app: {event.app}")

    # Validate action
    app_rewards = XP_REWARDS[event.app]
    if event.action not in app_rewards:
        raise HTTPException(status_code=400, detail=f"Unknown action '{event.action}' for app '{event.app}'")

    # Calculate XP
    xp_earned = app_rewards[event.action]

    # Get user profile
    profile = get_user_profile(user_id)
    old_level = calculate_level(profile["total_xp"])["level"]

    # Update profile
    profile["total_xp"] += xp_earned
    profile["app_stats"][event.app]["events"] += 1
    profile["app_stats"][event.app]["xp"] += xp_earned
    profile = update_streak(profile)

    # Check for level up
    new_level_info = calculate_level(profile["total_xp"])
    level_up = new_level_info["level"] > old_level

    # Save profile
    save_user_profile(user_id, profile)

    # Log event
    event_log = {
        "timestamp": datetime.utcnow().isoformat(),
        "app": event.app,
        "action": event.action,
        "xp": xp_earned,
        "metadata": event.metadata,
    }
    append_event(user_id, event_log)

    # Check and update daily quests
    today = date.today().isoformat()
    daily = get_daily_quests(user_id, today)
    for quest in daily["quests"]:
        if quest["app"] == event.app and quest["action"] == event.action and not quest["completed"]:
            quest["completed"] = True
            quest["completed_at"] = datetime.utcnow().isoformat()
            daily["completed_count"] += 1
            daily["total_xp_earned"] += quest["xp_reward"]
            # Bonus XP for completing quest
            xp_earned += quest["xp_reward"]
            profile["total_xp"] += quest["xp_reward"]
            save_user_profile(user_id, profile)
            break
    save_daily_quests(user_id, today, daily)

    return XPEventResponse(
        success=True,
        xp_earned=xp_earned,
        total_xp=profile["total_xp"],
        level=new_level_info["level"],
        level_up=level_up,
        new_level=new_level_info["level"] if level_up else None,
        message=f"Earned {xp_earned} XP!" + (f" Level up to {new_level_info['level']}!" if level_up else "")
    )

@app.get("/api/profile", response_model=UserProfile)
async def get_profile(user_id: str = Query(default="default")):
    """Get user profile with all stats."""
    profile = get_user_profile(user_id)
    level_info = calculate_level(profile["total_xp"])

    return UserProfile(
        user_id=user_id,
        total_xp=profile["total_xp"],
        level=level_info["level"],
        xp_in_level=level_info["xp_in_level"],
        xp_for_next_level=level_info["xp_for_next_level"],
        progress_percent=level_info["progress_percent"],
        streak_days=profile.get("streak_days", 0),
        last_active=profile.get("last_active", ""),
        created_at=profile.get("created_at", ""),
        app_stats=profile.get("app_stats", {}),
    )

@app.get("/api/daily", response_model=DailyQuestsResponse)
async def get_daily(user_id: str = Query(default="default")):
    """Get today's daily quests."""
    today = date.today().isoformat()
    daily = get_daily_quests(user_id, today)

    return DailyQuestsResponse(
        date=daily["date"],
        quests=[DailyQuest(**q) for q in daily["quests"]],
        completed_count=daily["completed_count"],
        total_xp_earned=daily["total_xp_earned"],
    )

@app.get("/api/stats", response_model=ForgeStats)
async def get_forge_stats(user_id: str = Query(default="default")):
    """
    Get aggregated stats for The Forge Hub.

    This endpoint returns everything the Hub needs to display.
    """
    profile = get_user_profile(user_id)
    level_info = calculate_level(profile["total_xp"])

    # Get today's quests for completed count
    today = date.today().isoformat()
    daily = get_daily_quests(user_id, today)

    # Build app summaries
    app_summaries = {}
    for app_name, stats in profile.get("app_stats", {}).items():
        app_summaries[app_name] = {
            "events": stats.get("events", 0),
            "xp": stats.get("xp", 0),
        }

    return ForgeStats(
        user_id=user_id,
        level=level_info["level"],
        total_xp=profile["total_xp"],
        xp_to_next=level_info["xp_for_next_level"],
        progress_percent=level_info["progress_percent"],
        streak_days=profile.get("streak_days", 0),
        completed_today=daily["completed_count"],
        app_summaries=app_summaries,
    )

@app.get("/api/events")
async def get_recent_events(
    user_id: str = Query(default="default"),
    limit: int = Query(default=50, le=100)
):
    """Get recent XP events."""
    events = get_events_log(user_id)
    return {"events": events[-limit:]}

@app.get("/api/xp-config")
async def get_xp_config():
    """Get XP rewards configuration (for debugging/display)."""
    return {
        "rewards": XP_REWARDS,
        "level_thresholds": LEVEL_THRESHOLDS,
    }

# =============================================================================
# Run
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8022))
    uvicorn.run(app, host="0.0.0.0", port=port)
