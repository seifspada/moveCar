// app/hooks/useDemandesRefusees.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Demande } from '@/app/hooks/useDemande'; // ✅ type unique partagé

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

// ✅ Parse robuste — jamais d'Invalid Date
function parseDate(value: unknown): Date {
  if (!value) return new Date();
  if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value;
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function useDemandesRefusees() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [resAdherent, resPartenaire] = await Promise.all([
        fetch(`${BACKEND}/demandes-adherents?statut=REFUSEE`, { headers: authHeaders() }),
        fetch(`${BACKEND}/demandes-partenaire/statut/REFUSEE`, { headers: authHeaders() }),
      ]);

      const [dataAdherent, dataPartenaire] = await Promise.all([
        resAdherent.json(),
        resPartenaire.json(),
      ]);

      // 🔍 Debug temporaire
      console.log('📦 adherent refus[0]:', (dataAdherent.demandes ?? dataAdherent)?.[0]);
      console.log('📦 partenaire refus[0]:', dataPartenaire?.demandes?.[0]);

      const adherents: Demande[] = (dataAdherent.demandes ?? dataAdherent ?? []).map((d: any) => ({
        id:         `adherent-refus-${d.id}`,
        realId:     d.id,
        email:      d.email ?? '',
        message:    `${d.prenom ?? ''} ${d.nom ?? ''}`.trim(),
        type:       'adherent' as const,
        statut:     'REFUSEE'  as const,
        receivedAt: parseDate(d.createdAt ?? d.created_at ?? d.dateCreation),
      }));

      const partenaires: Demande[] = (dataPartenaire.demandes ?? []).map((d: any) => ({
        id:         `partenaire-refus-${d.id}`,
        realId:     d.id,
        email:      d.email  ?? '',
        message:    `${d.nom ?? ''} — ${d.entite ?? ''}`.trim(),
        type:       'partenaire' as const,
        statut:     'REFUSEE'    as const,
        receivedAt: parseDate(d.createdAt ?? d.created_at ?? d.dateCreation),
      }));

      setDemandes(
        [...adherents, ...partenaires]
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
  };

  return { demandes, loading, error, stats, refetch: fetchAll };
}