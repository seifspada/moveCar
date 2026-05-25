'use client';
import { useState, useEffect } from 'react';
import { PartenaireAPI } from '@/lib/api/partenaire-api';
import { DemandePartenaireData, StatutEntreprise, TypeRendezvous } from '@/app/types/partenaire';

export type PartenaireFormData = {
  nom: string;
  entite: string;
  statut: StatutEntreprise | '';
  telephone: string;
  email: string;
  confirmEmail: string;
  nombreDeplacements: string;
  nombreAgences: string;
  typeRdv: TypeRendezvous | '';
  dateRdv: string;
  creneau: string;
};

const INITIAL_FORM: PartenaireFormData = {
  nom: '', entite: '', statut: '', telephone: '', email: '', confirmEmail: '',
  nombreDeplacements: '', nombreAgences: '', typeRdv: '', dateRdv: '', creneau: '',
};

export const TOUS_LES_CRENEAUX_POSSIBLES = [
  '09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00',
  '11:00 - 11:30', '11:30 - 12:00',
  '13:00 - 13:30', '13:30 - 14:00', '14:00 - 14:30', '14:30 - 15:00',
  '15:00 - 15:30', '15:30 - 16:00', '16:00 - 16:30', '16:30 - 17:00',
  '17:00 - 17:30',
];

export function usePartenaireForm() {
  const [formData, setFormData] = useState<PartenaireFormData>(INITIAL_FORM);
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

  // Chargement des dates indisponibles au changement de mois
  useEffect(() => {
    const loadDatesIndisponibles = async () => {
      try {
        const response = await PartenaireAPI.getDatesIndisponibles(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1
        );
        if (response.success) setDatesReservees(response.dates.map((d: any) => d.date));
      } catch (err) {
        console.error('Erreur chargement dates:', err);
      }
    };
    loadDatesIndisponibles();
  }, [currentMonth]);

  // Chargement des créneaux au changement de date
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
            const disponibles = response.creneaux.map((c: any) =>
              typeof c === 'string' ? c : String(c)
            );
            const creneauxReservesCalcules = TOUS_LES_CRENEAUX_POSSIBLES.filter(
              (c) => !disponibles.includes(c)
            );
            setCreneauxDisponibles(disponibles);
            setTousLesCreneaux(TOUS_LES_CRENEAUX_POSSIBLES);
            setCreneauxReserves(creneauxReservesCalcules);
            setError(null);

            if (disponibles.length === 0 || disponibles.every((c: string) => creneauxReservesCalcules.includes(c))) {
              if (!joursCompletementReserves.includes(formData.dateRdv)) {
                setJoursCompletementReserves((prev) => [...prev, formData.dateRdv]);
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
    if (name === 'typeRdv' && value) setShowCalendar(true);
    if (name === 'dateRdv') {
      setFormData((prev) => ({ ...prev, dateRdv: value, creneau: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setCreneau = (creneau: string) => {
    setFormData((prev) => ({ ...prev, creneau }));
  };

  const handleDateClick = (day: Date | null) => {
    if (!day) return;
    const dateStr = formatDateToString(day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      day < today ||
      datesReservees.includes(dateStr) ||
      isWeekend(day) ||
      joursCompletementReserves.includes(dateStr)
    ) return;
    setFormData((prev) => ({ ...prev, dateRdv: dateStr, creneau: '' }));
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];
    const fields = [
      { value: formData.nom, label: 'Nom' },
      { value: formData.entite, label: 'Entité' },
      { value: formData.statut, label: "Statut dans l'entreprise" },
      { value: formData.telephone, label: 'Téléphone' },
      { value: formData.email, label: 'Email' },
      { value: formData.confirmEmail, label: 'Confirmation email' },
      { value: formData.typeRdv, label: 'Type de rendez-vous' },
      { value: formData.dateRdv, label: 'Date du rendez-vous' },
      { value: formData.creneau, label: 'Créneau horaire' },
    ];
    fields.forEach((f) => { if (!f.value?.trim()) missing.push(f.label); });
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      missing.push('Format email invalide');
    if (formData.email !== formData.confirmEmail)
      missing.push('Les emails ne correspondent pas');
    return missing;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing.length > 0) {
      setMissingFields(missing);
      setShowModal(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const apiData: DemandePartenaireData = {
        nom: formData.nom,
        entite: formData.entite,
        statut: formData.statut as StatutEntreprise,
        telephone: formData.telephone,
        email: formData.email,
        confirmEmail: formData.confirmEmail,
        typeRdv: formData.typeRdv as TypeRendezvous,
        dateRdv: formData.dateRdv,
        creneau: formData.creneau,
        ...(formData.nombreDeplacements && { nombreDeplacements: parseInt(formData.nombreDeplacements) }),
        ...(formData.nombreAgences && { nombreAgences: parseInt(formData.nombreAgences) }),
      };
      const response = await PartenaireAPI.createDemande(apiData);
      if (response.success) {
        setIsSubmitted(true);
        setMissingFields([]);
        setShowModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la soumission');
      setShowModal(true);
      setMissingFields([err.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM);
    setShowCalendar(false);
    setError(null);
  };

  // Helpers
  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const formatDateLocale = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const formatDateShort = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('fr-FR');
  };

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  return {
    formData, setFormData,
    showModal, setShowModal,
    missingFields,
    isSubmitted,
    showCalendar,
    currentMonth, setCurrentMonth,
    isLoading,
    error,
    datesReservees,
    creneauxReserves,
    creneauxDisponibles,
    loadingCreneaux,
    joursCompletementReserves,
    tousLesCreneaux,
    handleInputChange,
    setCreneau,
    handleDateClick,
    onSubmit,
    handleCancel,
    formatDateToString,
    formatDateLocale,
    formatDateShort,
    getDaysInMonth,
    isWeekend,
    isDateReserved: (dateStr: string) => datesReservees.includes(dateStr),
    isDateFullyBooked: (dateStr: string) => joursCompletementReserves.includes(dateStr),
    isCreneauReserved: (creneau: string) => creneauxReserves.includes(creneau),
    handlePrevMonth: () =>
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)),
    handleNextMonth: () =>
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)),
    formatMonthYear: (date: Date) =>
      date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
  };
}