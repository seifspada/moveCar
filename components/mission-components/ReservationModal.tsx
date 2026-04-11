// components/mission-components/ReservationModal.tsx
import { X, Calendar, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { useCreateReservation } from '@/app/hooks/useCreateReservation';
import { getVehicleConfig } from '@/app/config/mission-icons.config';
import type { MissionDetail } from '@/app/types/mission';
import { useState, useEffect, useMemo } from 'react';
import { ReservationErrorCode } from '@/app/types/reservation';
import { toast } from 'sonner';

interface ReservationModalProps {
  mission: MissionDetail;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (reservationData: ReservationData) => void;
  estimatedDuration?: number;
}

export interface ReservationData {
  missionId: string;
  dateDepart: string;
  heureDepart: string;
  dateArrivee: string;
  heureArrivee: string;
}

export default function ReservationModal({ 
  mission, 
  isOpen, 
  onClose, 
  onConfirm,
  estimatedDuration = 0 
}: ReservationModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [arrivalDateTime, setArrivalDateTime] = useState({ date: '', time: '' });
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({});

  const { createReservation, loading, error } = useCreateReservation();

  // ✅ Parser les dates ISO ou format legacy (fonction pure)
  const parseDateTime = (dateStr: string) => {
    if (!dateStr) return { date: '', time: '00:00' };
    
    if (dateStr.includes('T')) {
      const isoDate = new Date(dateStr);
      
      const year = isoDate.getFullYear();
      const month = String(isoDate.getMonth() + 1).padStart(2, '0');
      const day = String(isoDate.getDate()).padStart(2, '0');
      const date = `${year}-${month}-${day}`;
      
      const hours = String(isoDate.getHours()).padStart(2, '0');
      const minutes = String(isoDate.getMinutes()).padStart(2, '0');
      const time = `${hours}:${minutes}`;
      
      return { date, time };
    }
    
    const [datePart, timePart] = dateStr.split(' - ');
    if (!datePart) return { date: '', time: '00:00' };
    
    const [day, month, year] = datePart.split('/');
    const date = `${year}-${month}-${day}`;
    const time = timePart || '00:00';
    
    return { date, time };
  };

  const dateMin = useMemo(() => {
    const result = parseDateTime(mission.disponibilite?.dateDebut || '');
    console.log('📅 dateMin calculé:', result);
    return result;
  }, [mission.disponibilite?.dateDebut]);

  const dateMax = useMemo(() => {
    const result = parseDateTime(
      mission.disponibilite?.dateDepartMax || mission.disponibilite?.dateFin || ''
    );
    console.log('📅 dateMax calculé:', result);
    return result;
  }, [mission.disponibilite?.dateDepartMax, mission.disponibilite?.dateFin]);

  const formatISOToReadable = useMemo(() => {
    return (isoStr: string) => {
      if (!isoStr) return '';
      
      if (isoStr.includes('T')) {
        const date = new Date(isoStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} à ${hours}:${minutes}`;
      }
      
      return isoStr;
    };
  }, []);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const departDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      const durationMinutes = estimatedDuration || Math.round(((mission.calculs?.distanceKm || 0) / 80) * 60);
      departDateTime.setMinutes(departDateTime.getMinutes() + durationMinutes);

      const arrivalDate = departDateTime.toISOString().split('T')[0];
      const arrivalTime = departDateTime.toTimeString().slice(0, 5);

      setArrivalDateTime({ date: arrivalDate, time: arrivalTime });
    }
  }, [selectedDate, selectedTime, estimatedDuration, mission.calculs?.distanceKm]);

  const validateSelection = () => {
    const newErrors: { date?: string; time?: string } = {};

    if (!selectedDate) {
      newErrors.date = 'Veuillez sélectionner une date';
    } else if (selectedDate < dateMin.date || selectedDate > dateMax.date) {
      newErrors.date = `La date doit être entre le ${formatISOToReadable(mission.disponibilite?.dateDebut || '')} et le ${formatISOToReadable(mission.disponibilite?.dateDepartMax || mission.disponibilite?.dateFin || '')}`;
    }

    if (!selectedTime) {
      newErrors.time = 'Veuillez sélectionner une heure';
    } else if (selectedDate === dateMin.date && selectedTime < dateMin.time) {
      newErrors.time = `L'heure doit être après ${dateMin.time}`;
    } else if (selectedDate === dateMax.date && selectedTime > dateMax.time) {
      newErrors.time = `L'heure doit être avant ${dateMax.time}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ MODIFIÉ : Confirmer la réservation avec gestion des codes d'erreur
// components/mission-components/ReservationModal.tsx

// ✅ MODIFIÉ : Confirmer la réservation avec logs détaillés
// components/mission-components/ReservationModal.tsx

const handleConfirm = async () => {
  if (!validateSelection()) {
    toast.error('Veuillez sélectionner une date et une heure valides');
    return;
  }

  const payload = {
    missionId: mission.id,
    dateDepart: selectedDate,
    heureDepart: selectedTime,
  };
  
  // ✅ TYPER correctement toastId
  const toastId = toast.loading('Création de la réservation...') as string | number;
  
  try {
    const response = await createReservation(payload);

    console.log('📥 Réponse complète:', response);
    console.log('📥 response.success:', response.success);
    console.log('📥 response.code:', response.code);
    console.log('📥 Type de response.code:', typeof response.code);
    console.log('📥 response.message:', response.message);

    if (response.success && response.reservation) {
      toast.success(
        `Réservation créée !\n\nNuméro: ${response.reservation.numeroReservation}\nStatut: ${response.reservation.statut}`,
        { id: toastId, duration: 5000 }
      );

      if (onConfirm) {
        onConfirm({
          missionId: mission.id,
          dateDepart: selectedDate,
          heureDepart: selectedTime,
          dateArrivee: arrivalDateTime.date,
          heureArrivee: arrivalDateTime.time
        });
      }

      onClose();
    } else {
      console.log('⚠️ Échec, appel handleReservationError avec:', response.code);
      handleReservationError(response.code, response.message, toastId);
    }
  } catch (err: any) {
    console.error('❌ Erreur catch:', err);
    toast.error(
      err.message || 'Erreur lors de la création',
      { id: toastId, duration: 5000 }
    );
  }
};

// ✅ MODIFIER la signature pour accepter string | number
const handleReservationError = (code?: string, message?: string, toastId?: string | number) => {
  console.log('🔧 handleReservationError appelé');
  console.log('🔧 code reçu:', code);
  console.log('🔧 type de code:', typeof code);
  console.log('🔧 message reçu:', message);
  console.log('🔧 ReservationErrorCode.RESERVATION_ALREADY_EXISTS:', ReservationErrorCode.RESERVATION_ALREADY_EXISTS);
  console.log('🔧 Égalité stricte:', code === ReservationErrorCode.RESERVATION_ALREADY_EXISTS);
  console.log('🔧 Égalité non stricte:', code == ReservationErrorCode.RESERVATION_ALREADY_EXISTS);

  // ✅ Fermer le toast de loading d'abord
  if (toastId) {
    toast.dismiss(toastId);
  }

  switch (code) {
    case ReservationErrorCode.RESERVATION_ALREADY_EXISTS:
      console.log('✅ Case RESERVATION_ALREADY_EXISTS atteint');
      toast.info('📋 Demande déjà envoyée', {
        description: 'Vous avez déjà une réservation en attente pour cette mission',
        duration: 6000,
      });
      onClose();
      break;

    case ReservationErrorCode.MISSION_NOT_AVAILABLE:
      console.log('✅ Case MISSION_NOT_AVAILABLE atteint');
      toast.error('Mission indisponible', {
        description: 'Cette mission n\'est plus disponible',
        duration: 5000,
      });
      onClose();
      break;

    case ReservationErrorCode.ADHERENT_NOT_AUTHORIZED:
      console.log('✅ Case ADHERENT_NOT_AUTHORIZED atteint');
      toast.error('Compte non autorisé', {
        description: 'Votre compte doit être actif pour réserver',
        duration: 5000,
      });
      break;

    case ReservationErrorCode.INVALID_DEPARTURE_DATE:
      console.log('✅ Case INVALID_DEPARTURE_DATE atteint');
      toast.error('Date invalide', {
        description: message || 'La date de départ n\'est pas valide',
        duration: 5000,
      });
      break;

    case ReservationErrorCode.MISSION_NOT_FOUND:
      console.log('✅ Case MISSION_NOT_FOUND atteint');
      toast.error('Mission introuvable', {
        description: 'Cette mission n\'existe plus',
        duration: 5000,
      });
      onClose();
      break;

    case ReservationErrorCode.GRAPHQL_ERROR:
      console.log('✅ Case GRAPHQL_ERROR atteint');
      toast.error('Erreur de connexion', {
        description: 'Impossible de contacter le serveur',
        duration: 5000,
      });
      break;

    default:
      console.log('⚠️ Case DEFAULT atteint, code inconnu:', code);
      toast.error(message || 'La réservation n\'a pas pu être créée', {
        duration: 5000,
      });
  }
};


// ✅ MODIFIÉ : Fonction avec logs détaillés


  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (!isOpen) return null;

  const vehicleConfigData = getVehicleConfig(mission.vehicule?.typeVehicule);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-orange-500/30 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-500" />
              Réserver cette mission
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Sélectionnez votre date et heure de départ
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mission Info */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-orange-500/20">
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-orange-500" />
              <div className="flex-1">
                <div className="text-white font-semibold">
                  {mission.adresseDepart?.villeNom} → {mission.adresseArrivee?.villeNom}
                </div>
                <div className="text-sm text-gray-400">
                  {mission.calculs?.distanceKm} km • {vehicleConfigData.label}
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Date de départ *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={dateMin.date}
              max={dateMax.date}
              disabled={loading}
              className={`w-full bg-slate-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                errors.date 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:ring-orange-500'
              }`}
            />
            {errors.date && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.date}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Période autorisée : {formatISOToReadable(mission.disponibilite?.dateDebut || '')} au {formatISOToReadable(mission.disponibilite?.dateDepartMax || mission.disponibilite?.dateFin || '')}
            </p>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Heure de départ *
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={loading}
              className={`w-full bg-slate-800 text-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                errors.time 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-orange-500/30 focus:ring-orange-500'
              }`}
            />
            {errors.time && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.time}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Horaires autorisés : {dateMin.time} - {dateMax.time}
            </p>
          </div>

          {/* Estimated Arrival */}
          {selectedDate && selectedTime && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-white font-semibold mb-2">
                    Arrivée estimée
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Date d'arrivée</div>
                      <div className="text-white font-semibold">
                        {formatDate(arrivalDateTime.date)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Heure d'arrivée</div>
                      <div className="text-white font-semibold">
                        {arrivalDateTime.time}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Durée estimée : {Math.round((estimatedDuration || ((mission.calculs?.distanceKm || 0) / 80) * 60))} minutes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Backend Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="text-sm text-red-300">
                  <p className="font-semibold text-red-400 mb-1">Erreur</p>
                  <p>{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-1">Information importante</p>
                <p>La réservation sera confirmée après validation. Vous recevrez un email de confirmation avec tous les détails de votre mission.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-orange-500/30 p-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime || loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
          >
            {loading ? 'Création en cours...' : 'Confirmer la réservation'}
          </button>
        </div>
      </div>
    </div>
  );
}
