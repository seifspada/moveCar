// components/MissionSuccess/MissionHeader.tsx

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface MissionHeaderProps {
  missionId?: string;
  dateCreation?: string;
}

export const MissionHeader: React.FC<MissionHeaderProps> = ({ missionId, dateCreation }) => {
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
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 print:bg-orange-600 print:p-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 print:text-lg">
            <CheckCircle2 className="w-6 h-6 print:w-5 print:h-5" />
            Mission créée avec succès
          </h2>
          <p className="text-orange-100 text-xs mt-0.5">
            Réf: {missionId?.substring(0, 8).toUpperCase() || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-orange-100">Créée le</p>
          <p className="font-semibold text-sm">{formatDate(dateCreation)}</p>
        </div>
      </div>
    </div>
  );
};