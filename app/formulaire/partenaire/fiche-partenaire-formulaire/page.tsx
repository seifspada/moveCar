//fiche-partenaire-formulaire/page.tsx

'use client';
import { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, Building2, Calendar, Phone, CalendarClock, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import NavFormulaire from '@/app/components/navFormulaire';
import { PartenaireAPI } from '@/app/api/partenaire/fiche-partenaire/route';
import { DemandePartenaireData, StatutEntreprise, TypeRendezvous } from '@/app/type/partenaire';

type FormData = {
  nom: string; entite: string; statut: StatutEntreprise | ''; telephone: string;
  email: string; confirmEmail: string; nombreDeplacements: string; nombreAgences: string;
  typeRdv: TypeRendezvous | ''; dateRdv: string; creneau: string;
};

export default function FichePartenaireContact() {
  const [formData, setFormData] = useState<FormData>({
    nom: '', entite: '', statut: '', telephone: '', email: '', confirmEmail: '',
    nombreDeplacements: '', nombreAgences: '', typeRdv: '', dateRdv: '', creneau: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datesReservees, setDatesReservees] = useState<string[]>([]);
  const [creneauxReserves, setCreneauxReserves] = useState<string[]>([]);
  const [creneauxDisponibles, setCreneauxDisponibles] = useState<string[]>([]);
  const [loadingCreneaux, setLoadingCreneaux] = useState(false);
  const [joursCompletementReserves, setJoursCompletementReserves] = useState<string[]>([]);
  const [tousLesCreneaux, setTousLesCreneaux] = useState<string[]>([]);

  const TOUS_LES_CRENEAUX_POSSIBLES = [
    '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
    '11:00 - 11:30', '11:30 - 12:00',
    '13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00',
    '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00',
    '17:00 - 17:30'
  ];

  useEffect(() => {
    const loadDatesIndisponibles = async () => {
      try {
        const response = await PartenaireAPI.getDatesIndisponibles(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        if (response.success) setDatesReservees(response.dates.map(d => d.date));
      } catch (err) {
        console.error('Erreur chargement dates:', err);
      }
    };
    loadDatesIndisponibles();
  }, [currentMonth]);

  useEffect(() => {
    const loadCreneauxDisponibles = async () => {
      if (!formData.dateRdv) return;
      setLoadingCreneaux(true);
      try {
        const response = await PartenaireAPI.getCreneauxDisponibles(formData.dateRdv);
        if (response.success) {
          if (!response.disponible) {
            setError(`Date indisponible: ${response.motif}`);
            setCreneauxDisponibles([]);
            setCreneauxReserves([]);
            setTousLesCreneaux([]);
          } else {
            // ✅ S'assurer que ce sont des strings
            const disponibles = response.creneaux.map(c => typeof c === 'string' ? c : String(c));
            const reservesFromAPI = response.creneauxReserves?.map(c => typeof c === 'string' ? c : String(c)) || [];
            
            setCreneauxDisponibles(disponibles);
            
            // ✅ Utiliser tous les créneaux possibles de la journée
            setTousLesCreneaux(TOUS_LES_CRENEAUX_POSSIBLES);
            
            // ✅ Les créneaux réservés = tous les créneaux SAUF ceux disponibles
            const creneauxReservesCalcules = TOUS_LES_CRENEAUX_POSSIBLES.filter(
              creneau => !disponibles.includes(creneau)
            );
            setCreneauxReserves(creneauxReservesCalcules);
            
            setError(null);
            
            // Vérifier si le jour est complètement réservé
            if (disponibles.length === 0 || disponibles.every(c => creneauxReservesCalcules.includes(c))) {
              if (!joursCompletementReserves.includes(formData.dateRdv)) {
                setJoursCompletementReserves([...joursCompletementReserves, formData.dateRdv]);
              }
            }
          }
        }
      } catch (err) {
        console.error('Erreur chargement créneaux:', err);
        setError('Impossible de charger les créneaux disponibles');
      } finally {
        setLoadingCreneaux(false);
      }
    };
    loadCreneauxDisponibles();
  }, [formData.dateRdv]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'typeRdv' && value) setShowCalendar(true);
    if (name === 'dateRdv') setFormData({ ...formData, dateRdv: value, creneau: '' });
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];
    const fields = [
      { value: formData.nom, label: 'Nom' }, { value: formData.entite, label: 'Entité' },
      { value: formData.statut, label: 'Statut dans l\'entreprise' }, { value: formData.telephone, label: 'Téléphone' },
      { value: formData.email, label: 'Email' }, { value: formData.confirmEmail, label: 'Confirmation email' },
      { value: formData.typeRdv, label: 'Type de rendez-vous' }, { value: formData.dateRdv, label: 'Date du rendez-vous' },
      { value: formData.creneau, label: 'Créneau horaire' },
    ];
    fields.forEach(field => { if (!field.value?.trim()) missing.push(field.label); });
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) missing.push('Format email invalide');
    if (formData.email !== formData.confirmEmail) missing.push('Les emails ne correspondent pas');
    return missing;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing.length > 0) { setMissingFields(missing); setShowModal(true); return; }
    setIsLoading(true); setError(null);
    try {
      const apiData: DemandePartenaireData = {
        nom: formData.nom, entite: formData.entite, statut: formData.statut as StatutEntreprise,
        telephone: formData.telephone, email: formData.email, confirmEmail: formData.confirmEmail,
        typeRdv: formData.typeRdv as TypeRendezvous, dateRdv: formData.dateRdv, creneau: formData.creneau,
        ...(formData.nombreDeplacements && { nombreDeplacements: parseInt(formData.nombreDeplacements) }),
        ...(formData.nombreAgences && { nombreAgences: parseInt(formData.nombreAgences) }),
      };
      const response = await PartenaireAPI.createDemande(apiData);
      if (response.success) { setIsSubmitted(true); setMissingFields([]); setShowModal(true); }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la soumission');
      setShowModal(true); setMissingFields([err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ nom: '', entite: '', statut: '', telephone: '', email: '', confirmEmail: '',
      nombreDeplacements: '', nombreAgences: '', typeRdv: '', dateRdv: '', creneau: '' });
    setShowCalendar(false); setError(null);
  };

  const isWeekend = (date: Date): boolean => { const day = date.getDay(); return day === 0 || day === 6; };
  const isDateReserved = (dateStr: string): boolean => datesReservees.includes(dateStr);
  const isDateFullyBooked = (dateStr: string): boolean => joursCompletementReserves.includes(dateStr);
  const isCreneauReserved = (creneau: string): boolean => creneauxReserves.includes(creneau);

  // ✅ Fonction helper pour formater date en YYYY-MM-DD sans décalage UTC
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1), lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // ✅ Ajuster pour commencer par lundi (0 = dimanche, 1 = lundi, etc.)
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Si dimanche, mettre à la fin
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
    return days;
  };

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleDateClick = (day: Date | null) => {
    if (!day) return;
    const dateStr = formatDateToString(day);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (day < today || isDateReserved(dateStr) || isWeekend(day) || isDateFullyBooked(dateStr)) return;
    setFormData({ ...formData, dateRdv: dateStr, creneau: '' });
  };

  const formatMonthYear = (date: Date) => date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // ✅ CORRECTION: Utiliser la date locale sans décalage UTC
  const formatDateLocale = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateShort = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR');
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Votre demande de premier contact a été envoyée !</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous avons bien reçu votre demande de contact. Notre équipe commerciale vous contactera 
                  pour votre {formData.typeRdv === 'TELEPHONIQUE' ? 'rendez-vous téléphonique' : 'rendez-vous physique'} 
                  prévu le <strong>{formatDateShort(formData.dateRdv)}</strong> à <strong>{formData.creneau}</strong>.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-orange-600 font-bold">1.</span><span>Confirmation de votre rendez-vous par email à {formData.email}</span></li>
                    <li className="flex items-start gap-2"><span className="text-orange-600 font-bold">2.</span><span>Étude personnalisée de vos besoins en transport</span></li>
                    <li className="flex items-start gap-2"><span className="text-orange-600 font-bold">3.</span><span>Proposition d'une solution adaptée à votre entreprise</span></li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif de votre demande :</h4>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <p><strong>Nom :</strong> {formData.nom}</p>
                    <p><strong>Entité :</strong> {formData.entite}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                    <p><strong>Téléphone :</strong> {formData.telephone}</p>
                    {formData.nombreDeplacements && <p><strong>Déplacements/mois :</strong> {formData.nombreDeplacements}</p>}
                    {formData.nombreAgences && <p><strong>Nombre d'agences :</strong> {formData.nombreAgences}</p>}
                    <p><strong>Type de RDV :</strong> {formData.typeRdv === 'TELEPHONIQUE' ? 'Téléphonique' : 'Physique'}</p>
                    <p><strong>Date :</strong> {formatDateLocale(formData.dateRdv)}</p>
                    {formData.creneau && <p><strong>Créneau :</strong> {formData.creneau}</p>}
                  </div>
                </div>
                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors">
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
    <div className="min-h-screen bg-black py-12 px-4">
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
            {error && !showModal && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}

            <div className="space-y-8">
              {/* SECTION 1 */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-5 flex items-center gap-3">
                  <Building2 className="w-6 h-6" />1. Informations de Premier Contact
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'nom', label: 'Nom', type: 'text' },
                    { name: 'entite', label: 'Entité', type: 'text' },
                    { name: 'telephone', label: 'Téléphone', type: 'tel' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'confirmEmail', label: 'Confirmer Email', type: 'email' }
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} <span className="text-orange-500">*</span>
                      </label>
                      <input type={field.type} name={field.name} value={formData[field.name as keyof FormData]} onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut dans l'entreprise <span className="text-orange-500">*</span></label>
                    <select name="statut" value={formData.statut} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black bg-white">
                      <option value="">Sélectionnez votre statut</option>
                      {['DIRECTEUR_GENERAL', 'DIRECTEUR', 'MANAGER', 'RESPONSABLE_TRANSPORT', 'RESPONSABLE_LOGISTIQUE', 'CHEF_ENTREPRISE', 'AUTRE'].map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-5">2. Renseignements</h3>
                <div className="space-y-4">
                  {[
                    { name: 'nombreDeplacements', label: 'Nombre de déplacements par mois' },
                    { name: 'nombreAgences', label: "Nombre d'agences" }
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                      <input type="number" name={field.name} value={formData[field.name as keyof FormData]} onChange={handleInputChange} min={field.name === 'nombreAgences' ? '1' : '0'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black" />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3 */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-5 flex items-center gap-3">
                  <Calendar className="w-6 h-6" />3. Rendez-vous souhaité pour étude de vos besoins
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Type de rendez-vous <span className="text-orange-500">*</span></label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { value: 'TELEPHONIQUE', icon: Phone, label: 'RDV téléphonique' },
                        { value: 'PHYSIQUE', icon: CalendarClock, label: 'RDV physique' }
                      ].map(({ value, icon: Icon, label }) => (
                        <label key={value} className={`flex items-center gap-3 p-4 border-2 rounded-full cursor-pointer transition-all ${
                          formData.typeRdv === value ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-300'
                        }`}>
                          <input type="radio" name="typeRdv" value={value} checked={formData.typeRdv === value} onChange={handleInputChange} className="w-5 h-5 text-orange-600" />
                          <Icon className="w-6 h-6 text-orange-600" />
                          <span className="font-medium text-gray-900">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {showCalendar && (
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* ✅ CALENDRIER À GAUCHE */}
                      <div className="md:w-1/2">
                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition">
                              <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <h4 className="text-sm font-semibold text-gray-900 capitalize">{formatMonthYear(currentMonth)}</h4>
                            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition">
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, idx) => (
                              <div key={idx} className="text-center text-[10px] font-semibold text-gray-600 py-0.5">{day}</div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-0.5">
                            {getDaysInMonth(currentMonth).map((day, idx) => {
                              if (!day) return <div key={idx} className="aspect-square" />;
                              const dateStr = formatDateToString(day);
                              const today = new Date(); today.setHours(0, 0, 0, 0);
                              const todayStr = formatDateToString(today);
                              const isToday = dateStr === todayStr;
                              const isSelected = dateStr === formData.dateRdv;
                              const isDisabled = day < today || isDateReserved(dateStr) || isWeekend(day) || isDateFullyBooked(dateStr);
                              return (
                                <button key={idx} type="button" onClick={() => handleDateClick(day)} disabled={isDisabled}
                                  className={`aspect-square rounded text-[10px] font-medium transition-all relative flex items-center justify-center ${
                                    isSelected ? 'bg-orange-500 text-white shadow-md scale-110' :
                                    isDateFullyBooked(dateStr) ? 'bg-red-50 text-red-400 cursor-not-allowed' :
                                    isDateReserved(dateStr) ? 'bg-red-100 text-red-400 cursor-not-allowed line-through' :
                                    isWeekend(day) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                    day < today ? 'text-gray-300 cursor-not-allowed' :
                                    isToday ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                                    'hover:bg-gray-50 text-gray-700'
                                  }`}>
                                  {day.getDate()}
                                  {isDateFullyBooked(dateStr) && <X className="w-2.5 h-2.5 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                                </button>
                              );
                            })}
                          </div>
                          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-gray-600 flex-wrap">
                            {[
                              { color: 'bg-orange-500', label: 'Sélectionné' },
                              { color: 'bg-gray-100', label: 'Weekend' },
                              { color: 'bg-red-50', label: 'Complet', hasX: true },
                              { color: 'bg-red-100', label: 'Réservé' }
                            ].map(({ color, label, hasX }) => (
                              <div key={label} className="flex items-center gap-1">
                                <div className={`w-2.5 h-2.5 ${color} rounded relative`}>
                                  {hasX && <X className="w-2 h-2 text-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
                                </div>
                                <span className="text-[9px]">{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ✅ HORAIRES À DROITE - DESIGN IDENTIQUE À L'ANCIENNE INTERFACE */}
                      <div className="md:w-1/2">
                        {!formData.dateRdv ? (
                          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-6">
                            <p className="text-gray-500 text-sm text-center">Sélectionnez une date pour voir les créneaux disponibles</p>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Créneau horaire <span className="text-orange-500">*</span>
                            </label>
                            {loadingCreneaux ? (
                              <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                                <span className="ml-2 text-gray-600">Chargement...</span>
                              </div>
                            ) : tousLesCreneaux.length === 0 ? (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                Aucun créneau disponible pour cette date
                              </div>
                            ) : (
                              <>
                                <div className="grid grid-cols-2 gap-2">
                                  {tousLesCreneaux.map((creneau, index) => {
                                    const isReserved = isCreneauReserved(creneau);
                                    return (
                                      <button 
  key={`${creneau}-${index}`}
  type="button" 
  onClick={() => !isReserved && setFormData({ ...formData, creneau })} 
  disabled={isReserved}
  className={`p-2.5 border-2 rounded-lg text-xs font-medium transition-all ${
    formData.creneau === creneau 
      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md' 
      : isReserved
      ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed'
      : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50 text-gray-700'
  }`}
>
  {/* Texte du créneau */}
  <span className={isReserved ? 'line-through' : ''}>
    {creneau}
  </span>

  {/* Mot "Réservé" sans ligne */}
  {isReserved && (
    <div className="text-[10px] text-red-500 mt-0.5 no-underline">
      Réservé
    </div>
  )}
</button>
                                    );
                                  })}
                                </div>
                                <p className="mt-3 text-xs text-gray-600">
                                  Les créneaux barrés sont déjà réservés pour cette date
                                </p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="button" onClick={handleCancel} disabled={isLoading}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-full hover:bg-gray-300 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  Annuler
                </button>
                <button type="button" onClick={onSubmit} disabled={isLoading}
                  className="flex-1 bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin" />Envoi en cours...</>) : 'Envoyer la demande'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-6 text-sm">Notre équipe commerciale vous contactera dans les plus brefs délais</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? '✓ Formulaire validé' : '⚠ Champs manquants'}
            </h3>
            {missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold mb-2">Votre demande a été soumise avec succès!</p>
                <p className="text-green-700 text-sm">Nous vous contacterons très prochainement.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">Veuillez remplir les champs suivants:</p>
                <ul className="list-disc list-inside text-red-600 mb-6 space-y-1">
                  {missingFields.map((field, idx) => (<li key={idx}>{field}</li>))}
                </ul>
              </>
            )}
            <button onClick={() => setShowModal(false)} className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition font-semibold">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}