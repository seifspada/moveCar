'use client';

interface Props {
  total: number;
  admins: number;
  adherents: number;
  partenaires: number;
  agents: number;
}

export function UserStats({ total, admins, adherents, partenaires, agents }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <div className="bg-zinc-900 rounded-xl px-5 py-3 flex items-center gap-3 border border-zinc-700">
        <p className="text-2xl font-bold text-white">{total}</p>
        <p className="text-xs text-zinc-500 leading-tight">Total<br />utilisateurs</p>
      </div>

      <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-purple-500/20">
        <span className="w-2 h-2 rounded-full bg-purple-400" />
        <p className="text-sm font-semibold text-purple-400">{admins}</p>
        <p className="text-xs text-zinc-500">Admin</p>
      </div>

      <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-emerald-500/20">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <p className="text-sm font-semibold text-emerald-400">{adherents}</p>
        <p className="text-xs text-zinc-500">Adhérent</p>
      </div>

      <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-blue-500/20">
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <p className="text-sm font-semibold text-blue-400">{partenaires}</p>
        <p className="text-xs text-zinc-500">Partenaire</p>
      </div>

      <div className="bg-zinc-900 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-orange-500/20">
        <span className="w-2 h-2 rounded-full bg-orange-400" />
        <p className="text-sm font-semibold text-orange-400">{agents}</p>
        <p className="text-xs text-zinc-500">Agent</p>
      </div>
    </div>
  );
}