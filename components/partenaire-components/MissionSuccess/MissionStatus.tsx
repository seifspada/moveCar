// components/MissionSuccess/MissionStatus.tsx

import React from 'react';

interface MissionStatusProps {
  statut?: string;
}

export const MissionStatus: React.FC<MissionStatusProps> = ({ statut }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg mb-4 print:mb-3 print:p-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-yellow-800 uppercase">Statut</p>
        <p className="text-lg font-bold text-yellow-700 print:text-base">
          {statut === 'EN_ATTENTE' ? '⏳ En attente' : statut || 'N/A'}
        </p>
      </div>
    </div>
  </div>
);
