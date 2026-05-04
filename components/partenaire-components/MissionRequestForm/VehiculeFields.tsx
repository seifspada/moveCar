import { MissionFormData } from '@/app/types/mission';
import React from 'react';

interface VehicleFieldsProps {
  formData: MissionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const VehicleFields: React.FC<VehicleFieldsProps> = ({ formData, onChange }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <select
        name="typeVehicule"
        value={formData.typeVehicule}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">Type de véhicule</option>
        <option value="citadine">Citadine</option>
        <option value="berline">Berline</option>
        <option value="compacte">Compacte</option>
        <option value="cabriolet">Cabriolet</option>
        <option value="monospace">Monospace</option>
        <option value="luxe">Voiture de luxe</option>
        <option value="VU3m3">VU 3m³</option>
        <option value="VU6m3">VU 6m³</option>
        <option value="VU9m3">VU 9m³</option>
        <option value="VU12m3">VU 12m³</option>
        <option value="VU15m3">VU 15m³</option>
        <option value="VU20m3">VU 20m³</option>
        <option value="VU25m3">VU 25m³</option>
        <option value="VU30m3">VU 30m³</option>
      </select>

      <select
        name="typeCarburant"
        value={formData.typeCarburant}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">Type de carburant</option>
        <option value="Essence">Essence</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybride">Hybride</option>
        <option value="Electrique">Électrique</option>
      </select>

      <input
        type="text"
        name="marqueModele"
        value={formData.marqueModele}
        onChange={onChange}
        placeholder="Marque et modèle"
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        name="immatriculation"
        value={formData.immatriculation}
        onChange={onChange}
        placeholder="Immatriculation"
        maxLength={10}
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none uppercase"
      />

      <select
        name="nombrePlaces"
        value={formData.nombrePlaces}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">Nombre de places</option>
        <option value="2">2 places</option>
        <option value="4">4 places</option>
        <option value="5">5 places</option>
        <option value="7">7 places</option>
        <option value="9">9 places</option>
      </select>

      <select
        name="boiteVitesse"
        value={formData.boiteVitesse}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
      >
        <option value="">Boîte de vitesse</option>
        <option value="automatique">Automatique</option>
        <option value="manuelle">Manuelle</option>
      </select>
    </div>
  </>
);