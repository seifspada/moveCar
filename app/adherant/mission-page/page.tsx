// app/adherant/page.tsx
"use client";

import { missionsData } from "@/app/data/missions";
import { Mission } from "@/app/data/missions"; // ✅ Changez l'import ici
import MissionList from "@/components/mission-components/MissionList";
import ProfileHeader from "@/components/mission-components/ProfileHeader";
import SearchBar from "@/components/mission-components/rechercheBar";
import { SearchFilter } from "@/components/mission-components/SearchFilter";
import { SearchPosition } from "@/components/mission-components/SearchPosition";
import { MapPin, Filter } from "lucide-react";
import { useState, useMemo } from "react";

export default function MissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredMissions = useMemo(() => {
    if (!searchQuery) return missionsData;

    return missionsData.filter(
      (m: Mission) =>
        m.villeDepart.toLowerCase().includes(searchQuery.toLowerCase()) || // ✅ Ajoutez .toLowerCase()
        m.villeArrivee.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handlePositionSearch = (data: any) => {
    console.log("Recherche position:", data);
    // Logique de filtrage par position
  };

  const handleFilterSearch = (data: any) => {
    console.log("Recherche avec filtres:", data);
    // Logique de filtrage avancé
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header en plein largeur - reste en haut */}
      <ProfileHeader />
      
      {/* Contenu principal avec padding adaptatif */}
      <main className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Barre de recherche avec icônes */}
          <div className="flex items-center gap-3">
            {/* Barre de recherche */}
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            
            {/* Icône Position */}
            <button
              onClick={() => setIsPositionOpen(true)}
              className="flex-shrink-0 p-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors -mt-7"
              aria-label="Géolocalisation"
            >
              <MapPin className="w-10 h-10 text-white" />
            </button>

            {/* Icône Filtre */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-shrink-0 p-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors -mt-7"
              aria-label="Filtres"
            >
              <Filter className="w-10 h-10 text-white" />
            </button>
          </div>
          
          <MissionList missions={filteredMissions} />
        </div>
      </main>

      {/* Modales */}
      <SearchPosition
        isOpen={isPositionOpen}
        onClose={() => setIsPositionOpen(false)}
        onSearch={handlePositionSearch}
      />

      <SearchFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSearch={handleFilterSearch}
      />
    </div>
  );
}