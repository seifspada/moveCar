// components/MissionSuccess/MissionRoute.tsx

import React from 'react';
import { Adresse } from '@/app/types/mission';

interface MissionRouteProps {
  adresseDepart?: Adresse;
  adresseArrivee?: Adresse;
}

export const MissionRoute: React.FC<MissionRouteProps> = ({ adresseDepart, adresseArrivee }) => (
  <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4 mb-4 print:mb-3 print:p-3 print:border">
    <h4 className="text-base font-bold text-orange-700 mb-3 flex items-center gap-2 print:text-sm print:mb-2">
      <span className="text-lg print:text-base">🚗</span> Itinéraire
    </h4>

    <div className="grid grid-cols-2 gap-4 print:gap-3">
      {/* Départ */}
      <div className="flex gap-3 print:gap-2">
        <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 print:w-8 print:h-8 print:text-base">
          A
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-green-700 uppercase mb-0.5">Départ</p>
          <p className="font-bold text-gray-900 text-base truncate print:text-sm">
            {adresseDepart?.villeNom || 'N/A'}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
            {adresseDepart?.adresseComplete || 'N/A'}
          </p>
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full inline-block mt-1">
            {adresseDepart?.typeLieu || 'N/A'}
          </span>
        </div>
      </div>

      {/* Arrivée */}
      <div className="flex gap-3 print:gap-2">
        <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 print:w-8 print:h-8 print:text-base">
          B
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-red-700 uppercase mb-0.5">Arrivée</p>
          <p className="font-bold text-gray-900 text-base truncate print:text-sm">
            {adresseArrivee?.villeNom || 'N/A'}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
            {adresseArrivee?.adresseComplete || 'N/A'}
          </p>
          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full inline-block mt-1">
            {adresseArrivee?.typeLieu || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  </div>
);
