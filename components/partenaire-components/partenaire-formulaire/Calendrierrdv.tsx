import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  currentMonth: Date;
  selectedDate: string;
  getDaysInMonth: (date: Date) => (Date | null)[];
  formatDateToString: (date: Date) => string;
  formatMonthYear: (date: Date) => string;
  isDateReserved: (dateStr: string) => boolean;
  isDateFullyBooked: (dateStr: string) => boolean;
  isWeekend: (date: Date) => boolean;
  onDateClick: (day: Date | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function CalendrierRdv({
  currentMonth,
  selectedDate,
  getDaysInMonth,
  formatDateToString,
  formatMonthYear,
  isDateReserved,
  isDateFullyBooked,
  isWeekend,
  onDateClick,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDateToString(today);

  return (
    <div className="bg-white rounded-lg p-2 border border-gray-200">
      {/* Navigation mois */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h4 className="text-sm font-semibold text-gray-900 capitalize">
          {formatMonthYear(currentMonth)}
        </h4>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
          <div
            key={idx}
            className="text-center text-[10px] font-semibold text-gray-600 py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-0.5">
        {getDaysInMonth(currentMonth).map((day, idx) => {
          if (!day) return <div key={idx} className="aspect-square" />;

          const dateStr = formatDateToString(day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const isDisabled =
            day < today ||
            isDateReserved(dateStr) ||
            isWeekend(day) ||
            isDateFullyBooked(dateStr);
          const isFullyBooked = isDateFullyBooked(dateStr);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onDateClick(day)}
              disabled={isDisabled}
              className={`aspect-square rounded text-[10px] font-medium transition-all relative flex items-center justify-center ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-md scale-110'
                  : isFullyBooked
                  ? 'bg-red-50 text-red-400 cursor-not-allowed'
                  : isDateReserved(dateStr)
                  ? 'bg-red-100 text-red-400 cursor-not-allowed line-through'
                  : isWeekend(day)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : day < today
                  ? 'text-gray-300 cursor-not-allowed'
                  : isToday
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {day.getDate()}
              {isFullyBooked && (
                <X className="w-2.5 h-2.5 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-gray-600 flex-wrap">
        {[
          { color: 'bg-orange-500', label: 'Sélectionné' },
          { color: 'bg-gray-100', label: 'Weekend' },
          { color: 'bg-red-50', label: 'Complet', hasX: true },
          { color: 'bg-red-100', label: 'Réservé' },
        ].map(({ color, label, hasX }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 ${color} rounded relative`}>
              {hasX && (
                <X className="w-2 h-2 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
            <span className="text-[9px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}