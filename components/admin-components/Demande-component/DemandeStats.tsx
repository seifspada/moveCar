'use client';

import { useState } from 'react';
import { RendezvousList } from '../Rendezvous-components/RendezvousList';

interface StatutCount {
  enAttente: number;
  enCoursTraitement: number;
  acceptees: number;
  refusees: number;
}

interface Props {
  total: number;
  adherents: number;
  partenaires: number;
  parStatut?: StatutCount;
  customStats?: { label: string; value: number; color: string; border: string }[];
}

export function DemandeStats({ total, adherents, partenaires, parStatut, customStats }: Props) {
  const [showRendezvous, setShowRendezvous] = useState(false);

  return (
    <div className="space-y-3 mb-5">

      {/* ── Ligne 1 : par type ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-zinc-700">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-zinc-500 leading-tight">Total<br />demandes</p>
        </div>
        <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-emerald-500/30">
          <p className="text-2xl font-bold text-emerald-400">{adherents}</p>
          <p className="text-xs text-zinc-500 leading-tight">Adhérent</p>
        </div>
        <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-blue-500/30">
          <p className="text-2xl font-bold text-blue-400">{partenaires}</p>
          <p className="text-xs text-zinc-500 leading-tight">Partenaire</p>
        </div>
      </div>

      {/* ── Ligne 2 : par statut ── */}
      {parStatut && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-orange-500/20">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <p className="text-sm font-semibold text-orange-400">{parStatut.enAttente}</p>
            <p className="text-xs text-zinc-500">En attente</p>
          </div>

          {/* ── Bouton RDV confirmé ── */}
          <button
            onClick={() => setShowRendezvous((prev) => !prev)}
            className={`bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border transition-all duration-200 cursor-pointer
              ${showRendezvous
                ? 'border-blue-500/60 ring-1 ring-blue-500/30'
                : 'border-blue-500/20 hover:border-blue-500/50'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <p className="text-sm font-semibold text-blue-400">{parStatut.enCoursTraitement}</p>
            <p className="text-xs text-zinc-500">RDV confirmé</p>
            <span className="text-zinc-600 text-xs ml-1">
              {showRendezvous ? '▲' : '▼'}
            </span>
          </button>

          <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="text-sm font-semibold text-emerald-400">{parStatut.acceptees}</p>
            <p className="text-xs text-zinc-500">Acceptées</p>
          </div>
          <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <p className="text-sm font-semibold text-red-400">{parStatut.refusees}</p>
            <p className="text-xs text-zinc-500">Refusées</p>
          </div>
        </div>
      )}

      {/* ── Ligne 3 : stats custom ── */}
      {customStats && customStats.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {customStats.map((s) => (
            <div key={s.label} className={`bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border ${s.border}`}>
              <p className={`text-sm font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Panel RDV (toggle) ── */}
      {showRendezvous && (
        <div className="mt-2 rounded-2xl border border-blue-500/20 bg-zinc-900 overflow-hidden
          animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Header du panel */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <p className="text-sm font-semibold text-blue-400">
                Rendez-vous confirmés
              </p>
            </div>
            <button
              onClick={() => setShowRendezvous(false)}
              className="text-zinc-600 hover:text-zinc-300 text-xs transition-colors"
            >
              ✕ Fermer
            </button>
          </div>

          {/* Contenu */}
          <div className="p-5">
            <RendezvousList />
          </div>
        </div>
      )}

    </div>
  );
}