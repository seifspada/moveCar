// app/adherent/mes-reservations/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Reservation, MyReservationsResponse } from '@/app/types/reservation';
import { useQuery } from '@apollo/client/react';
import { GET_MY_RESERVATIONS } from '@/lib/graphql/queries/reservation.queries';
import {
  useCancelReservation,
  useConfirmReservationByAdherent,
  useRequestCancellation,
  useCancelPendingReservation, // ✅
} from '@/app/hooks/useReservations';
import { FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import AdherentReservationCard from '@/components/compte-adherent.ts/reservation-components/AdherentReservationCard';

// ─────────────────────────────────────────────
// FILTRES
// ─────────────────────────────────────────────
const FILTERS = [
  { value: 'ALL',                   label: 'Toutes' },
  { value: 'EN_ATTENTE',            label: 'En attente' },
  { value: 'ACCEPTED_BY_AGENT',     label: 'À confirmer' },
  { value: 'CONFIRMED_BY_ADHERENT', label: 'Confirmées' },
  { value: 'ANNULATION_DEMANDEE',   label: 'Annul. en cours' },
  { value: 'REFUSEE',               label: 'Refusées' },
  { value: 'ANNULEE',               label: 'Annulées' },
  { value: 'TERMINEE',              label: 'Terminées' },
];

// ─────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-zinc-800 rounded-lg" />
            <div className="h-3 w-28 bg-zinc-800/60 rounded-lg" />
          </div>
          <div className="h-5 w-24 bg-zinc-800 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-zinc-800 rounded" />
          <div className="h-3 w-20 bg-zinc-800 rounded" />
        </div>
        <div className="h-3 w-16 bg-zinc-800 rounded" />
        <div className="flex gap-2 pt-1">
          <div className="h-8 flex-1 bg-zinc-800 rounded-xl" />
          <div className="h-8 w-10 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-zinc-600" />
      </div>
      <p className="text-white font-semibold text-base mb-1">Aucune réservation</p>
      <p className="text-zinc-500 text-sm max-w-xs">
        {filter === 'ALL'
          ? "Vous n'avez pas encore effectué de réservation."
          : 'Aucune réservation avec ce statut.'}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────
function StatsBar({ reservations }: { reservations: Reservation[] }) {
  const stats = useMemo(() => ({
    enAttente:         reservations.filter(r => r.statut === 'EN_ATTENTE').length,
    aConfirmer:        reservations.filter(r => r.statut === 'ACCEPTED_BY_AGENT').length,
    confirmees:        reservations.filter(r => r.statut === 'CONFIRMED_BY_ADHERENT').length,
    annulationEnCours: reservations.filter(r => r.statut === 'ANNULATION_DEMANDEE').length,
  }), [reservations]);

  if (Object.values(stats).every(v => v === 0)) return null;

  return (
    <div className="grid grid-cols-4 gap-2 mb-5">
      {[
        { label: 'En attente',   value: stats.enAttente,         color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'À confirmer',  value: stats.aConfirmer,        color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
        { label: 'Confirmées',   value: stats.confirmees,        color: 'text-green-400',  bg: 'bg-green-500/10'  },
        { label: 'Annul. cours', value: stats.annulationEnCours, color: 'text-orange-400', bg: 'bg-orange-500/10' },
      ].map(stat => (
        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────
export default function MesReservationsPage() {
  const [filter, setFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<MyReservationsResponse>(
    GET_MY_RESERVATIONS,
    { fetchPolicy: 'network-only' },
  );

  const [cancelReservation]            = useCancelReservation();
  const [confirmReservationByAdherent] = useConfirmReservationByAdherent();
  const [requestCancellation]          = useRequestCancellation();
  const [cancelPendingReservation]     = useCancelPendingReservation(); // ✅

  const reservations: Reservation[] = useMemo(
    () => data?.myReservations ?? [],
    [data?.myReservations],
  );

  const filteredReservations = useMemo(() => {
    if (filter === 'ALL') return reservations;
    return reservations.filter(r => r.statut === filter);
  }, [reservations, filter]);

  // ─── Helper ──────────────────────────────────
  const withLoading = async (
    id: string,
    fn: () => Promise<void>,
    successMsg: string,
    errorFallback: string,
  ) => {
    setActionLoadingId(id);
    try {
      await fn();
      await refetch();
      toast.success(successMsg);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : errorFallback);
    } finally {
      setActionLoadingId(null);
    }
  };

  // ─── Handlers ────────────────────────────────
  const handleCancel = (id: string, motif?: string) =>
    withLoading(
      id,
      () => cancelReservation({ variables: { id, motifAnnulation: motif } }).then(() => {}),
      'Réservation annulée avec succès',
      "Erreur lors de l'annulation",
    );

  const handleRequestCancellation = (id: string, motif: string) =>
    withLoading(
      id,
      () => requestCancellation({ variables: { id, motifAnnulation: motif } }).then(() => {}),
      "Demande d'annulation envoyée — en attente de validation",
      "Erreur lors de la demande d'annulation",
    );

  const handleConfirm = (id: string) =>
    withLoading(
      id,
      () => confirmReservationByAdherent({ variables: { id } }).then(() => {}),
      'Réservation confirmée ! ✅',
      'Erreur lors de la confirmation',
    );

  // ✅ 1 clic, sans motif, sans modal
  const handleCancelPending = (id: string) =>
    withLoading(
      id,
      () => cancelPendingReservation({ variables: { id } }).then(() => {}),
      'Réservation annulée',
      "Erreur lors de l'annulation",
    );

  const nbAConfirmer = reservations.filter(r => r.statut === 'ACCEPTED_BY_AGENT').length;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white font-bold text-xl">Mes réservations</h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Bannière action requise ── */}
        {nbAConfirmer > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-sm font-bold">{nbAConfirmer}</span>
            </div>
            <div>
              <p className="text-blue-400 font-medium text-sm">
                Réservation{nbAConfirmer > 1 ? 's' : ''} en attente de votre confirmation
              </p>
              <p className="text-blue-400/60 text-xs mt-0.5">
                L&apos;agent a accepté — confirmez pour finaliser
              </p>
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        {!loading && reservations.length > 0 && (
          <StatsBar reservations={reservations} />
        )}

        {/* ── Filtres ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map(f => {
            const count = f.value !== 'ALL'
              ? reservations.filter(r => r.statut === f.value).length
              : reservations.length;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {f.label}
                <span className="ml-1 opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* ── Skeleton ── */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} />)}
          </div>
        )}

        {/* ── Erreur ── */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center">
            <p className="text-red-400 font-medium text-sm mb-2">
              Impossible de charger vos réservations
            </p>
            <button onClick={() => refetch()} className="text-xs text-orange-400 hover:text-orange-300 underline">
              Réessayer
            </button>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && filteredReservations.length === 0 && (
          <EmptyState filter={filter} />
        )}

        {/* ── Liste ── */}
        {!loading && !error && filteredReservations.length > 0 && (
          <div className="space-y-3">
            {filteredReservations.map(reservation => (
              <AdherentReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={handleCancel}
                onRequestCancellation={handleRequestCancellation}
                onConfirm={handleConfirm}
                onCancelPending={handleCancelPending}  // ✅
                isActionLoading={actionLoadingId === reservation.id}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
