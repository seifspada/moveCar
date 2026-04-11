//components/MissionRequestForm/EntitySection.tsx

import React from 'react';

interface EntitySectionProps {
  entite: string;
  adresseEntite: string;
}

export const EntitySection: React.FC<EntitySectionProps> = ({ entite, adresseEntite }) => (
  <div className="grid md:grid-cols-2 gap-4 mb-8">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Entité</label>
      <input
        type="text"
        value={entite}
        readOnly
        className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
      />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
      <input
        type="text"
        value={adresseEntite}
        readOnly
        className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
      />
    </div>
  </div>
);