'use client';

import { useState } from 'react';
import { MissionDetails } from '@/app/types/mission';
import { Search, RefreshCw } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import MissionList from '@/components/mission-components/MissionList'; // ✅ Utiliser MissionList
import { GET_MISSIONS_FOR_CARDS_BY_AGENCE } from '@/lib/graphql/queries/mission-card';

interface GetMissionsForCardsByAgenceData {
  getMissionsForCardsByAgence: MissionDetails[];
}

export default function AgenceMissionsPage() {
  const [searchText, setSearchText] = useState('');

  const { data, loading, error, refetch } = useQuery<GetMissionsForCardsByAgenceData>(
    GET_MISSIONS_FOR_CARDS_BY_AGENCE,
    { fetchPolicy: 'cache-and-network' },
  );

  const missions: MissionDetails[] = data?.getMissionsForCardsByAgence ?? [];

  const filtered = searchText.trim()
    ? missions.filter(
        (m) =>
          m.villeDepart?.toLowerCase().includes(searchText.toLowerCase()) ||
          m.villeArrivee?.toLowerCase().includes(searchText.toLowerCase()),
      )
    : missions;



  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 md:px-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Missions de l'agence</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading
              ? 'Chargement...'
              : `${filtered.length} mission${filtered.length > 1 ? 's' : ''}`}
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm w-fit"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* ── Barre de recherche ── */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Filtrer par ville..."
          className="w-full pl-10 pr-10 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        {searchText && (
          <button
            onClick={() => setSearchText('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Erreur ── */}
      {!loading && error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400 font-medium">Erreur lors du chargement</p>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── Empty state (montré seulement si aucun résultat filtré, pas de données du tout) ── */}
      {!loading && !error && missions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Aucune mission</h3>
          <p className="text-gray-500 text-sm max-w-xs">Aucune mission disponible.</p>
        </div>
      )}

      {/* ── Empty state pour recherche sans résultat ── */}
      {!loading && !error && missions.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Aucun résultat</h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Aucune mission trouvée pour "{searchText}"
          </p>
          <button
            onClick={() => setSearchText('')}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm"
          >
            Effacer le filtre
          </button>
        </div>
      )}

      {/* ── MissionList Component ── */}
      {!loading && !error && filtered.length > 0 && (
        <MissionList
  missions={filtered}
  loading={loading}
  mode="agent"
/>
      )}

    </div>
  );
}