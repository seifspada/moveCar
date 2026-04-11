'use client';

import {
  X, Building2, User, Phone, MapPin,
  Trash2, RefreshCw, Power, UserCog, Send,
  CheckCircle, AlertCircle, Calendar, Mail,
} from 'lucide-react';
import { useState } from 'react';
import { Agence, Agent } from '@/app/types/agences';
import { useAgenceAgent } from '@/app/hooks/useAgenceAgent';
import { useAgenceActions } from '@/app/hooks/useAgenceActions';

interface AgenceDrawerProps {
  agence: Agence | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onChangeAgent: (agence: Agence) => void;
}

export default function AgenceDrawer({
  agence,
  isOpen,
  onClose,
  onRefresh,
  onChangeAgent,
}: AgenceDrawerProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ✅ Hook agent
  const { agent, setAgent, loadingAgent } = useAgenceAgent(
    agence?.id ?? null,
    isOpen,
  );

  // ✅ Hook actions
  const {
    actionLoading,
    message,
    handleToggle,
    handleDelete,
    handleResendEmail,
  } = useAgenceActions(onRefresh);

  if (!agence) return null;

  const isTokenExpired = (expiresAt?: string | null): boolean => {
    if (!expiresAt) return true;
    return new Date(expiresAt) < new Date();
  };

  const tokenExpired = agent && !agent.isProfileCompleted && isTokenExpired(agent.profileTokenExpiresAt);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1999] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-[2000]
                       bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col
                       transition-transform duration-300 ease-in-out ${
                         isOpen ? 'translate-x-0' : 'translate-x-full'
                       }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/10 border border-orange-600/20
                            flex items-center justify-center">
              <Building2 className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{agence.nom}</h2>
              <p className="text-xs text-zinc-500 font-mono">
                #{agence.id.toString().padStart(4, '0')}
              </p>
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

        {/* Message feedback */}
        {message && (
          <div className={`mx-5 mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {message.type === 'success'
              ? <CheckCircle className="w-4 h-4" />
              : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* ─── Infos agence ─── */}
          <section>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Informations agence
            </p>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Statut</span>
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${
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

              {[
                {
                  icon: <MapPin className="w-3.5 h-3.5" />,
                  value: [agence.adresse, agence.ville, agence.codePostal].filter(Boolean).join(', '),
                },
                { icon: <Phone className="w-3.5 h-3.5" />, value: agence.telephone },
                { icon: <Mail className="w-3.5 h-3.5" />,  value: agence.email },
                {
                  icon: <Calendar className="w-3.5 h-3.5" />,
                  value: `Créée le ${new Date(agence.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}`,
                },
              ]
                .filter((i) => i.value)
                .map((info, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-400">
                    <span className="text-orange-600/60 shrink-0">{info.icon}</span>
                    <span className="truncate">{info.value}</span>
                  </div>
                ))}
            </div>
          </section>

          {/* ─── Profil agent ─── */}
          <section>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Agent lié
            </p>

            {loadingAgent ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-zinc-800 rounded-full w-1/2" />
                    <div className="h-2 bg-zinc-800 rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            ) : agent ? (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                <div className="flex items-center gap-3 mb-3">
                  {agent.photo ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${agent.photo}`}
                      alt="photo"
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700
                                    flex items-center justify-center">
                      <User className="w-4 h-4 text-zinc-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {agent.nom && agent.prenom
                        ? `${agent.prenom} ${agent.nom}`
                        : 'Profil non complété'}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{agent.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                    agent.isProfileCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : tokenExpired
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {agent.isProfileCompleted ? 'Complété' : tokenExpired ? '⚠️ Lien expiré' : 'En attente'}
                  </span>
                </div>
                {agent.telephone && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Phone className="w-3 h-3 text-orange-600/50" />
                    {agent.telephone}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 text-center">
                <User className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-zinc-600">Aucun agent lié</p>
              </div>
            )}
          </section>

          {/* ─── Actions ─── */}
          <section>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
              Actions
            </p>
            <div className="space-y-2">

              {/* Voir profil agent */}
              {agent?.isProfileCompleted && (
                <button
                  onClick={() => window.open(`/partenaire/agents/${agent.id}`, '_blank')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                             bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm
                             hover:border-orange-600/30 hover:bg-orange-600/5 transition-all duration-200"
                >
                  <User className="w-4 h-4 text-orange-500" />
                  Voir le profil de l&apos;agent
                </button>
              )}

              {/* Changer agent */}
              <button
                onClick={() => { onClose(); onChangeAgent(agence); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                           bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm
                           hover:border-orange-600/30 hover:bg-orange-600/5 transition-all duration-200"
              >
                <UserCog className="w-4 h-4 text-orange-500" />
                Changer l&apos;agent
              </button>

              {/* Renvoyer email */}
              {agent && !agent.isProfileCompleted && (
                <button
                  onClick={() => handleResendEmail(agence.id, agent, setAgent)}
                  disabled={actionLoading === 'resend'}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                             bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm
                             hover:border-blue-600/30 hover:bg-blue-600/5
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {actionLoading === 'resend'
                    ? <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                    : <Send className="w-4 h-4 text-blue-400" />}
                  <div className="flex flex-col items-start">
                    <span>Renvoyer l&apos;email de profil</span>
                    <span className="text-xs text-zinc-600">
                      {tokenExpired
                        ? 'Nouveau lien généré automatiquement'
                        : 'Email non reçu ? Renvoyer le lien'}
                    </span>
                  </div>
                </button>
              )}

              {/* Toggle activer/désactiver */}
              <button
                onClick={() => handleToggle(agence.id, agence.isActive)}
                disabled={actionLoading === 'toggle'}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm
                            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  agence.isActive
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-amber-500/30 hover:bg-amber-500/5'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500/30 hover:bg-emerald-500/5'
                }`}
              >
                {actionLoading === 'toggle'
                  ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  : <Power className={`w-4 h-4 ${agence.isActive ? 'text-amber-400' : 'text-emerald-400'}`} />}
                {agence.isActive ? "Désactiver l'agence" : "Activer l'agence"}
              </button>

              {/* Supprimer */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                             bg-zinc-900 border border-zinc-800 text-red-400 text-sm
                             hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer l&apos;agence
                </button>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs text-red-300 mb-3 text-center">
                    ⚠️ Supprimer <strong>{agence.nom}</strong> et son agent définitivement ?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2 rounded-lg text-xs text-zinc-400
                                 border border-zinc-700 hover:bg-zinc-800 transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleDelete(agence.id, onClose)}
                      disabled={actionLoading === 'delete'}
                      className="flex-1 py-2 rounded-lg text-xs text-white
                                 bg-red-600 hover:bg-red-500 disabled:opacity-50
                                 transition-all font-medium"
                    >
                      {actionLoading === 'delete' ? 'Suppression...' : 'Confirmer'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </section>
        </div>
      </div>
    </>
  );
}
