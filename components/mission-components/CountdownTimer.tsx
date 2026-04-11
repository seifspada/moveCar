// components/mission-components/CountdownTimer.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  dateDepartMax: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalHours: number;
}

export default function CountdownTimer({ dateDepartMax, className = '' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    totalHours: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date().getTime();
      const targetDate = new Date(dateDepartMax).getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          totalHours: 0,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const totalHours = days * 24 + hours;

      return {
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
        totalHours,
      };
    };

    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [dateDepartMax]);

  // Déterminer la couleur selon l'urgence
  const getUrgencyStyles = () => {
    if (timeRemaining.isExpired) {
      return {
        bg: 'bg-gray-100',
        border: 'border-gray-300',
        text: 'text-gray-600',
        iconColor: 'text-gray-500',
      };
    }
    if (timeRemaining.totalHours < 6) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-600',
        iconColor: 'text-red-600',
      };
    }
    if (timeRemaining.totalHours < 24) {
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-600',
        iconColor: 'text-orange-600',
      };
    }
    return {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-600',
      iconColor: 'text-red-600',
    };
  };

  const styles = getUrgencyStyles();

  if (timeRemaining.isExpired) {
    return (
      <div className={`${styles.bg} border-2 ${styles.border} p-6 rounded-lg text-center ${className}`}>
        <div className="flex items-center justify-center mb-3">
          <Clock className={styles.iconColor} size={28} />
          <span className={`text-lg font-medium ${styles.text} ml-2`}>
            Délai de réservation expiré
          </span>
        </div>
        <p className="text-sm text-gray-600">Cette mission n'est plus disponible</p>
      </div>
    );
  }

  // Format: afficher jours si > 0, sinon HH:MM:SS
  const displayTime = timeRemaining.days > 0 
    ? `${timeRemaining.days}j ${String(timeRemaining.hours).padStart(2, '0')}:${String(timeRemaining.minutes).padStart(2, '0')}:${String(timeRemaining.seconds).padStart(2, '0')}`
    : `${String(timeRemaining.totalHours).padStart(2, '0')}:${String(timeRemaining.minutes).padStart(2, '0')}:${String(timeRemaining.seconds).padStart(2, '0')}`;

  return (
    <div className={`${styles.bg} border-2 ${styles.border} p-6 rounded-lg text-center ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-center mb-3">
        <Clock className={styles.iconColor} size={28} />
        <span className={`text-lg font-medium ${styles.text} ml-2`}>
          Temps restant pour réservation
        </span>
      </div>

      {/* Compte à rebours - Style ancien */}
      <div className={`text-5xl font-bold ${styles.text} font-mono`}>
        {displayTime}
      </div>

      {/* Info supplémentaire si moins de 24h */}
      {timeRemaining.totalHours < 24 && !timeRemaining.isExpired && (
        <div className="mt-3">
          <span className={`text-sm font-medium ${styles.text}`}>
            ⚠️ Moins de {timeRemaining.totalHours}h restantes
          </span>
        </div>
      )}
    </div>
  );
}
