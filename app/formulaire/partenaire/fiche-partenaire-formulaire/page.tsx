'use client';
import { UserPlus } from 'lucide-react';
import NavFormulaire from '@/app/components/navFormulaire';
import SuccessView from '@/components/partenaire-components/partenaire-formulaire/Successview';
import InfosContact from '@/components/partenaire-components/partenaire-formulaire/Infoscontact';
import Renseignements from '@/components/partenaire-components/partenaire-formulaire/Renseignements';
import RendezVous from '@/components/partenaire-components/partenaire-formulaire/Rendezvous';
import FormActions from '@/components/partenaire-components/partenaire-formulaire/Formactions';
import FormModal from '@/components/partenaire-components/partenaire-formulaire/Formmodal';
import { usePartenaireForm } from '@/app/hooks/usePartenaireForm';
export default function FichePartenaireContact() {
  const {
    formData,
    showModal, setShowModal,
    missingFields,
    isSubmitted,
    showCalendar,
    currentMonth,
    isLoading,
    error,
    tousLesCreneaux,
    loadingCreneaux,
    handleInputChange,
    setCreneau,
    handleDateClick,
    onSubmit,
    handleCancel,
    formatDateToString,
    formatDateLocale,
    formatDateShort,
    formatMonthYear,
    getDaysInMonth,
    isWeekend,
    isDateReserved,
    isDateFullyBooked,
    isCreneauReserved,
    handlePrevMonth,
    handleNextMonth,
  } = usePartenaireForm();

  if (isSubmitted) {
    return (
      <SuccessView
        formData={formData}
        formatDateLocale={formatDateLocale}
        formatDateShort={formatDateShort}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <NavFormulaire />

      <div className="max-w-4xl mx-auto pt-15 md:pt-30 sm:pt-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <UserPlus className="w-8 h-8" />
              Fiche Partenaire - Premier Contact
            </h2>
            <p className="mt-2 text-orange-100">
              Demande d'étude de vos besoins en transport
            </p>
          </div>

          <div className="p-8">
            {/* Erreur globale */}
            {error && !showModal && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-8">
              <InfosContact formData={formData} onChange={handleInputChange} />

              <Renseignements formData={formData} onChange={handleInputChange} />

              <RendezVous
                formData={formData}
                showCalendar={showCalendar}
                currentMonth={currentMonth}
                tousLesCreneaux={tousLesCreneaux}
                loadingCreneaux={loadingCreneaux}
                getDaysInMonth={getDaysInMonth}
                formatDateToString={formatDateToString}
                formatMonthYear={formatMonthYear}
                isDateReserved={isDateReserved}
                isDateFullyBooked={isDateFullyBooked}
                isCreneauReserved={isCreneauReserved}
                isWeekend={isWeekend}
                onChange={handleInputChange}
                onDateClick={handleDateClick}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onSelectCreneau={setCreneau}
              />

              <FormActions
                isLoading={isLoading}
                onCancel={handleCancel}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Notre équipe commerciale vous contactera dans les plus brefs délais
        </p>
      </div>

      <FormModal
        show={showModal}
        missingFields={missingFields}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}