
'use client';
import { useState } from 'react';
import { UserPlus, CheckCircle2, Building2, Calendar, Phone, CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import NavFormulaire from '@/app/components/navFormulaire';

type FormData = {
  nom: string;
  entite: string;
  statut: string;
  telephone: string;
  email: string;
  nombreDeplacements: string;
  nombreAgences: string;
  typeRdv: string;
  dateRdv: string;
  creneau?: string;
};

// Dates réservées (à récupérer depuis l'API)
const DATES_RESERVEES = [
  '2026-01-05',
  '2026-01-12',
  '2026-01-18',
  '2026-01-25'
];

// Créneaux horaires disponibles
const CRENEAUX_HORAIRES = [
  '08:30 - 09:00',
  '09:00 - 09:30',
  '09:30 - 10:00',
  '10:00 - 10:30',
  '10:30 - 11:00',
  '11:00 - 11:30',
  '11:30 - 12:00',
  '14:00 - 14:30',
  '14:30 - 15:00',
  '15:00 - 15:30',
  '15:30 - 16:00',
  '16:00 - 16:30',
  '16:30 - 17:00',
  '17:00 - 17:30'
];

// Créneaux réservés par date (à récupérer depuis l'API)
const CRENEAUX_RESERVES: { [key: string]: string[] } = {
  '2026-01-13': ['09:00 - 09:30', '14:00 - 14:30', '15:00 - 15:30'],
  '2026-01-14': ['10:00 - 10:30', '11:00 - 11:30'],
  '2026-01-15': ['08:30 - 09:00', '16:00 - 16:30']
};

export default function FichePartenaireContact() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    entite: '',
    statut: '',
    telephone: '',
    email: '',
    nombreDeplacements: '',
    nombreAgences: '',
    typeRdv: '',
    dateRdv: '',
    creneau: ''
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'typeRdv' && value) {
      setShowCalendar(true);
    }
    
    // Réinitialiser le créneau si on change de date
    if (name === 'dateRdv') {
      setFormData({ ...formData, dateRdv: value, creneau: '' });
    }
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];

    const fields = [
      { value: formData.nom, label: 'Nom' },
      { value: formData.entite, label: 'Entité' },
      { value: formData.statut, label: 'Statut dans l\'entreprise' },
      { value: formData.telephone, label: 'Téléphone' },
      { value: formData.email, label: 'Email' },
      { value: formData.typeRdv, label: 'Type de rendez-vous' },
      { value: formData.dateRdv, label: 'Date du rendez-vous' },
      { value: formData.creneau, label: 'Créneau horaire' },
    ];

    let i = 0;
    while (i < fields.length) {
      const field = fields[i];
      if (!field.value?.trim()) {
        missing.push(field.label);
      }
      i++;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      missing.push('Format email invalide');
    }

    return missing;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = validateForm();
    setMissingFields(missing);
    setShowModal(true);

    if (missing.length === 0) {
      console.log('Fiche partenaire premier contact soumise', formData);
      setIsSubmitted(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: '',
      entite: '',
      statut: '',
      telephone: '',
      email: '',
      nombreDeplacements: '',
      nombreAgences: '',
      typeRdv: '',
      dateRdv: '',
      creneau: ''
    });
    setShowCalendar(false);
  };

  const isDateReserved = (dateStr: string): boolean => {
    return DATES_RESERVEES.includes(dateStr);
  };

  const isCreneauReserved = (dateStr: string, creneau: string): boolean => {
    return CRENEAUX_RESERVES[dateStr]?.includes(creneau) || false;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours vides avant le début du mois
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Ne pas permettre de sélectionner des dates passées ou réservées
    if (day < today || isDateReserved(dateStr)) {
      return;
    }
    
    setFormData({ ...formData, dateRdv: dateStr, creneau: '' });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                Demande de contact envoyée avec succès
              </h2>
            </div>

            <div className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Votre demande de premier contact a été envoyée !
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous avons bien reçu votre demande de contact. Notre équipe commerciale vous contactera 
                  pour votre {formData.typeRdv === 'telephonique' ? 'rendez-vous téléphonique' : 'rendez-vous physique'} 
                  prévu le <strong>{new Date(formData.dateRdv + 'T00:00:00').toLocaleDateString('fr-FR')}</strong> à <strong>{formData.creneau}</strong>.
                </p>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <span>Confirmation de votre rendez-vous par email à {formData.email}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <span>Étude personnalisée de vos besoins en transport</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <span>Proposition d'une solution adaptée à votre entreprise</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif de votre demande :</h4>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <p><strong>Nom :</strong> {formData.nom}</p>
                    <p><strong>Entité :</strong> {formData.entite}</p>
                    <p><strong>Statut :</strong> {formData.statut}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                    <p><strong>Téléphone :</strong> {formData.telephone}</p>
                    {formData.nombreDeplacements && <p><strong>Déplacements/mois :</strong> {formData.nombreDeplacements}</p>}
                    {formData.nombreAgences && <p><strong>Nombre d'agences :</strong> {formData.nombreAgences}</p>}
                    <p><strong>Type de RDV :</strong> {formData.typeRdv === 'telephonique' ? 'Téléphonique' : 'Physique'}</p>
                    <p><strong>Date :</strong> {new Date(formData.dateRdv + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    {formData.creneau && <p><strong>Créneau :</strong> {formData.creneau}</p>}
                  </div>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <NavFormulaire />
      <div className="max-w-4xl mx-auto pt-15 md:pt-30 sm:pt-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <UserPlus className="w-8 h-8" />
              Fiche Partenaire - Premier Contact
            </h2>
            <p className="mt-2 text-orange-100">Demande d'étude de vos besoins en transport</p>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Section 1: Informations de Premier Contact */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-5 flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  1. Informations de Premier Contact
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entité <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="entite"
                      value={formData.entite}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut dans l'entreprise <span className="text-orange-500">*</span>
                    </label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black bg-white"
                    >
                      <option value="">Sélectionnez votre statut</option>
                      <option value="Directeur Général">Directeur Général</option>
                      <option value="Directeur">Directeur</option>
                      <option value="Manager">Manager</option>
                      <option value="Responsable Transport">Responsable Transport</option>
                      <option value="Responsable Logistique">Responsable Logistique</option>
                      <option value="Chef d'entreprise">Chef d'entreprise</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Renseignements */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-5">
                  2. Renseignements
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de déplacements par mois
                    </label>
                    <input
                      type="number"
                      name="nombreDeplacements"
                      value={formData.nombreDeplacements}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'agences
                    </label>
                    <input
                      type="number"
                      name="nombreAgences"
                      value={formData.nombreAgences}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Rendez-vous */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-5 flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  3. Rendez-vous souhaité pour étude de vos besoins
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de rendez-vous <span className="text-orange-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-full cursor-pointer transition-all ${
                        formData.typeRdv === 'telephonique' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="typeRdv"
                          value="telephonique"
                          checked={formData.typeRdv === 'telephonique'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-orange-600"
                        />
                        <Phone className="w-6 h-6 text-orange-600" />
                        <span className="font-medium text-gray-900">RDV téléphonique</span>
                      </label>

                      <label className={`flex items-center gap-3 p-4 border-2 rounded-full cursor-pointer transition-all ${
                        formData.typeRdv === 'physique' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="typeRdv"
                          value="physique"
                          checked={formData.typeRdv === 'physique'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-orange-600"
                        />
                        <CalendarClock className="w-6 h-6 text-orange-600" />
                        <span className="font-medium text-gray-900">RDV physique</span>
                      </label>
                    </div>
                  </div>

                  {showCalendar && (
                    <div className="space-y-6">
                      {/* Calendrier */}
                      <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          <h4 className="text-lg font-semibold text-gray-900 capitalize">
                            {formatMonthYear(currentMonth)}
                          </h4>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>

                        {/* Jours de la semaine */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, idx) => (
                            <div key={idx} className="text-center text-sm font-semibold text-gray-600 py-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Jours du mois */}
                        <div className="grid grid-cols-7 gap-2">
                          {getDaysInMonth(currentMonth).map((day, idx) => {
                            if (!day) {
                              return <div key={idx} className="aspect-square" />;
                            }

                            const dateStr = day.toISOString().split('T')[0];
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isToday = dateStr === today.toISOString().split('T')[0];
                            const isSelected = dateStr === formData.dateRdv;
                            const isReserved = isDateReserved(dateStr);
                            const isPast = day < today;
                            const isDisabled = isPast || isReserved;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleDateClick(day)}
                                disabled={isDisabled}
                                className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                                  isSelected
                                    ? 'bg-orange-500 text-white shadow-lg scale-105'
                                    : isReserved
                                    ? 'bg-red-100 text-red-400 cursor-not-allowed line-through'
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

                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span>Sélectionné</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-100 rounded"></div>
                            <span>Réservé</span>
                          </div>
                        </div>
                      </div>

                      {/* Créneaux horaires */}
                      {formData.dateRdv && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Créneau horaire <span className="text-orange-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {CRENEAUX_HORAIRES.map((creneau) => {
                              const isReserved = isCreneauReserved(formData.dateRdv, creneau);
                              
                              return (
                                <button
                                  key={creneau}
                                  type="button"
                                  onClick={() => !isReserved && setFormData({ ...formData, creneau })}
                                  disabled={isReserved}
                                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                                    formData.creneau === creneau
                                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                                      : isReserved
                                      ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed line-through'
                                      : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-gray-700'
                                  }`}
                                >
                                  {creneau}
                                  {isReserved && (
                                    <div className="text-xs text-red-500 mt-1">Réservé</div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <p className="mt-3 text-sm text-gray-600">
                            Les créneaux barrés sont déjà réservés pour cette date
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-full hover:bg-gray-300 transition-all duration-200 shadow hover:shadow-md"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="flex-1 bg-orange-600  text-white font-semibold py-3.5 px-6 rounded-full hover:bg-green-600  transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Notre équipe commerciale vous contactera dans les plus brefs délais
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? '✓ Formulaire validé' : '⚠ Champs manquants'}
            </h3>

            {missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold mb-2">
                  Votre demande a été soumise avec succès!
                </p>
                <p className="text-green-700 text-sm">
                  Nous vous contacterons très prochainement.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">Veuillez remplir les champs suivants:</p>
                <ul className="list-disc list-inside text-red-600 mb-6 space-y-1">
                  {missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              </>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}