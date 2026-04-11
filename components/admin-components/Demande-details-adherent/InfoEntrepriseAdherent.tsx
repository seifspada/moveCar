// components/admin-components/Demande-adherent-details/InfoEntrepriseAdherent.tsx
import { Building2, Hash, Calendar, CreditCard, Car } from 'lucide-react';
import { DemandeAdherent } from '@/app/types/adherent';

function Row({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 p-1.5 bg-orange-50 rounded-lg">
        <Icon className="w-4 h-4 text-orange-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value || '—'}</p>
      </div>
    </div>
  );
}

export function InfoEntrepriseAdherent({ demande }: { demande: DemandeAdherent }) {
  const permis = demande.documents?.find((d) => d.typeDocument === 'PERMIS');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Entreprise & Permis
      </h2>

      <Row icon={Building2} label="Raison sociale"    value={demande.raisonSociale} />
      <Row icon={Hash}      label="N° KBIS"           value={demande.numeroKbis} />
      <Row icon={Calendar}  label="Date de naissance" value={
        new Date(demande.dateNaissance).toLocaleDateString('fr-FR')
      } />

      {permis?.numero && (
        <Row icon={CreditCard} label="N° Permis" value={permis.numero} />
      )}

      {permis?.dateDebutValidite && (
        <Row
          icon={Car}
          label="Permis — début de validité"
          value={new Date(permis.dateDebutValidite).toLocaleDateString('fr-FR')}
        />
      )}
    </div>
  );
}