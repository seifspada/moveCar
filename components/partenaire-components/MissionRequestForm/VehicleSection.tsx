import React from 'react';

interface VehicleSectionProps {
  formData: {
    typeVehicule: string;
    typeCarburant: string;
    marqueModele: string;
    immatriculation: string;
    nombrePlaces: string | number;
    boiteVitesse: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors?: Partial<Record<string, string>>;
}

export const VehicleSection: React.FC<VehicleSectionProps> = ({ formData, onChange, errors = {} }) => {

  // Fix immatriculation uppercase réel (pas juste CSS)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'immatriculation') {
      e.target.value = e.target.value.toUpperCase();
    }
    onChange(e);
  };

  const fieldClass = (name: string) =>
    `w-full px-4 py-3 border bg-white text-gray-900 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none ${
      errors[name] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Informations du véhicule
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de véhicule <span className="text-orange-500">*</span>
          </label>
          <select
            name="typeVehicule"
            value={formData.typeVehicule}
            onChange={handleChange}
            className={fieldClass('typeVehicule')}
          >
            <option value="">Sélectionner...</option>
            <option value="CITADINE">Citadine</option>
            <option value="BERLINE">Berline</option>
            <option value="COMPACTE">Compacte</option>
            <option value="CABRIOLET">Cabriolet</option>
            <option value="MONOSPACE">Monospace</option>
            <option value="LUXE">Voiture de luxe</option>
            <option value="VU_3M3">VU 3m³</option>
            <option value="VU_6M3">VU 6m³</option>
            <option value="VU_9M3">VU 9m³</option>
            <option value="VU_12M3">VU 12m³</option>
            <option value="VU_15M3">VU 15m³</option>
            <option value="VU_20M3">VU 20m³</option>
            <option value="VU_25M3">VU 25m³</option>
            <option value="VU_30M3">VU 30m³</option>
          </select>
          {errors.typeVehicule && <p className="mt-1 text-xs text-red-500">{errors.typeVehicule}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de carburant <span className="text-orange-500">*</span>
          </label>
          <select
            name="typeCarburant"
            value={formData.typeCarburant}
            onChange={handleChange}
            className={fieldClass('typeCarburant')}
          >
            <option value="">Sélectionner...</option>
            <option value="ESSENCE">Essence</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRIDE">Hybride</option>
            <option value="ELECTRIQUE">Électrique</option>
          </select>
          {errors.typeCarburant && <p className="mt-1 text-xs text-red-500">{errors.typeCarburant}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque et modèle <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            name="marqueModele"
            value={formData.marqueModele}
            onChange={handleChange}
            placeholder="Ex: Toyota Corolla"
            className={`${fieldClass('marqueModele')} placeholder:text-gray-400`}
          />
          {errors.marqueModele && <p className="mt-1 text-xs text-red-500">{errors.marqueModele}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Immatriculation <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            placeholder="AB-123-CD"
            maxLength={10}
            className={`${fieldClass('immatriculation')} placeholder:text-gray-400 font-mono tracking-widest`}
          />
          {errors.immatriculation && <p className="mt-1 text-xs text-red-500">{errors.immatriculation}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de places <span className="text-orange-500">*</span>
          </label>
          <select
            name="nombrePlaces"
            value={String(formData.nombrePlaces)}
            onChange={handleChange}
            className={fieldClass('nombrePlaces')}
          >
            <option value="">Sélectionner...</option>
            <option value="2">2 places</option>
            <option value="4">4 places</option>
            <option value="5">5 places</option>
            <option value="7">7 places</option>
            <option value="9">9 places</option>
          </select>
          {errors.nombrePlaces && <p className="mt-1 text-xs text-red-500">{errors.nombrePlaces}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Boîte de vitesse <span className="text-orange-500">*</span>
          </label>
          <select
            name="boiteVitesse"
            value={formData.boiteVitesse}
            onChange={handleChange}
            className={fieldClass('boiteVitesse')}
          >
            <option value="">Sélectionner...</option>
            <option value="AUTOMATIQUE">Automatique</option>
            <option value="MANUELLE">Manuelle</option>
          </select>
          {errors.boiteVitesse && <p className="mt-1 text-xs text-red-500">{errors.boiteVitesse}</p>}
        </div>
      </div>
    </>
  );
};