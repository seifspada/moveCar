// components/mission-components/CountdownTimerCompact.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerCompactProps {
  dateDepartMax: string;
}

export function CountdownTimerCompact({ dateDepartMax }: CountdownTimerCompactProps) {
  const [timeString, setTimeString] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const target = new Date(dateDepartMax).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeString('Expiré');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const totalHours = days * 24 + hours;
      setIsUrgent(totalHours < 24);

      // Format compact
      if (days > 0) {
        setTimeString(`${days}j ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      } else {
        setTimeString(`${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [dateDepartMax]);

  const bgColor = isUrgent ? 'bg-red-100' : 'bg-orange-100';
  const textColor = isUrgent ? 'text-red-700' : 'text-orange-700';

  return (
    <div className={`inline-flex items-center gap-2 ${bgColor} ${textColor} px-3 py-1.5 rounded-full border ${isUrgent ? 'border-red-300' : 'border-orange-300'}`}>
      <Clock size={14} className={isUrgent ? 'animate-pulse' : ''} />
      <span className="font-bold text-xs font-mono">{timeString}</span>
    </div>
  );
}
