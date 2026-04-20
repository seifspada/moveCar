// components/adherent-component/reservation-components/AdherentReservationCard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  MapPin, Clock, Calendar, ChevronDown, ChevronUp,
  CheckCircle, XCircle, AlertCircle, Timer,
} from 'lucide-react';
import { Reservation } from '@/app/types/reservation';
import CancelModal from './CancelModal';
import ReservationStatusBadge from './ReservationStatusBadge';

interface Props {
  reservation: Reservation;
  onCancel: (id: string, motif?: string) => Promise<void>;
  onRequestCancellation: (id: string, motif: string) => Promise<void>;
  onConfirm: (id: string) => Promise<void>;
  onCancelPending: (id: string) => Promise<void>; // ✅ nouveau
  isActionLoading?: boolean;
}

// ─────────────────────────────────────────────
// HOOK — décompte temps réel
// ─────────────────────────────────────────────
function useCountdown(targetDate: Date | null) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const compute = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }
      setTimeLeft({
        total:   diff,
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// ─────────────────────────────────────────────
// SOUS-COMPOSANT — affichage décompte
// ─────────────────────────────────────────────
function CountdownBadge({ targetDate, statut }: { targetDate: Date; statut: string }) {
  const timeLeft = useCountdown(targetDate);

  if (!timeLeft) return null;

  if (timeLeft.total <= 0) {
    return (
      <div className="flex items-center gap-1.5 bg-zinc-800 rounded-xl px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        <span className="text-zinc-500 text-xs">Mission passée</span>
      </div>
    );
  }

  const isUrgent    = timeLeft.total < 1000 * 60 * 60 * 2;
  const isWarning   = timeLeft.total < 1000 * 60 * 60 * 24;
  const isConfirmed = statut === 'CONFIRMED_BY_ADHERENT';

  const colorClasses = isUrgent
    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
    : isWarning
    ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
    : isConfirmed
    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
    : 'bg-zinc-800/80 border border-zinc-700 text-zinc-400';

  const dotColor = isUrgent ? 'bg-red-400' : isWarning ? 'bg-orange-400' : isConfirmed ? 'bg-green-400' : 'bg-zinc-500';
  const pulse    = isUrgent || isWarning;

  const label = timeLeft.days > 0
    ? `${timeLeft.days}j ${String(timeLeft.hours).padStart(2, '0')}h ${String(timeLeft.minutes).padStart(2, '0')}m`
    : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${colorClasses}`}>
      <Timer className="w-3 h-3 flex-shrink-0" />
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor} ${pulse ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-mono font-medium">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function AdherentReservationCard({
  reservation,
  onCancel,
  onRequestCancellation,
  onConfirm,
  onCancelPending,  // ✅
  isActionLoading,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelMode, setCancelMode] = useState<'direct' | 'request'>('direct');

  const r = reservation;

  // ─── Calcul délais ───────────────────────────
  const now = new Date();
  const creationDate = r.dateCreation ? new Date(r.dateCreation) : null;
  const diffDepuisCreationH = creationDate
    ? (now.getTime() - creationDate.getTime()) / (1000 * 60 * 60)
    : 999;
  const isWithin24h = diffDepuisCreationH <= 24;

  const departDate = r.dateDepart
    ? new Date(`${new Date(r.dateDepart).toISOString().split('T')[0]}T${r.heureDepart}:00`)
    : null;

  const diffAvantMissionH = departDate
    ? (departDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    : 999;
  const isTooClose = diffAvantMissionH < 1;

  // ─── Permissions actions ──────────────────────

  // ✅ EN_ATTENTE uniquement — annulation libre sans motif (agent non répondant)
  const canCancelPending = r.statut === 'EN_ATTENTE' && !isTooClose;

  // Annulation directe < 24h — uniquement si ACCEPTED_BY_AGENT
  const canCancelDirect =
    r.statut === 'ACCEPTED_BY_AGENT' &&
    isWithin24h &&
    !isTooClose;

  // Demande d'annulation > 24h
  const canRequestCancellation =
    ['ACCEPTED_BY_AGENT', 'CONFIRMED_BY_ADHERENT'].includes(r.statut) &&
    !isWithin24h &&
    !isTooClose;

  const canConfirm = r.statut === 'ACCEPTED_BY_AGENT';

  const showCountdown =
    ['EN_ATTENTE', 'ACCEPTED_BY_AGENT', 'CONFIRMED_BY_ADHERENT'].includes(r.statut) &&
    departDate !== null;

  const handleCancelClick = () => {
    setCancelMode(isWithin24h ? 'direct' : 'request');
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async (motif?: string) => {
    setCancelModalOpen(false);
    if (cancelMode === 'direct') {
      await onCancel(r.id, motif);
    } else {
      await onRequestCancellation(r.id, motif ?? '');
    }
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  const villeDepart  = r.mission?.adresseDepart?.villeNom  ?? '?';
  const villeArrivee = r.mission?.adresseArrivee?.villeNom ?? '?';

  return (
    <>
      <div className={`bg-zinc-900 border-2 rounded-2xl overflow-hidden transition-all duration-200 ${
        r.statut === 'ACCEPTED_BY_AGENT'
          ? 'border-blue-500/40 shadow-blue-500/10 shadow-lg'
          : r.statut === 'ANNULATION_DEMANDEE'
          ? 'border-orange-500/30'
          : 'border-zinc-800'
      }`}>

        {/* ── Bandes action requise ── */}
        {r.statut === 'ACCEPTED_BY_AGENT' && (
          <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-400 text-xs font-medium">Action requise — confirmez votre réservation</p>
          </div>
        )}
        {r.statut === 'ANNULATION_DEMANDEE' && (
          <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-2 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
            <p className="text-orange-400 text-xs font-medium">Demande d'annulation en attente de validation</p>
          </div>
        )}

        {/* ── Corps principal ── */}
        <div className="p-4">

          {/* Trajet + badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                <span className="text-white text-sm font-semibold truncate">{villeDepart}</span>
                <span className="text-zinc-600 text-xs">→</span>
                <span className="text-white text-sm font-semibold truncate">{villeArrivee}</span>
              </div>
              <p className="text-zinc-500 text-xs font-mono">{r.numeroReservation}</p>
            </div>
            <ReservationStatusBadge statut={r.statut} />
          </div>

          {/* Date + heure */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(r.dateDepart)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{r.heureDepart} → {r.heureArrivee ?? '?'}</span>
            </div>
            {r.dureeEstimee && (
              <span className="text-zinc-600 text-xs">{r.dureeEstimee} min</span>
            )}
          </div>

          {/* Décompte */}
          {showCountdown && departDate && (
            <div className="mb-3">
              <p className="text-zinc-600 text-[10px] mb-1.5 uppercase tracking-wide font-medium">
                Départ dans
              </p>
              <CountdownBadge targetDate={departDate} statut={r.statut} />
            </div>
          )}

          {/* Montant */}
          {r.montantTotal && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-400 font-bold text-sm">
                {Number(r.montantTotal).toFixed(2)} €
              </span>
              {r.fraisPeage && Number(r.fraisPeage) > 0 && (
                <span className="text-zinc-600 text-xs">
                  + {Number(r.fraisPeage).toFixed(2)} € péage
                </span>
              )}
            </div>
          )}

          {/* Motif refus */}
          {r.statut === 'REFUSEE' && r.motifRefus && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-3">
              <p className="text-red-400 text-xs">
                <span className="font-medium">Motif : </span>{r.motifRefus}
              </p>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-2 mt-3">

            {/* ✅ EN_ATTENTE — 1 clic sans motif */}
            {canCancelPending && (
              <button
                onClick={() => onCancelPending(r.id)}
                disabled={isActionLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                {isActionLoading ? 'En cours...' : 'Annuler la demande'}
              </button>
            )}

            {/* ACCEPTED_BY_AGENT — confirmer */}
            {canConfirm && (
              <button
                onClick={() => onConfirm(r.id)}
                disabled={isActionLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 rounded-xl text-white text-xs font-medium transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {isActionLoading ? 'En cours...' : 'Confirmer'}
              </button>
            )}

            {/* ACCEPTED_BY_AGENT — annuler / demander annulation */}
            {(canCancelDirect || canRequestCancellation) && (
              <button
                onClick={handleCancelClick}
                disabled={isActionLoading}
                className={`${canConfirm ? 'px-4' : 'flex-1'} flex items-center justify-center gap-1.5 py-2 border rounded-xl text-xs font-medium transition-colors disabled:opacity-50 ${
                  isWithin24h
                    ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                    : 'border-orange-500/40 text-orange-400 hover:bg-orange-500/10'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                {isWithin24h ? 'Annuler' : 'Demander annulation'}
              </button>
            )}

            {/* Expand */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-2 rounded-xl border border-zinc-700 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Détails expandables */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                {r.dateAcceptationAgent && (
                  <div>
                    <span className="text-zinc-600">Acceptée le</span>
                    <p className="text-zinc-300">{formatDate(r.dateAcceptationAgent)}</p>
                  </div>
                )}
                {r.dateConfirmationAdherent && (
                  <div>
                    <span className="text-zinc-600">Confirmée le</span>
                    <p className="text-zinc-300">{formatDate(r.dateConfirmationAdherent)}</p>
                  </div>
                )}
                {r.dateAnnulation && (
                  <div>
                    <span className="text-zinc-600">Annulée le</span>
                    <p className="text-zinc-300">{formatDate(r.dateAnnulation)}</p>
                  </div>
                )}
                {r.distanceKm && (
                  <div>
                    <span className="text-zinc-600">Distance</span>
                    <p className="text-zinc-300">{Number(r.distanceKm).toFixed(1)} km</p>
                  </div>
                )}
              </div>

              {r.motifAnnulation && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                  <p className="text-orange-400 text-xs">
                    <span className="font-medium">Motif annulation : </span>{r.motifAnnulation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CancelModal
        isOpen={cancelModalOpen}
        mode={cancelMode}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        isLoading={isActionLoading}
      />
    </>
  );
}