'use client';

import { useEffect, useState, useCallback } from 'react';
import { Demande } from '@/app/hooks/useDemande';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

function parseDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value;
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function useDemandesAcceptees() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resAdherent, resPartenaireAcceptee, resPartenaireEnCours] = await Promise.all([
        // ✅ Adhérent — inchangé, appel direct BACKEND
        fetch(`${BACKEND}/demandes-adherents?statut=ACCEPTEE`, { headers: authHeaders() }),

        // ✅ Partenaire — via routes Next.js (proxy)
        fetch(`/api/partenaire/demandes-partenaire/statut/ACCEPTEE`, { headers: authHeaders() }),
        fetch(`/api/partenaire/demandes-partenaire/statut/EN_COURS_TRAITEMENT`, { headers: authHeaders() }),
      ]);

      const [dataAdherent, dataPartenaireAcceptee, dataPartenaireEnCours] = await Promise.all([
        resAdherent.json(),
        resPartenaireAcceptee.json(),
        resPartenaireEnCours.json(),
      ]);

      console.log('📦 adherent[0]:', (dataAdherent.demandes ?? dataAdherent)?.[0]);
      console.log('📦 partenaire acceptee[0]:', dataPartenaireAcceptee?.demandes?.[0]);
      console.log('📦 partenaire encours[0]:', dataPartenaireEnCours?.demandes?.[0]);

      // ✅ Adhérent — inchangé
      const adherents: Demande[] = (dataAdherent.demandes ?? dataAdherent ?? []).map((d: any) => ({
        id:         `adherent-${d.id}`,
        realId:     d.id,
        email:      d.email      ?? '',
        message:    `${d.prenom ?? ''} ${d.nom ?? ''}`.trim(),
        type:       'adherent' as const,
        statut:     'ACCEPTEE' as const,
        receivedAt: parseDate(d.createdAt ?? d.created_at ?? d.dateCreation),
      }));

      // ✅ Partenaire accepté
      const partenairesAcceptes: Demande[] = (dataPartenaireAcceptee.demandes ?? []).map((d: any) => ({
        id:         `partenaire-acceptee-${d.id}`,
        realId:     d.id,
        email:      d.email ?? '',
        message:    `${d.nom ?? ''} — ${d.entite ?? ''}`.trim(),
        type:       'partenaire' as const,
        statut:     'ACCEPTEE'   as const,
        receivedAt: parseDate(d.createdAt ?? d.created_at ?? d.dateCreation),
      }));

      // ✅ Partenaire en cours
      const partenairesEnCours: Demande[] = (dataPartenaireEnCours.demandes ?? []).map((d: any) => ({
        id:         `partenaire-encours-${d.id}`,
        realId:     d.id,
        email:      d.email  ?? '',
        message:    `${d.nom ?? ''} — ${d.entite ?? ''}`.trim(),
        type:       'partenaire'          as const,
        statut:     'EN_COURS_TRAITEMENT' as const,
        receivedAt: parseDate(d.createdAt ?? d.created_at ?? d.dateCreation),
      }));

      setDemandes(
        [...adherents, ...partenairesAcceptes, ...partenairesEnCours]
          .sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime()),
      );
    } catch (err: any) {
      setError(err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const stats = {
    total:       demandes.length,
    adherents:   demandes.filter((d) => d.type === 'adherent').length,
    partenaires: demandes.filter((d) => d.type === 'partenaire').length,
    acceptees:   demandes.filter((d) => d.statut === 'ACCEPTEE').length,
    enCours:     demandes.filter((d) => d.statut === 'EN_COURS_TRAITEMENT').length,
  };

  return { demandes, loading, error, stats, refetch: fetchAll };
}