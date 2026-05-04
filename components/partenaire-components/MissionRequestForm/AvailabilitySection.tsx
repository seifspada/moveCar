// components/MissionRequestForm/AvailabilitySection.tsx (VERSION SIMPLIFIÉE)
import { DateTimePicker } from '@/app/components/DateTimePicker';
import React from 'react';

interface AvailabilitySectionProps {
  selectedDate1: string;
  selectedTime1: string;
  selectedDate2: string;
  selectedTime2: string;
  onDate1Change: (date: string) => void;
  onTime1Change: (time: string) => void;
  onDate2Change: (date: string) => void;
  onTime2Change: (time: string) => void;
  dateError: string | null;
  onDateErrorChange: (error: string | null) => void;
}

export const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  selectedDate1,
  selectedTime1,
  selectedDate2,
  selectedTime2,
  onDate1Change,
  onTime1Change,
  onDate2Change,
  onTime2Change,
  dateError,
  onDateErrorChange,
}) => {
  const handleDate1Change = (dateStr: string) => {
    onDate1Change(dateStr);
    onDateErrorChange(null);
  };
  const handleDate2Change = (dateStr: string) => {
    onDate2Change(dateStr);
    onDateErrorChange(null);
  };
  const handleTime1Change = (time: string) => {
    onTime1Change(time);
    onDateErrorChange(null);
  };
  const handleTime2Change = (time: string) => {
    onTime2Change(time);
    onDateErrorChange(null);
  };

  return (
    <div
      className={`border-2 rounded-xl p-6 mb-8 bg-gradient-to-br transition-all ${
        dateError ? 'border-red-400 bg-red-50' : 'border-orange-200 from-orange-50 to-white'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold ${dateError ? 'text-red-700' : 'text-orange-700'}`}>
          Disponibilité du véhicule
        </h2>
        {dateError && (
          <span className="text-red-600 text-sm font-semibold animate-pulse">⚠️ Erreur</span>
        )}
      </div>

      {dateError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            {dateError}
          </p>
        </div>
      )}

      <DateTimePicker
        selectedDate={selectedDate1}
        selectedTime={selectedTime1}
        onDateChange={handleDate1Change}
        onTimeChange={handleTime1Change}
        label="Disponible à partir du"
      />

      <DateTimePicker
        selectedDate={selectedDate2}
        selectedTime={selectedTime2}
        onDateChange={handleDate2Change}
        onTimeChange={handleTime2Change}
        label="Livraison au plus tard"
        minDate={selectedDate1}
        minTime={selectedTime1}
      />
    </div>
  );
};