import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  isActive: boolean;
  onTimeUp?: () => void;
  maxTime?: number; // in seconds
}

const Timer: React.FC<TimerProps> = ({ isActive, onTimeUp, maxTime }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => {
          const newSeconds = s + 1;
          if (maxTime && newSeconds >= maxTime) {
            onTimeUp?.();
            return maxTime;
          }
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, maxTime, onTimeUp]);

  // Reset timer when not active
  useEffect(() => {
    if (!isActive) {
      setSeconds(0);
    }
  }, [isActive]);

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-lg font-mono font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
      <Clock className="w-5 h-5 text-blue-600" />
      <span className={isActive ? 'text-blue-600' : ''}>{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;
