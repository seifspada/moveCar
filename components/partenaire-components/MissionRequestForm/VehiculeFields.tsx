import { MissionFormData } from '@/app/types/mission';
import React from 'react';

interface VehicleFieldsProps {
  formData: MissionFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const VehicleFields: React.FC<VehicleFieldsProps> = ({ formData, onChange }) => (
  <>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Informations du véhicule
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de véhicule <span className="text-orange-500">*</span>
        </label>
        <select
          name="typeVehicule"
          value={formData.typeVehicule}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="">Sélectionner...</option>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de carburant <span className="text-orange-500">*</span>
        </label>
        <select
          name="typeCarburant"
          value={formData.typeCarburant}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="">Sélectionner...</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybride">Hybride</option>
          <option value="Electrique">Électrique</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marque et modèle <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          name="marqueModele"
          value={formData.marqueModele}
          onChange={onChange}
          placeholder="Ex: Toyota Corolla"
          className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Immatriculation <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          name="immatriculation"
          value={formData.immatriculation}
          onChange={onChange}
          placeholder="AB-123-CD"
          maxLength={10}
          className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none uppercase"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de places <span className="text-orange-500">*</span>
        </label>
        <select
          name="nombrePlaces"
          value={formData.nombrePlaces}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="">Sélectionner...</option>
          <option value="2">2 places</option>
          <option value="4">4 places</option>
          <option value="5">5 places</option>
          <option value="7">7 places</option>
          <option value="9">9 places</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Boîte de vitesse <span className="text-orange-500">*</span>
        </label>
        <select
          name="boiteVitesse"
          value={formData.boiteVitesse}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
        >
          <option value="">Sélectionner...</option>
          <option value="automatique">Automatique</option>
          <option value="manuelle">Manuelle</option>
        </select>
      </div>
    </div>
  </>
);