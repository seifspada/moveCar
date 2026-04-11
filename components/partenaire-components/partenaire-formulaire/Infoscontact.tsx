import { Building2 } from 'lucide-react';

import { PartenaireFormData } from '@/app/hooks/usePartenaireForm';
import FormSection from './Formsection';
import FormInput from './Forminput';

type Props = {
  formData: PartenaireFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

type StringField = { name: keyof Pick<PartenaireFormData, 'nom' | 'entite' | 'telephone' | 'email' | 'confirmEmail'>; label: string; type: string };

const STATUTS = [
  'DIRECTEUR_GENERAL',
  'DIRECTEUR',
  'MANAGER',
  'RESPONSABLE_TRANSPORT',
  'RESPONSABLE_LOGISTIQUE',
  'CHEF_ENTREPRISE',
  'AUTRE',
];

const TEXT_FIELDS: StringField[] = [
  { name: 'nom', label: 'Nom', type: 'text' },
  { name: 'entite', label: 'Entité', type: 'text' },
  { name: 'telephone', label: 'Téléphone', type: 'tel' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'confirmEmail', label: 'Confirmer Email', type: 'email' },
];

export default function InfosContact({ formData, onChange }: Props) {
  return (
    <FormSection
      title="1. Informations de Premier Contact"
      icon={<Building2 className="w-6 h-6" />}
      variant="orange"
    >
      <div className="space-y-4">
        {TEXT_FIELDS.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name]}
            onChange={onChange}
            required
          />
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut dans l'entreprise <span className="text-orange-500">*</span>
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black bg-white"
          >
            <option value="">Sélectionnez votre statut</option>
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FormSection>
  );
}