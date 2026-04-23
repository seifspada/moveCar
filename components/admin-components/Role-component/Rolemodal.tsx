'use client';

import { Role, useRoles } from '@/app/hooks/useRoles';
import { useState, useEffect, useRef } from 'react';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleModal({ isOpen, onClose }: RoleModalProps) {
  const { roles, loading, error, createRole, deleteRole, refetch } = useRoles();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      refetch();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setFormError('Le nom doit contenir au moins 2 caractères');
      return;
    }
    if (trimmed.length > 50) {
      setFormError('Le nom ne peut pas dépasser 50 caractères');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createRole(trimmed);
      setName('');
      setSuccessMsg(`Rôle "${trimmed}" créé avec succès`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (!confirm(`Supprimer le rôle "${role.name}" ?`)) return;
    try {
      await deleteRole(role.id);
    } catch {
      // silently fail
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-white">Gestion des rôles</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Créer et gérer les rôles utilisateurs</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Create form */}
        <div className="px-5 pt-4 pb-3">
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Nouveau rôle</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setFormError(null); }}
              placeholder="Nom du rôle..."
              maxLength={50}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {submitting ? '...' : '+ Ajouter'}
            </button>
          </form>

          {formError && (
            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <span>⚠</span> {formError}
            </p>
          )}
          {successMsg && (
            <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
              <span>✓</span> {successMsg}
            </p>
          )}
        </div>

        {/* Roles list */}
        <div className="px-5 pb-5">
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
            Rôles disponibles
            {!loading && <span className="ml-2 text-zinc-600 normal-case">({roles.length})</span>}
          </p>

          <div className="bg-zinc-800/50 rounded-xl border border-zinc-700/40 overflow-hidden max-h-52 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8 gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-zinc-500">Chargement...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-8 gap-1">
                <span className="text-2xl">⚠️</span>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            ) : roles.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-1">
                <span className="text-2xl">📭</span>
                <p className="text-xs text-zinc-500">Aucun rôle disponible</p>
              </div>
            ) : (
              <ul>
                {roles.map((role, i) => (
                  <li
                    key={role.id}
                    className={`flex items-center justify-between px-3 py-2.5 ${
                      i !== 0 ? 'border-t border-zinc-700/40' : ''
                    } group hover:bg-zinc-700/30 transition-colors`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70 flex-shrink-0" />
                      <span className="text-sm text-zinc-200 capitalize">{role.name}</span>
                      <span className="text-xs text-zinc-600">#{role.id}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(role)}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}