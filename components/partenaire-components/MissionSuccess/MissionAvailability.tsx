// components/MissionSuccess/MissionAvailability.tsx

import React from 'react';
import { Disponibilite } from '@/app/types/mission';

interface MissionAvailabilityProps {
  disponibilite?: Disponibilite;
}

export const MissionAvailability: React.FC<MissionAvailabilityProps> = ({ disponibilite }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
      <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
        <span className="text-base print:text-sm">📅</span> Disponibilité
      </h5>
      <div className="space-y-2 print:space-y-1.5">
        <div>
          <p className="text-xs text-orange-700 font-semibold uppercase">Départ dès le</p>
          <p className="font-bold text-gray-900 text-xs">
            {formatDate(disponibilite?.dateDebut)}
          </p>
        </div>
        <div>
          <p className="text-xs text-orange-700 font-semibold uppercase">Arrivée avant le</p>
          <p className="font-bold text-gray-900 text-xs">
            {formatDate(disponibilite?.dateFin)}
          </p>
        </div>
      </div>
    </div>
  );
};