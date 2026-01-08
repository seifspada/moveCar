
import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { Mission, vehicleIcons, VehicleType } from '@/app/data/missions';

interface ReservationModalProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reservationData: ReservationData) => void;
  estimatedDuration?: number; // en minutes depuis DynamicMissionsMap
}

export interface ReservationData {
  missionId: number;
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

  // Parser les dates min/max depuis mission
  const parseDateTime = (dateStr: string) => {
    const [datePart, timePart] = dateStr.split(' - ');
    const [day, month, year] = datePart.split('/');
    return {
      date: `${year}-${month}-${day}`,
      time: timePart || '00:00'
    };
  };

  const dateMin = parseDateTime(mission.dateDebutMin);
  const dateMax = parseDateTime(mission.dateDebutMax);

  // Calculer l'heure d'arrivée estimée
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const departDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      // Ajouter la durée estimée (en minutes)
      const durationMinutes = estimatedDuration || Math.round((mission.nbKm / 80) * 60);
      departDateTime.setMinutes(departDateTime.getMinutes() + durationMinutes);

      const arrivalDate = departDateTime.toISOString().split('T')[0];
      const arrivalTime = departDateTime.toTimeString().slice(0, 5);

      setArrivalDateTime({ date: arrivalDate, time: arrivalTime });
    }
  }, [selectedDate, selectedTime, estimatedDuration, mission.nbKm]);

  // Validation
  const validateSelection = () => {
    const newErrors: { date?: string; time?: string } = {};

    if (!selectedDate) {
      newErrors.date = 'Veuillez sélectionner une date';
    } else if (selectedDate < dateMin.date || selectedDate > dateMax.date) {
      newErrors.date = `La date doit être entre le ${mission.dateDebutMin.split(' - ')[0]} et le ${mission.dateDebutMax.split(' - ')[0]}`;
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

  const handleConfirm = () => {
    if (validateSelection()) {
      onConfirm({
        missionId: mission.id,
        dateDepart: selectedDate,
        heureDepart: selectedTime,
        dateArrivee: arrivalDateTime.date,
        heureArrivee: arrivalDateTime.time
      });
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  if (!isOpen) return null;
 const vehicleConfig =
    vehicleIcons[mission.vehicleType as VehicleType] || vehicleIcons.berline;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
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
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Mission Info */}
          <div className="bg-slate-800/50 rounded-full p-4 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Navigation className="w-5 h-5 text-orange-500" />
              <div className="flex-1">
                <div className="text-white font-semibold">
                  {mission.villeDepart} → {mission.villeArrivee}
                </div>
                <div className="text-sm text-gray-400">
                  {mission.nbKm} km • {vehicleConfig.label}
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
              className={`w-full bg-slate-800 text-white border rounded-full px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
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
              Période autorisée : {mission.dateDebutMin.split(' - ')[0]} au {mission.dateDebutMax.split(' - ')[0]}
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
              className={`w-full bg-slate-800 text-white border rounded-full px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
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
            <div className="bg-green-500/10 border border-green-500/30 rounded-full p-4">
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
                    Durée estimée : {Math.round((estimatedDuration || (mission.nbKm / 80) * 60))} minutes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-full p-4">
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
            className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-full font-semibold hover:bg-slate-600 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/25"
          >
            Confirmer la réservation
          </button>
        </div>
      </div>
    </div>
  );
}