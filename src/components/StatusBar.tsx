
import { cn } from "@/lib/utils";

interface StatusBarProps {
  current: number;
  max: number;
  type: "hp" | "xp" | "mp";
  label?: string;
  showText?: boolean;
  className?: string;
}

const StatusBar = ({
  current,
  max,
  type,
  label,
  showText = true,
  className,
}: StatusBarProps) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  const getFillClass = () => {
    switch (type) {
      case "hp":
        return "hp-fill";
      case "xp":
        return "xp-fill";
      case "mp":
        return "mp-fill";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className={cn("w-full space-y-1", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium tracking-wide text-accent/90 uppercase">{label}</div>
          {showText && (
            <div className="text-xs font-medium tabular-nums">
              {current} / {max}
            </div>
          )}
        </div>
      )}
      <div className="status-bar">
        <div
          className={cn("status-bar-fill", getFillClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!label && showText && (
        <div className="text-xs text-right font-medium tabular-nums">
          {current} / {max}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
