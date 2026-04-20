'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Reservation } from '@/app/types/reservation';
import ReservationListHeader from '@/components/agent-component/reservation-components/ReservationListHeader';
import ReservationCard from '@/components/agent-component/reservation-components/ReservationCard';
import {
  useReservationsByMission,
  useAcceptReservation,
  useRefuseReservation,
  useAcceptCancellationRequest,
  useRefuseCancellationRequest,
} from '@/app/hooks/useReservations';

function ReservationSkeleton() {
  return (
    <div className="bg-zinc-900 border-2 border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-stretch h-[110px]">
        <div className="w-16 sm:w-20 bg-orange-500/20 flex-shrink-0" />
        <div className="flex-1 p-4 space-y-3">
          <div className="flex justify-between">
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-zinc-800 rounded-lg" />
              <div className="h-3 w-24 bg-zinc-800/60 rounded-lg" />
            </div>
            <div className="h-5 w-20 bg-zinc-800 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="h-3 w-16 bg-zinc-800 rounded" />
            <div className="h-3 w-4 bg-zinc-800 rounded" />
            <div className="h-3 w-16 bg-zinc-800 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-24 bg-zinc-800 rounded-lg" />
            <div className="h-6 w-16 bg-zinc-800 rounded-lg" />
            <div className="h-6 w-14 bg-zinc-800/80 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p className="text-white font-semibold text-base mb-1">Aucune réservation</p>
      <p className="text-zinc-500 text-sm max-w-xs">
        {filter === 'ALL'
          ? 'Cette mission ne possède pas encore de réservation.'
          : `Aucune réservation avec le statut "${filter}" pour cette mission.`}
      </p>
    </div>
  );
}

function StatsBar({ reservations }: { reservations: Reservation[] }) {
  const counts = useMemo(() => ({
    total:              reservations.length,
    enAttente:          reservations.filter((r) => r.statut === 'EN_ATTENTE').length,
    acceptees:          reservations.filter((r) => r.statut === 'ACCEPTED_BY_AGENT').length,
    confirmeesAdherent: reservations.filter((r) => r.statut === 'CONFIRMED_BY_ADHERENT').length,
    annulationDemandee: reservations.filter((r) => r.statut === 'ANNULATION_DEMANDEE').length,
    refusees:           reservations.filter((r) => r.statut === 'REFUSEE').length,
    annulees:           reservations.filter((r) => r.statut === 'ANNULEE').length,
  }), [reservations]);

  return (
    <div className="grid grid-cols-4 gap-2 mb-5">
      {[
        { label: 'Total',           value: counts.total,              color: 'text-white',      bg: 'bg-zinc-800' },
        { label: 'En attente',      value: counts.enAttente,          color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Acceptées',       value: counts.acceptees,          color: 'text-blue-400',   bg: 'bg-blue-500/10' },
        { label: 'Confirmées',      value: counts.confirmeesAdherent, color: 'text-green-400',  bg: 'bg-green-500/10' },
        { label: 'Annul. demandée', value: counts.annulationDemandee, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { label: 'Refusées',        value: counts.refusees,           color: 'text-red-400',    bg: 'bg-red-500/10' },
        { label: 'Annulées',        value: counts.annulees,           color: 'text-zinc-400',   bg: 'bg-zinc-700/30' },
      ].map((stat) => (
        <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-zinc-500 text-[10px] mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function ReservationsMissionListPage() {
  const params = useParams();
  const missionId = params.id as string;
  const [filter, setFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useReservationsByMission(missionId);

  const [acceptReservation]         = useAcceptReservation();
  const [refuseReservation]         = useRefuseReservation();
  const [acceptCancellationRequest] = useAcceptCancellationRequest();
  const [refuseCancellationRequest] = useRefuseCancellationRequest();

  const reservations: Reservation[] = data?.reservationsByMission ?? [];

  const firstMission = reservations[0]?.mission;
  const villeDepart  = firstMission?.adresseDepart?.villeNom;
  const villeArrivee = firstMission?.adresseArrivee?.villeNom;

  const filteredReservations = useMemo(() => {
    if (filter === 'ALL') return reservations;
    return reservations.filter((r) => r.statut === filter);
  }, [reservations, filter]);

  const handleAccept = async (id: string) => {
    setActionLoadingId(id);
    try {
      await acceptReservation({ variables: { id } });
      await refetch();
    } catch (e) {
      console.error('Erreur acceptation:', e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRefuse = async (id: string, motifRefus: string) => {
    setActionLoadingId(id);
    try {
      await refuseReservation({ variables: { id, motifRefus } });
      await refetch();
    } catch (e) {
      console.error('Erreur refus:', e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAcceptCancellation = async (id: string) => {
    setActionLoadingId(id);
    try {
      await acceptCancellationRequest({ variables: { id } });
      await refetch();
    } catch (e) {
      console.error('Erreur acceptation annulation:', e);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRefuseCancellation = async (id: string, motifRefus: string) => {
    setActionLoadingId(id);
    try {
      await refuseCancellationRequest({ variables: { id, motifRefus } });
      await refetch();
    } catch (e) {
      console.error('Erreur refus annulation:', e);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4 py-6">

        <ReservationListHeader
          missionId={missionId}
          total={filteredReservations.length}
          villeDepart={villeDepart}
          villeArrivee={villeArrivee}
          filter={filter}
          onFilterChange={setFilter}
        />

        {!loading && reservations.length > 0 && (
          <StatsBar reservations={reservations} />
        )}

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <ReservationSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 font-medium text-sm">Impossible de charger les réservations</p>
            <button
              onClick={() => refetch()}
              className="mt-3 text-xs text-orange-400 hover:text-orange-300 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && filteredReservations.length === 0 && (
          <EmptyState filter={filter} />
        )}

        {!loading && !error && filteredReservations.length > 0 && (
          <div className="space-y-3">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onAccept={handleAccept}
                onRefuse={handleRefuse}
                onAcceptCancellation={handleAcceptCancellation}
                onRefuseCancellation={handleRefuseCancellation}
                isActionLoading={actionLoadingId === reservation.id}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}