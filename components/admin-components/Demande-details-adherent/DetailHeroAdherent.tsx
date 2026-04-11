// components/admin-components/Demande-details-adherent/DetailHeroAdherent.tsx
import { User } from 'lucide-react';
import { DemandeAdherent } from '@/app/types/adherent';

type Props = {
  demande: DemandeAdherent;
  statut: { label: string; color: string; bg: string };
};

export function DetailHeroAdherent({ demande, statut }: Props) {
  const initials = `${demande.prenom?.[0] ?? ''}${demande.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row sm:items-center gap-5 shadow-lg">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-orange-500/10 border-2 border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-xl shrink-0">
        {initials || <User className="w-7 h-7" />}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-white truncate">
          {demande.prenom} {demande.nom}
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">{demande.raisonSociale}</p>
        <p className="text-xs text-slate-600 mt-1">
          Soumis le{' '}
          {new Date(demande.dateCreation).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* Badge statut */}
      <span className={`text-xs font-semibold px-4 py-1.5 rounded-full border self-start sm:self-center ${statut.bg} ${statut.color}`}>
        {statut.label}
      </span>
    </div>
  );
}