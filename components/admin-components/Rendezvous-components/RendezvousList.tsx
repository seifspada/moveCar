'use client';

import { useState, useCallback } from 'react';
import { useRendezvous } from "@/app/hooks/useRendezvous";
import { StatutRendezvous } from "@/app/types/rendezvous";
import { RendezvousCard } from "./RendezvousCard";

const STATUTS: { label: string; value: StatutRendezvous | undefined }[] = [
  { label: 'Tous',      value: undefined },
  { label: 'Planifiés', value: 'PLANIFIE' },
  { label: 'Confirmés', value: 'CONFIRME' },
  { label: 'Terminés',  value: 'TERMINE' },
  { label: 'Annulés',   value: 'ANNULE' },
];

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

export function RendezvousList() {
  const { rendezvous, count, isLoading, error, refetch, setStatut } = useRendezvous();
  const [activeStatut, setActiveStatut] = useState<StatutRendezvous | undefined>(undefined);

  const handleStatut = (value: StatutRendezvous | undefined) => {
    setActiveStatut(value);
    setStatut(value);
  };

  // ── Refuser ───────────────────────────────────────────
  const handleRefuse = useCallback(async (id: number, motif?: string) => {
    try {
      const res = await fetch(`/api/partenaire/demandes-partenaire/${id}`, {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ action: 'refuser', ...(motif ? { motif } : {}) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      refetch();
    } catch (err: any) {
      console.error('❌ Erreur refus:', err.message);
    }
  }, [refetch]);

  return (
    <div className="space-y-6">

      {/* ── Filtres ── */}
      <div className="flex gap-2 flex-wrap items-center">
        {STATUTS.map((s) => (
          <button
            key={s.label}
            onClick={() => handleStatut(s.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
              ${activeStatut === s.value
                ? 'bg-blue-500 text-white border-blue-500'
                : 'text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={refetch}
          className="ml-auto text-sm text-gray-500 hover:text-gray-700 underline"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* ── Compteur ── */}
      {!isLoading && (
        <p className="text-sm text-gray-500">
          {count} rendez-vous trouvé{count > 1 ? 's' : ''}
        </p>
      )}

      {/* ── Skeleton ── */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Erreur ── */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
          ❌ {error}
        </div>
      )}

      {/* ── Liste vide ── */}
      {!isLoading && !error && rendezvous.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">Aucun rendez-vous trouvé</p>
        </div>
      )}

      {/* ── Grille ── */}
      {!isLoading && rendezvous.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rendezvous.map((rdv) => (
            <RendezvousCard
              key={rdv.id}
              rdv={rdv}
              onRefuse={handleRefuse}  // ✅ refus géré ici
              onRefetch={refetch}      // ✅ rafraîchit après acceptation via modal
              // ❌ onAccept supprimé — modal gérée dans RendezvousCard
            />
          ))}
        </div>
      )}

    </div>
  );
}