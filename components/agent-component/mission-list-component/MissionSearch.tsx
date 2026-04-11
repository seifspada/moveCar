'use client';

import { Search, X } from 'lucide-react';

interface MissionSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MissionSearch({ value, onChange }: MissionSearchProps) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                         text-zinc-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une mission..."
        className="w-full pl-9 pr-8 py-2 text-xs rounded-xl
                   bg-zinc-800 border border-zinc-700
                   text-zinc-300 placeholder-zinc-600
                   focus:outline-none focus:border-orange-600/50
                   focus:ring-1 focus:ring-orange-600/20
                   transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}