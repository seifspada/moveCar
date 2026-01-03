import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DateTimePickerProps = {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  label: string;
};

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  label
}: DateTimePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatMonthYear = (date: Date) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: Date | null) => {
    if (!day) return;
    const dateStr = day.toISOString().split('T')[0];
    onDateChange(dateStr);
  };

  const handleReset = () => {
    onDateChange('');
    onTimeChange('');
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label} <span className="text-orange-500">*</span>
      </label>

      {/* Box d'affichage de la sélection */}
      {selectedDate && selectedTime && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Date sélectionnée</p>
            <p className="text-lg font-bold text-orange-700">
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-md font-semibold text-orange-600 mt-1">
              Horaire : {selectedTime}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-orange-600 hover:text-orange-800 font-semibold text-sm"
          >
            Modifier
          </button>
        </div>
      )}

      {/* Calendrier et Créneaux côte à côte */}
      <div className="grid grid-cols-2 gap-4">
        {/* Calendrier */}
        <div className="bg-white rounded-lg p-2 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <ChevronLeft className="w-3 h-3 text-gray-600" />
            </button>
            <h4 className="text-xs font-semibold text-gray-900 capitalize">
              {formatMonthYear(currentMonth)}
            </h4>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, idx) => (
              <div key={idx} className="text-center text-[10px] font-semibold text-gray-600 py-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Jours du mois */}
          <div className="grid grid-cols-7 gap-0.5">
            {getDaysInMonth(currentMonth).map((day, idx) => {
              if (!day) {
                return <div key={idx} className="aspect-square" />;
              }

              const dateStr = day.toISOString().split('T')[0];
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isToday = dateStr === today.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;
              const isPast = day < today;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                  className={`aspect-square rounded text-[10px] font-medium transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-sm scale-105'
                      : isPast
                      ? 'text-gray-300 cursor-not-allowed'
                      : isToday
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Créneaux horaires */}
        {selectedDate && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Créneau horaire <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pr-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  className={`p-1.5 border rounded text-[10px] font-medium transition-all ${
                    selectedTime === slot
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                      : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-gray-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
