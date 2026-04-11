// components/MissionSuccess/MissionStats.tsx

import React from 'react';
import { Calcul } from '@/app/types/mission';

interface MissionStatsProps {
  calculs?: Calcul;
}

export const MissionStats: React.FC<MissionStatsProps> = ({ calculs }) => (
  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
    <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
      <span className="text-base print:text-sm">📊</span> Trajet
    </h5>
    <div className="space-y-2 print:space-y-1.5">
      <div className="flex justify-between items-center pb-1.5 border-b border-orange-200">
        <span className="text-xs text-gray-700">Distance</span>
        <span className="text-base font-bold text-orange-700 print:text-sm">
          {calculs?.distanceKm || '0'} km
        </span>
      </div>
      <div className="flex justify-between items-center pb-1.5 border-b border-orange-200">
        <span className="text-xs text-gray-700">Durée</span>
        <span className="text-base font-bold text-orange-700 print:text-sm">
          {calculs?.detailCalcul?.dureeFormatee || 'N/A'}
        </span>
      </div>
      <div className="flex justify-between items-center pt-1">
        <span className="text-xs text-gray-700 font-bold">Total</span>
        <span className="text-lg font-bold text-orange-600 print:text-base">
          {parseFloat(calculs?.montantTotal?.toString() || '0').toFixed(2)} €
        </span>
      </div>
    </div>
  </div>
);