// components/adherent-component/reservation-components/CancelModal.tsx
'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  mode: 'direct' | 'request'; // direct = dans 24h, request = après 24h
  onClose: () => void;
  onConfirm: (motif?: string) => void;
  isLoading?: boolean;
}

export default function CancelModal({ isOpen, mode, onClose, onConfirm, isLoading }: Props) {
  const [motif, setMotif] = useState('');

  if (!isOpen) return null;

  const isDirect = mode === 'direct';

  const handleConfirm = () => {
    if (!isDirect && !motif.trim()) return;
    onConfirm(motif.trim() || undefined);
    setMotif('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">
                {isDirect ? 'Annuler la réservation' : "Demande d'annulation"}
              </h3>
              <p className="text-zinc-500 text-xs mt-0.5">
                {isDirect
                  ? 'Cette action est irréversible'
                  : "L'agent devra valider votre demande"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info box */}
        <div className={`rounded-xl p-3 mb-4 text-xs ${isDirect ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'}`}>
          {isDirect
            ? "⏱️ Annulation gratuite — vous êtes dans le délai de 24h"
            : "📋 Délai de 24h dépassé — votre demande sera soumise à l'agent pour validation"}
        </div>

        {/* Motif */}
        <div className="mb-5">
          <label className="block text-zinc-400 text-xs font-medium mb-2">
            Motif d'annulation {!isDirect && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder={isDirect ? 'Optionnel...' : 'Expliquez votre demande...'}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Retour
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (!isDirect && !motif.trim())}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {isLoading ? 'En cours...' : isDirect ? 'Confirmer l\'annulation' : 'Envoyer la demande'}
          </button>
        </div>
      </div>
    </div>
  );
}