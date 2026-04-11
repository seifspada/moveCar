// components/admin-components/Demande-adherent-details/InfoContactAdherent.tsx
import { Mail, Phone, MapPin, Home } from 'lucide-react';
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

export function InfoContactAdherent({ demande }: { demande: DemandeAdherent }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
        Contact
      </h2>
      <Row icon={Mail}   label="Email"     value={demande.email} />
      <Row icon={Phone}  label="Téléphone" value={demande.telephone} />
      <Row icon={Home}   label="Adresse"   value={demande.adresse} />
      <Row icon={MapPin} label="Ville"     value={demande.ville} />
    </div>
  );
}