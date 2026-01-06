"use client";

import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { SearchPosition } from "./SearchPosition";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");
  const [isPositionOpen, setIsPositionOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.toLowerCase());
  };

    const handlePositionSearch = (data: any) => {
    console.log("Recherche position:", data);
    // Logique de filtrage par position
  };

  return (
    <div className="relative mb-4">
      {/* Container pour group-focus-within */}
      <div className="relative group">
        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Rechercher une mission par ville de départ ou d'arrivée..."
          className="w-full pl-14 pr-16 py-4 rounded-full bg-zinc-800 border-2 border-zinc-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-400 transition-all duration-300 hover:border-zinc-600"
        />

        {/* Icône recherche (gauche) avec animation scale */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-6 h-6 text-orange-500 group-focus-within:scale-110 transition-transform duration-200" />
        </div>

        {/* Icône position (droite) cliquable */}
        <button
          onClick={() => setIsPositionOpen(true)}
          aria-label="Géolocalisation"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-zinc-700 transition-colors"
        >
          <MapPin className="w-6 h-6 text-white" />
        </button>
      </div>
       <SearchPosition
              isOpen={isPositionOpen}
              onClose={() => setIsPositionOpen(false)}
              onSearch={handlePositionSearch}
            />
    </div>
  );
}
