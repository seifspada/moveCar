import { Calendar, Phone, CalendarClock } from 'lucide-react';

import Creneaux from './Creneaux';
import { PartenaireFormData } from '@/app/hooks/usePartenaireForm';
import FormSection from './Formsection';
import CalendrierRdv from './Calendrierrdv';

type Props = {
  formData: PartenaireFormData;
  showCalendar: boolean;
  currentMonth: Date;
  tousLesCreneaux: string[];
  loadingCreneaux: boolean;
  getDaysInMonth: (date: Date) => (Date | null)[];
  formatDateToString: (date: Date) => string;
  formatMonthYear: (date: Date) => string;
  isDateReserved: (dateStr: string) => boolean;
  isDateFullyBooked: (dateStr: string) => boolean;
  isCreneauReserved: (creneau: string) => boolean;
  isWeekend: (date: Date) => boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDateClick: (day: Date | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectCreneau: (creneau: string) => void;
};

export default function RendezVous({
  formData,
  showCalendar,
  currentMonth,
  tousLesCreneaux,
  loadingCreneaux,
  getDaysInMonth,
  formatDateToString,
  formatMonthYear,
  isDateReserved,
  isDateFullyBooked,
  isCreneauReserved,
  isWeekend,
  onChange,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  onSelectCreneau,
}: Props) {
  return (
    <FormSection
      title="3. Rendez-vous souhaité pour étude de vos besoins"
      icon={<Calendar className="w-6 h-6" />}
      variant="orange"
    >
      <div className="space-y-6">
        {/* Type de RDV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Type de rendez-vous <span className="text-orange-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: 'TELEPHONIQUE', icon: Phone, label: 'RDV téléphonique' },
              { value: 'PHYSIQUE', icon: CalendarClock, label: 'RDV physique' },
            ].map(({ value, icon: Icon, label }) => (
              <label
                key={value}
                className={`flex items-center gap-3 p-4 border-2 rounded-full cursor-pointer transition-all ${
                  formData.typeRdv === value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <input
                  type="radio"
                  name="typeRdv"
                  value={value}
                  checked={formData.typeRdv === value}
                  onChange={onChange}
                  className="w-5 h-5 text-orange-600"
                />
                <Icon className="w-6 h-6 text-orange-600" />
                <span className="font-medium text-gray-900">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calendrier + Créneaux */}
        {showCalendar && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <CalendrierRdv
                currentMonth={currentMonth}
                selectedDate={formData.dateRdv}
                getDaysInMonth={getDaysInMonth}
                formatDateToString={formatDateToString}
                formatMonthYear={formatMonthYear}
                isDateReserved={isDateReserved}
                isDateFullyBooked={isDateFullyBooked}
                isWeekend={isWeekend}
                onDateClick={onDateClick}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
              />
            </div>
            <div className="md:w-1/2">
              <Creneaux
                dateRdv={formData.dateRdv}
                tousLesCreneaux={tousLesCreneaux}
                selectedCreneau={formData.creneau}
                isCreneauReserved={isCreneauReserved}
                onSelect={onSelectCreneau}
                loading={loadingCreneaux}
              />
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}