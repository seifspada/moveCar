// components/MissionRequestForm/FormHeader.tsx
import React from 'react';

export const FormHeader: React.FC = () => (
  <div className="block lg:hidden border-l-4 border-orange-500 pl-4 mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Demande de Déplacement</h1>
    <p className="text-sm text-gray-600 mt-1">Complétez les informations pour votre demande</p>
  </div>
);
