
import { PartenaireFormData } from '@/app/hooks/usePartenaireForm';
import FormSection from './Formsection';
import FormInput from './Forminput';

type Props = {
  formData: PartenaireFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

export default function Renseignements({ formData, onChange }: Props) {
  return (
    <FormSection title="2. Renseignements" variant="gray">
      <div className="space-y-4">
        <FormInput
          label="Nombre de déplacements par mois"
          name="nombreDeplacements"
          type="number"
          value={formData.nombreDeplacements}
          onChange={onChange}
          min="0"
        />
        <FormInput
          label="Nombre d'agences"
          name="nombreAgences"
          type="number"
          value={formData.nombreAgences}
          onChange={onChange}
          min="1"
        />
      </div>
    </FormSection>
  );
}