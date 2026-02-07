import CustomSelect from "@/app/components/customSelect";
import ToggleSwitch from "@/app/components/ToggleSwitch";
import { CityAutocomplete } from "../mission-components/CityAutocomplete";

interface AddressSectionProps {
  type: 'depart' | 'arrivee';
  stepNumber: number;
  title: string;
  formData: {
    adresseDepartComplete?: string;
    adresseArriveeComplete?: string;
    typeLieuDepart?: string;
    typeLieuArrivee?: string;
    nomLieuDepart?: string;
    nomLieuArrivee?: string;
    nomContactDepart?: string;
    telephoneContactDepart?: string;
    nomContactArrivee?: string;
    telephoneContactArrivee?: string;
    [key: string]: any;
  };
  onFormDataChange: (updater: (prev: any) => any) => void;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  selectedCity: any;
  onSelectCity: (city: any) => void;
  notify: boolean;
  onNotifyChange: (value: boolean) => void;
  notifyLabel: string;
  // ✅ Ajouter ces props
  nomContact: string;
  telephoneContact: string;
  onNomContactChange: (value: string) => void;
  onTelephoneContactChange: (value: string) => void;
}

export default function AddressSection({
  type,
  stepNumber,
  title,
  formData,
  onFormDataChange,
  inputValue,
  onInputValueChange,
  selectedCity,
  onSelectCity,
  notify,
  onNotifyChange,
  notifyLabel,
  // ✅ Destructurer les nouvelles props
  nomContact,
  telephoneContact,
  onNomContactChange,
  onTelephoneContactChange
}: AddressSectionProps) {
  const borderColor = type === 'depart' ? 'border-orange-200' : 'border-blue-200';
  const bgGradient = type === 'depart' ? 'from-orange-50' : 'from-blue-50';
  const titleColor = type === 'depart' ? 'text-orange-700' : 'text-blue-700';
  const badgeColor = type === 'depart' ? 'bg-orange-500' : 'bg-blue-500';
  const focusRing = type === 'depart' ? 'focus:ring-orange-500' : 'focus:ring-blue-500';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormDataChange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    onFormDataChange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addressKey = type === 'depart' ? 'adresseDepartComplete' : 'adresseArriveeComplete';
  const typeLieuKey = type === 'depart' ? 'typeLieuDepart' : 'typeLieuArrivee';
  const nomLieuKey = type === 'depart' ? 'nomLieuDepart' : 'nomLieuArrivee';

  return (
    <div className={`border-2 ${borderColor} rounded-xl p-6 mb-6 bg-gradient-to-br ${bgGradient} to-white`}>
      <h2 className={`text-xl font-bold ${titleColor} mb-4 flex items-center`}>
        <span className={`w-8 h-8 ${badgeColor} text-white rounded-full flex items-center justify-center text-sm mr-3`}>
          {stepNumber}
        </span>
        {title}
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'depart' ? 'Adresse de départ' : "Adresse d'arrivée"}
              <span className="text-orange-500 text-xs"> *</span>
            </label>
            <input
              type="text"
              value={formData[addressKey] || ''}
              onChange={(e) =>
                onFormDataChange(prev => ({
                  ...prev,
                  [addressKey]: e.target.value
                }))
              }
              placeholder={type === 'depart' ? 'Adresse de départ' : "Adresse d'arrivée"}
              className={`w-full px-4 py-3 border border-gray-300 bg-white rounded-full ${focusRing} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
            />
          </div>

          <div className="w-full">
            <CityAutocomplete
              value={inputValue}
              onValueChange={onInputValueChange}
              selectedCity={selectedCity}
              theme="light"
              onSelectCity={onSelectCity}
              placeholder={type === 'depart' ? 'Ville de départ' : "Ville d'arrivée"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <CustomSelect
  options={[
    { label: "Agence", value: "AGENCE" },
    { label: "Concession", value: "CONCESSION" },
    { label: "Particulier", value: "PARTICULIER" },
    { label: "Parc auto", value: "PARC_AUTO" },
    { label: "Entreprise", value: "ENTREPRISE" },
    { label: "Hôtel", value: "HOTEL" },
    { label: "Domicile", value: "DOMICILE" },
    { label: "Gare", value: "GARE" },
    { label: "Aéroport", value: "AEROPORT" },
    { label: "Autre", value: "AUTRE" }
  ]}
  value={formData[typeLieuKey] || ''}
  onChange={(value) => handleSelectChange(typeLieuKey, String(value))}
  placeholder="Type de lieu"
/>

          <input 
            type="text" 
            name={nomLieuKey}
            value={formData[nomLieuKey] || ''}
            onChange={handleInputChange}
            placeholder={`Nom du lieu (ex: ${type === 'depart' ? 'Agence XYZ' : 'Concession ACME'})`}
            className={`w-full px-4 py-3 border border-gray-300 bg-white rounded-full ${focusRing} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors`}
          />
        </div>

        {/* ✅ Passer les valeurs au ToggleSwitch */}
        <ToggleSwitch 
        label={notifyLabel} 
        checked={notify} 
        onChange={onNotifyChange}
        nomValue={nomContact}
        telephoneValue={telephoneContact}
        onNomChange={onNomContactChange}
        onTelephoneChange={onTelephoneContactChange}
      />
      </div>
    </div>
  );
}
