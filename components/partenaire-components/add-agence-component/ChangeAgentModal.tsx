'use client';

import { useEffect, useState } from 'react';
import {
  X, UserCog, Mail, CheckCircle, AlertCircle, RefreshCw,
} from 'lucide-react';

interface ChangeAgentModalProps {
  agenceId: number;
  agenceNom: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangeAgentModal({
  agenceId,
  agenceNom,
  isOpen,
  onClose,
  onSuccess,
}: ChangeAgentModalProps) {
  const [email, setEmail]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getToken = () => localStorage.getItem('token');

  // ✅ Reset à chaque ouverture
  useEffect(() => {
    if (!isOpen) return;
    setEmail('');
    setMessage(null);
  }, [isOpen]);

  // ✅ Fermer avec Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    if (type === 'success') {
      setTimeout(() => { setMessage(null); onClose(); }, 1500);
    } else {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      showMessage('error', 'Veuillez entrer une adresse email valide');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agencies/${agenceId}/change-agent`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      if (res.status === 404) {
        showMessage('error', 'Aucun agent trouvé avec cet email');
        return;
      }
      if (!res.ok) throw new Error();

      showMessage('success', 'Agent changé avec succès');
      onSuccess();
    } catch {
      showMessage('error', "Erreur lors du changement d'agent");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />

      {/* Modal centré */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800
                        rounded-2xl shadow-2xl flex flex-col
                        animate-in fade-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600/10 border border-orange-600/20
                              flex items-center justify-center">
                <UserCog className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Changer l&apos;agent</h2>
                <p className="text-xs text-zinc-500 truncate max-w-[200px]">{agenceNom}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center
                         text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-4">

            {/* Message feedback */}
            {message && (
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {message.type === 'success'
                  ? <CheckCircle className="w-4 h-4 shrink-0" />
                  : <AlertCircle className="w-4 h-4 shrink-0" />}
                {message.text}
              </div>
            )}

            {/* Champ email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Email de l&apos;agent
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="agent@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  autoFocus
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl
                             pl-9 pr-4 py-2.5 text-sm text-zinc-300
                             placeholder:text-zinc-600
                             focus:outline-none focus:border-orange-600/50
                             focus:ring-1 focus:ring-orange-600/20
                             transition-all"
                />
              </div>
              <p className="text-xs text-zinc-600">
                L&apos;agent doit déjà exister dans le système
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm text-zinc-400
                         border border-zinc-700 hover:bg-zinc-800 transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!email.trim() || submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white
                         bg-orange-600 hover:bg-orange-500
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all flex items-center justify-center gap-2"
            >
              {submitting
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Traitement...</>
                : 'Confirmer'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
