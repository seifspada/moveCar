'use client';

import { useState }             from 'react';
import { useDemandesAcceptees } from '@/app/hooks/useDemandesAcceptees';
import { DemandeList }          from '@/components/admin-components/Demande-component/DemandeList';
import { DemandeStats }         from '@/components/admin-components/Demande-component/DemandeStats';
import { CheckCircle, CalendarClock } from 'lucide-react';

type FilterType    = 'all' | 'adherent' | 'partenaire';
type PartenaireTab = 'acceptees' | 'rendez-vous';

export default function DemandesAccepteesPage() {
  const { demandes, loading, error, stats, refetch } = useDemandesAcceptees();

  const [filterType,    setFilterType]    = useState<FilterType>('all');
  const [partenaireTab, setPartenaireTab] = useState<PartenaireTab>('acceptees');

  // ── Listes
  const tousAcceptes              = demandes.filter((d) => d.statut === 'ACCEPTEE');
  const demandesAdherent          = demandes.filter((d) => d.type === 'adherent'   && d.statut === 'ACCEPTEE');
  const demandesPartenaireAccepte = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'ACCEPTEE');
  const demandesPartenaireEnCours = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'EN_COURS_TRAITEMENT');

  // ── Liste affichée selon sélection
  const currentList = (() => {
    if (filterType === 'adherent')   return demandesAdherent;
    if (filterType === 'partenaire') return partenaireTab === 'acceptees'
      ? demandesPartenaireAccepte
      : demandesPartenaireEnCours;
    return tousAcceptes;
  })();

  // ── Tabs principaux
  const typeTabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all',        label: 'Tous',       count: tousAcceptes.length },
    { key: 'adherent',   label: 'Adhérent',   count: demandesAdherent.length },
    { key: 'partenaire', label: 'Partenaire', count: demandesPartenaireAccepte.length + demandesPartenaireEnCours.length },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white">Demandes acceptées</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Adhérents confirmés & rendez-vous partenaires
            </p>
          </div>
          <button
            onClick={refetch}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-1.5 bg-zinc-800 rounded-lg"
          >
            ↺ Actualiser
          </button>
        </div>

        {/* ── Stats ── */}
        {/* ✅ On utilise parStatut pour avoir le bouton RDV confirmé cliquable */}
        <DemandeStats
          total={stats.total}
          adherents={stats.adherents}
          partenaires={stats.partenaires}
          parStatut={{
            enAttente:          0,                  // pas de EN_ATTENTE sur cette page
            enCoursTraitement:  stats.enCours,      // ← RDV confirmés (bouton cliquable)
            acceptees:          stats.acceptees,
            refusees:           0,                  // pas de REFUSEE sur cette page
          }}
        />

        {/* ── Card principale ── */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">

          {/* ── Tabs principaux : Tous / Adhérent / Partenaire ── */}
          <div className="flex border-b border-zinc-800 px-5 pt-4">
            {typeTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setFilterType(tab.key); setPartenaireTab('acceptees'); }}
                className={`pb-3 px-1 mr-6 text-sm font-medium border-b-2 transition-colors ${
                  filterType === tab.key
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  filterType === tab.key
                    ? 'bg-blue-950 text-blue-400'
                    : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* ── Sous-tabs : visible UNIQUEMENT si Partenaire sélectionné ── */}
          {filterType === 'partenaire' && (
            <div className="flex gap-3 px-5 py-3 border-b border-zinc-800 bg-zinc-800/20">
              <button
                onClick={() => setPartenaireTab('acceptees')}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  partenaireTab === 'acceptees'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <CheckCircle size={13} />
                Demandes acceptées
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  partenaireTab === 'acceptees'
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-zinc-700 text-zinc-500'
                }`}>
                  {demandesPartenaireAccepte.length}
                </span>
              </button>

              <button
                onClick={() => setPartenaireTab('rendez-vous')}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  partenaireTab === 'rendez-vous'
                    ? 'bg-blue-950 text-blue-400 border-blue-800'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <CalendarClock size={13} />
                Rendez-vous
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  partenaireTab === 'rendez-vous'
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-zinc-700 text-zinc-500'
                }`}>
                  {demandesPartenaireEnCours.length}
                </span>
              </button>
            </div>
          )}

          {/* ── Contenu ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Chargement...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-2">
              <span className="text-4xl">⚠️</span>
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-xs text-zinc-400 hover:text-white underline"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <DemandeList
              key={`${filterType}-${partenaireTab}`}
              demandes={currentList}
              fixedType={filterType}
            />
          )}

        </div>
      </div>
    </div>
  );
}