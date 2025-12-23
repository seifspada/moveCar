// app/components/SearchBar.tsx
"use client";

import { useState } from "react";

type Props = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.toLowerCase());
  };

  return (
    <div className="relative mb-8">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Rechercher une mission par ville de départ ou d'arrivée..."
          className="w-full pl-14 pr-4 py-4 rounded-xl bg-zinc-800 border-2 border-zinc-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-400 transition-all duration-300 hover:border-zinc-600"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-6 h-6 text-orange-500 group-focus-within:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}