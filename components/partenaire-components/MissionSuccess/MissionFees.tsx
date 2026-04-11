// components/MissionSuccess/MissionFees.tsx

import React from 'react';
import { Calcul } from '@/app/types/mission';

interface MissionFeesProps {
  calculs?: Calcul;
  kilometrageCost: string;
}

export const MissionFees: React.FC<MissionFeesProps> = ({ calculs, kilometrageCost }) => (
  <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 print:p-2 print:border">
    <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
      <span className="text-base print:text-sm">💰</span> Frais
    </h5>
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between py-1 border-b border-gray-200">
        <span className="text-gray-600 text-xs">Kilométrage</span>
        <span className="font-semibold text-gray-900">{kilometrageCost} €</span>
      </div>
      <div className="flex justify-between py-1 border-b border-gray-200">
        <span className="text-gray-600 text-xs">Péage</span>
        <span className="font-semibold text-gray-900">
          {parseFloat(calculs?.fraisPeage?.toString() || '0').toFixed(2)} €
        </span>
      </div>
      <div className="flex justify-between pt-2 bg-orange-50 -mx-1 px-1 py-1.5 rounded border border-orange-200">
        <span className="font-bold text-gray-900 text-xs">TTC</span>
        <span className="font-bold text-orange-600 text-sm">
          {parseFloat(calculs?.montantTotal?.toString() || '0').toFixed(2)} €
        </span>
      </div>
    </div>
  </div>
);