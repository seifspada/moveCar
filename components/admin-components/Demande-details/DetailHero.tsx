'use client';

import { DemandePartenaire, formatDateTime, STATUT_CONFIG } from "@/app/types/partenaire";

interface Props {
  demande: DemandePartenaire;
}

export function DetailHero({ demande }: Props) {
  const statut = STATUT_CONFIG[demande.statutDemande] ?? {
    label: demande.statutDemande,
    color: 'text-slate-600',
    bg: 'bg-slate-50 border-slate-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-2xl font-bold text-white">
          {(demande.nom ?? '?').charAt(0).toUpperCase()} {/* ✅ guard si nom undefined */}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-slate-900 truncate">{demande.nom ?? '—'}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{demande.entite ?? '—'}</p>
        <p className="text-xs text-slate-400 mt-1">
          {demande.createdAt ? `Reçue le ${formatDateTime(demande.createdAt)}` : '—'}
        </p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-2">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statut.bg} ${statut.color}`}>
          {statut.label}
        </span>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
          {demande.statut ?? '—'}
        </span>
      </div>
    </div>
  );
}