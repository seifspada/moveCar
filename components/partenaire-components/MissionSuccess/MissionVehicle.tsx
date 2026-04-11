// components/MissionSuccess/MissionVehicle.tsx

import React from 'react';
import { Vehicule } from '@/app/types/mission';

interface MissionVehicleProps {
  vehicule?: Vehicule;
}

export const MissionVehicle: React.FC<MissionVehicleProps> = ({ vehicule }) => (
  <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
    <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
      <span className="text-base print:text-sm">🚙</span> Véhicule
    </h5>
    <div className="space-y-2 print:space-y-1.5">
      <div>
        <p className="text-xs text-orange-700 font-semibold uppercase">Modèle</p>
        <p className="font-bold text-gray-900 text-sm">{vehicule?.marqueModele || 'N/A'}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-orange-700">Immat.</p>
          <p className="font-bold text-gray-900 text-xs">{vehicule?.immatriculation || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-orange-700">Type</p>
          <p className="font-bold text-gray-900 text-xs">{vehicule?.typeVehicule || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-orange-700">Carburant</p>
          <p className="font-bold text-gray-900 text-xs">{vehicule?.typeCarburant || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-orange-700">Places</p>
          <p className="font-bold text-gray-900 text-xs">{vehicule?.nombrePlaces || 'N/A'}</p>
        </div>
      </div>
    </div>
  </div>
);
