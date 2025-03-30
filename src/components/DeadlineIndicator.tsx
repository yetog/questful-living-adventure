
import React from 'react';
import { format, parseISO, isAfter, differenceInDays, differenceInHours } from 'date-fns';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeadlineIndicatorProps {
  dueDate?: string;
  completed: boolean;
}

const DeadlineIndicator: React.FC<DeadlineIndicatorProps> = ({ dueDate, completed }) => {
  if (!dueDate || completed) return null;
  
  const dueDateObj = parseISO(dueDate);
  const now = new Date();
  const isPastDue = isAfter(now, dueDateObj);
  const daysLeft = differenceInDays(dueDateObj, now);
  const hoursLeft = differenceInHours(dueDateObj, now);
  
  // Format deadline text
  let deadlineText = format(dueDateObj, 'MMM d');
  let statusText = '';
  
  if (isPastDue) {
    statusText = 'Overdue!';
  } else if (daysLeft === 0) {
    statusText = `${hoursLeft}h left`;
  } else if (daysLeft === 1) {
    statusText = 'Tomorrow';
  } else if (daysLeft < 7) {
    statusText = `${daysLeft} days left`;
  }
  
  // Determine color based on urgency
  const colorClass = isPastDue ? 'text-red-500' : 
                    daysLeft < 1 ? 'text-orange-500' : 
                    daysLeft < 3 ? 'text-yellow-500' : 
                    'text-rpg-light';
  
  return (
    <div className={cn("flex items-center gap-1 text-xs", colorClass)}>
      {isPastDue ? (
        <AlertCircle size={12} />
      ) : (
        <Calendar size={12} />
      )}
      <span>
        {deadlineText} • {statusText}
      </span>
    </div>
  );
};

export default DeadlineIndicator;
