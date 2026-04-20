// components/agent-component/reservation-components/ReservationCard.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import ReservationStatBadge from './ReservationStatBadge';
import { Reservation } from '@/app/types/reservation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const getPhotoUrl = (photo?: string | null): string | null => {
  if (!photo) return null;
  if (photo.startsWith('http')) return photo;
  return `${API_URL}${photo}`;
};

interface Props {
  reservation: Reservation;
  onAccept: (id: string) => void;
  onRefuse: (id: string, motifRefus: string) => void;
  onAcceptCancellation: (id: string) => void;
  onRefuseCancellation: (id: string, motifRefus: string) => void;
  isActionLoading?: boolean;
}

export default function ReservationCard({
  reservation,
  onAccept,
  onRefuse,
  onAcceptCancellation,
  onRefuseCancellation,
  isActionLoading,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [showRefuseCancellationModal, setShowRefuseCancellationModal] = useState(false);
  const [motifRefus, setMotifRefus] = useState('');
  const [photoError, setPhotoError] = useState(false);

  const { adherent, mission } = reservation;
  const photoUrl = getPhotoUrl(adherent?.user?.photo);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const handleRefuseSubmit = () => {
    if (!motifRefus.trim()) return;
    onRefuse(reservation.id, motifRefus);
    setShowRefuseModal(false);
    setMotifRefus('');
  };

  const handleRefuseCancellationSubmit = () => {
    if (!motifRefus.trim()) return;
    onRefuseCancellation(reservation.id, motifRefus);
    setShowRefuseCancellationModal(false);
    setMotifRefus('');
  };

  return (
    <>
      <div className={`bg-[#0f0f0f] border rounded-[14px] overflow-hidden transition-colors duration-200 ${
        reservation.statut === 'ANNULATION_DEMANDEE'
          ? 'border-orange-500/40'
          : 'border-[#2a2a2a] hover:border-orange-500/50'
      }`}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-[14px] border-b border-[#1e1e1e]">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {photoUrl && !photoError ? (
              <Image
                src={photoUrl}
                alt={`${adherent?.nom} ${adherent?.prenom}`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
                onError={() => setPhotoError(true)}
              />
            ) : (
              <span className="text-white font-medium text-sm">
                {adherent?.nom?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[#f1f1f1] font-medium text-sm truncate">
              {adherent?.nom} {adherent?.prenom}
            </p>
            <p className="text-[#555] text-[11px] font-mono mt-0.5">
              {reservation.numeroReservation}
            </p>
          </div>

          <ReservationStatBadge statut={reservation.statut} size="sm" />
        </div>

        {/* ── Route ── */}
        <div className="flex items-center gap-2 px-4 py-[10px] bg-[#111] border-b border-[#1e1e1e]">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500 flex-shrink-0" />
          <span className="text-[#e5e5e5] text-[13px] font-medium">
            {mission?.adresseDepart?.villeNom ?? '—'}
          </span>
          <span className="text-orange-500 text-[13px] flex-shrink-0">→</span>
          <span className="w-[7px] h-[7px] rounded-full bg-orange-500 flex-shrink-0" />
          <span className="text-[#e5e5e5] text-[13px] font-medium">
            {mission?.adresseArrivee?.villeNom ?? '—'}
          </span>
        </div>

        {/* ── Meta chips ── */}
        <div className="flex flex-wrap gap-1.5 px-4 py-[10px] border-b border-[#1e1e1e]">
          <span className="inline-flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-[10px] py-[3px] text-[12px] text-[#aaa]">
            📅 {formatDate(reservation.dateDepart)}
          </span>
          <span className="inline-flex items-center gap-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-[10px] py-[3px] text-[12px] text-[#aaa]">
            🕙 {reservation.heureDepart}
          </span>
          <span className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 rounded-full px-[10px] py-[3px] text-[12px] text-orange-500 font-medium">
            {Number(reservation.montantTotal).toFixed(2)} €
          </span>
          {reservation.dureeEstimee && (
            <span className="inline-flex items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-[10px] py-[3px] text-[12px] text-[#aaa]">
              ~{reservation.dureeEstimee} min
            </span>
          )}
        </div>

        {/* ✅ FIX — Bannière ANNULATION_DEMANDEE visible SANS expand */}
        {reservation.statut === 'ANNULATION_DEMANDEE' && (
          <div className="bg-orange-500/10 border-b border-orange-500/20 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-orange-400 text-xs font-medium">Demande d'annulation reçue</p>
                {reservation.motifAnnulation && (
                  <p className="text-orange-400/60 text-[10px] truncate mt-0.5">
                    {reservation.motifAnnulation}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => onAcceptCancellation(reservation.id)}
                disabled={isActionLoading}
                className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[11px] font-medium rounded-lg transition-colors disabled:opacity-40"
              >
                ✓ Valider
              </button>
              <button
                onClick={() => setShowRefuseCancellationModal(true)}
                disabled={isActionLoading}
                className="px-3 py-1.5 bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/30 text-zinc-400 text-[11px] font-medium rounded-lg transition-colors disabled:opacity-40"
              >
                ✕ Rejeter
              </button>
            </div>
          </div>
        )}

        {/* ── EN_ATTENTE — actions rapides visibles SANS expand ── */}
        {reservation.statut === 'EN_ATTENTE' && (
          <div className="px-4 py-3 border-b border-[#1e1e1e] flex gap-2">
            <button
              onClick={() => onAccept(reservation.id)}
              disabled={isActionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/[0.08] hover:bg-green-500/[0.15] border border-green-500/25 text-green-400 text-[12px] font-medium py-2 rounded-[10px] transition-colors disabled:opacity-40"
            >
              ✓ Accepter
            </button>
            <button
              onClick={() => setShowRefuseModal(true)}
              disabled={isActionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/[0.08] hover:bg-red-500/[0.15] border border-red-500/25 text-red-400 text-[12px] font-medium py-2 rounded-[10px] transition-colors disabled:opacity-40"
            >
              ✕ Refuser
            </button>
          </div>
        )}

        {/* ── Expand toggle ── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-[9px] text-[#555] hover:text-orange-500 transition-colors duration-200 text-[12px]"
        >
          <span>{expanded ? 'Masquer les détails' : 'Voir les détails'}</span>
          <span
            className="inline-block transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </button>

        {/* ── Détails expandables ── */}
        {expanded && (
          <div className="border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 pt-3 pb-4 space-y-3">

            {/* Contact */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-[#444] mb-[7px]">
                Contact adhérent
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-[#141414] border border-[#222] rounded-lg p-2.5">
                  <p className="text-[10px] text-[#444] mb-0.5">Email</p>
                  <p className="text-[12px] font-medium text-[#ccc] truncate">
                    {adherent?.user?.email ?? '—'}
                  </p>
                </div>
                <div className="bg-[#141414] border border-[#222] rounded-lg p-2.5">
                  <p className="text-[10px] text-[#444] mb-0.5">Téléphone</p>
                  <p className="text-[12px] font-medium text-[#ccc]">
                    {adherent?.telephone ?? '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Détails trajet */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-[#444] mb-[7px]">
                Détails trajet
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="bg-[#141414] border border-[#222] rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-[#444] mb-0.5">Distance</p>
                  <p className="text-[12px] font-medium text-[#ccc]">
                    {Number(reservation.distanceKm).toFixed(0)} km
                  </p>
                </div>
                <div className="bg-[#141414] border border-[#222] rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-[#444] mb-0.5">Péage</p>
                  <p className="text-[12px] font-medium text-[#ccc]">
                    {Number(reservation.fraisPeage).toFixed(2)} DT
                  </p>
                </div>
                <div className="bg-[#141414] border border-[#222] rounded-lg p-2.5 text-center">
                  <p className="text-[10px] text-[#444] mb-0.5">Arrivée</p>
                  <p className="text-[12px] font-medium text-[#ccc]">
                    {reservation.heureArrivee}
                  </p>
                </div>
              </div>
            </div>

            {/* Motif refus */}
            {reservation.statut === 'REFUSEE' && reservation.motifRefus && (
              <div className="bg-red-500/[0.06] border border-red-500/20 rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-medium text-red-400 mb-1">Motif du refus</p>
                <p className="text-[12px] text-[#888]">{reservation.motifRefus}</p>
              </div>
            )}

            {/* Motif annulation complet dans les détails */}
            {reservation.statut === 'ANNULATION_DEMANDEE' && reservation.motifAnnulation && (
              <div className="bg-orange-500/[0.06] border border-orange-500/20 rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-medium text-orange-400 mb-1">
                  Motif de la demande d'annulation
                </p>
                <p className="text-[12px] text-[#888]">{reservation.motifAnnulation}</p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* ── Modal refus réservation ── */}
      {showRefuseModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-[14px] w-full max-w-[360px] p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[#f1f1f1] font-medium text-[15px]">Motif du refus</h3>
              <button
                onClick={() => setShowRefuseModal(false)}
                className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#777] hover:text-[#ccc] text-[13px] transition-colors"
              >✕</button>
            </div>
            <p className="text-[13px] text-[#777] mb-2.5">
              Précisez la raison du refus pour{' '}
              <span className="text-[#ccc] font-medium">{adherent?.nom} {adherent?.prenom}</span>
            </p>
            <textarea
              value={motifRefus}
              onChange={(e) => setMotifRefus(e.target.value)}
              placeholder="Ex: Véhicule indisponible à cette date..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#2e2e2e] focus:border-orange-500 rounded-lg px-3 py-2.5 text-[13px] text-[#ddd] placeholder:text-[#3a3a3a] outline-none resize-none transition-colors"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setShowRefuseModal(false); setMotifRefus(''); }}
                className="flex-1 py-[9px] rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2e2e2e] text-[13px] text-[#666] hover:text-[#aaa] transition-colors"
              >Annuler</button>
              <button
                onClick={handleRefuseSubmit}
                disabled={!motifRefus.trim() || isActionLoading}
                className="flex-1 py-[9px] rounded-lg bg-red-500/10 hover:bg-red-500/[0.18] border border-red-500/30 text-[13px] font-medium text-red-400 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
              >Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal refus demande d'annulation ── */}
      {showRefuseCancellationModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-[14px] w-full max-w-[360px] p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-[#f1f1f1] font-medium text-[15px]">
                Rejeter la demande d'annulation
              </h3>
              <button
                onClick={() => setShowRefuseCancellationModal(false)}
                className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-[#777] hover:text-[#ccc] text-[13px] transition-colors"
              >✕</button>
            </div>
            <p className="text-[13px] text-[#777] mb-2.5">
              Précisez pourquoi vous rejetez la demande de{' '}
              <span className="text-[#ccc] font-medium">{adherent?.nom} {adherent?.prenom}</span>
            </p>
            <textarea
              value={motifRefus}
              onChange={(e) => setMotifRefus(e.target.value)}
              placeholder="Ex: Délai de rétractation dépassé..."
              rows={3}
              className="w-full bg-[#1a1a1a] border border-[#2e2e2e] focus:border-orange-500 rounded-lg px-3 py-2.5 text-[13px] text-[#ddd] placeholder:text-[#3a3a3a] outline-none resize-none transition-colors"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setShowRefuseCancellationModal(false); setMotifRefus(''); }}
                className="flex-1 py-[9px] rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2e2e2e] text-[13px] text-[#666] hover:text-[#aaa] transition-colors"
              >Annuler</button>
              <button
                onClick={handleRefuseCancellationSubmit}
                disabled={!motifRefus.trim() || isActionLoading}
                className="flex-1 py-[9px] rounded-lg bg-zinc-500/10 hover:bg-zinc-500/[0.18] border border-zinc-500/30 text-[13px] font-medium text-zinc-400 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
              >Rejeter la demande</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}