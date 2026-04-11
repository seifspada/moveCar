import { Loader2 } from 'lucide-react';
import CreneauButton from './Creneaubutton';

type Props = {
  dateRdv: string;
  tousLesCreneaux: string[];
  selectedCreneau: string;
  isCreneauReserved: (c: string) => boolean;
  onSelect: (c: string) => void;
  loading: boolean;
};

export default function Creneaux({
  dateRdv,
  tousLesCreneaux,
  selectedCreneau,
  isCreneauReserved,
  onSelect,
  loading,
}: Props) {
  if (!dateRdv) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-sm text-center">
          Sélectionnez une date pour voir les créneaux disponibles
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  if (tousLesCreneaux.length === 0) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        Aucun créneau disponible pour cette date
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Créneau horaire <span className="text-orange-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {tousLesCreneaux.map((creneau, index) => (
          <CreneauButton
            key={`${creneau}-${index}`}
            creneau={creneau}
            isSelected={selectedCreneau === creneau}
            isReserved={isCreneauReserved(creneau)}
            onClick={() => !isCreneauReserved(creneau) && onSelect(creneau)}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-600">
        Les créneaux barrés sont déjà réservés pour cette date
      </p>
    </div>
  );
}