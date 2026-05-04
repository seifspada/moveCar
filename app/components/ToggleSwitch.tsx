import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  // Rendre les callbacks obligatoires quand les valeurs sont fournies
  nomValue?: string;
  telephoneValue?: string;
  onNomChange?: (value: string) => void;
  onTelephoneChange?: (value: string) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  label, 
  checked, 
  onChange,
  nomValue = '',
  telephoneValue = '',
  onNomChange,
  onTelephoneChange
}) => {
  const handleToggle = () => {
    const newChecked = !checked;
    onChange(newChecked);
    
    // Si on désactive, effacer les champs
    if (!newChecked) {
      if (onNomChange) onNomChange('');
      if (onTelephoneChange) onTelephoneChange('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Toggle principal */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            checked ? 'bg-orange-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              checked ? 'translate-x-6' : ''
            }`}
          />
        </button>
        <span className="text-sm text-gray-700">{label}</span>
      </div>

      {/* Champs conditionnels */}
      {checked && (
        <div className="ml-15 mt-3 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Champ Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom & prénom<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={nomValue}
              onChange={(e) => {
                if (onNomChange) {
                  onNomChange(e.target.value);
                }
              }}
              placeholder="Nom complet"
              required={checked}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-white placeholder-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-orange-50 transition-colors"
            />
          </div>

          {/* Champ Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="tel"
              value={telephoneValue}
              onChange={(e) => {
                if (onTelephoneChange) {
                  onTelephoneChange(e.target.value);
                }
              }}
              placeholder="+33 6 12 34 56 78"
              required={checked}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-white placeholder-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:bg-orange-50 transition-colors"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;