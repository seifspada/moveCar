'use client'

import { MapPin, Navigation, X, CheckCircle } from 'lucide-react';

interface ArretMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  villeDepart: string;
  villeArrivee: string;
  tempsEcoule: number;
}

const ArretMissionModal: React.FC<ArretMissionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  villeDepart,
  villeArrivee,
  tempsEcoule
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m.toString().padStart(2, '0')}min`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Arrêter la mission</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 text-sm">
              ⚠️ Attention : Cette action arrêtera définitivement le décompte de la mission.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-slate-500">Départ</p>
                <p className="font-semibold text-slate-900">{villeDepart}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Navigation className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs text-slate-500">Arrivée</p>
                <p className="font-semibold text-slate-900">{villeArrivee}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 mt-4">
              <p className="text-xs text-slate-500">Temps de mission actuel</p>
              <p className="text-lg font-bold text-blue-600">{formatTime(tempsEcoule)}</p>
            </div>
          </div>

          <p className="text-slate-600 mt-4">
            Êtes-vous sûr de vouloir terminer cette mission maintenant ?
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirmer l'arrêt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArretMissionModal;