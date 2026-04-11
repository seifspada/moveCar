'use client';

interface Agence {
  id: number;
  nom: string;
  adresse?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  telephone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
}

interface AgenceCardProps {
  agence: Agence;
  onSelect: (agence: Agence) => void; // ✅ ajouté
}

export default function AgenceCard({ agence, onSelect }: AgenceCardProps) {
  const initials = agence.nom
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const infos = [
    {
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      value: [agence.adresse, agence.ville, agence.codePostal].filter(Boolean).join(', '),
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      value: agence.telephone,
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      value: agence.email,
    },
  ].filter((i) => i.value);

  return (
    <div
      onClick={() => onSelect(agence)} // ✅ clic sur la carte
      className="group relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden
                 cursor-pointer
                 hover:-translate-y-1 hover:border-orange-600/40 hover:shadow-2xl hover:shadow-black/50
                 transition-all duration-300"
    >
      {/* Top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent
                      opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-600/10 border border-orange-600/20
                            flex items-center justify-center shrink-0">
              <span className="text-orange-500 font-bold text-sm tracking-wide">{initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white/90 text-sm leading-tight">{agence.nom}</h3>
              <p className="text-xs text-zinc-600 mt-0.5 font-mono">
                #{agence.id.toString().padStart(4, '0')}
              </p>
            </div>
          </div>

          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
            agence.isActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              agence.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
            }`} />
            {agence.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Infos */}
        {infos.length > 0 ? (
          <div className="space-y-1.5 mb-4">
            {infos.map((info, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-500
                                      px-2.5 py-1.5 rounded-lg bg-zinc-800/60">
                <span className="text-orange-600/70">{info.icon}</span>
                <span className="truncate">{info.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-600 italic mb-4 px-2.5 py-1.5 rounded-lg bg-zinc-800/40">
            Aucune information renseignée
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <span className="text-xs text-zinc-600 font-mono">
            Créée le {new Date(agence.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </span>
          {/* ✅ Indicateur cliquable */}
          <span className="text-xs text-zinc-700 group-hover:text-orange-600/60 transition-colors">
            Voir détails →
          </span>
        </div>
      </div>
    </div>
  );
}
