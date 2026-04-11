// components/compte-adherent/AccountSettings.tsx
import { Settings, Lock, CreditCard, MapPin, Phone } from 'lucide-react';

interface AccountSettingsProps {
  onPasswordClick: () => void;
  onRibClick: () => void;
  onAdresseClick: () => void;
  onTelephoneClick: () => void;
}

export default function AccountSettings({
  onPasswordClick,
  onRibClick,
  onAdresseClick,
  onTelephoneClick
}: AccountSettingsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
        <Settings className="w-6 h-6 text-orange-600" />
        Paramètres de compte
      </h3>
      
      <div className="space-y-3">
        <button
          onClick={onPasswordClick}
          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
        >
          <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Changer mot de passe
          </span>
        </button>
        
        <button
          onClick={onRibClick}
          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
        >
          <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Modifier RIB
          </span>
        </button>
        
        <button
          onClick={onAdresseClick}
          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
        >
          <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Modifier adresse postale
          </span>
        </button>
        
        <button
          onClick={onTelephoneClick}
          className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
        >
          <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Modifier téléphone
          </span>
        </button>
      </div>
    </div>
  );
}
