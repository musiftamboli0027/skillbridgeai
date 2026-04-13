import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon, Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md transition-colors duration-300 ${
      timeLeft < 30 ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-white'
    }`}>
      <TimerIcon className={`w-4 h-4 ${timeLeft < 30 ? 'animate-pulse' : ''}`} />
      <span className="font-mono text-lg font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
