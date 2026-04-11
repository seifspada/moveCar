'use client';

import { useState, useEffect, useCallback } from 'react';
import { Rendezvous, RendezvousResponse, StatutRendezvous } from '../types/rendezvous';

interface UseRendezvousOptions {
  statut?: StatutRendezvous;
  autoFetch?: boolean;
}

interface UseRendezvousReturn {
  rendezvous: Rendezvous[];
  count: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setStatut: (statut: StatutRendezvous | undefined) => void;
}

export function useRendezvous(options: UseRendezvousOptions = {}): UseRendezvousReturn {
  const { statut: initialStatut, autoFetch = true } = options;

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token')
      ?? localStorage.getItem('access_token')
      ?? localStorage.getItem('authToken')
      ?? null;
  };

  const [rendezvous, setRendezvous] = useState<Rendezvous[]>([]);
  const [count,      setCount]      = useState(0);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [statut,     setStatut]     = useState<StatutRendezvous | undefined>(initialStatut);

  const fetchRendezvous = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();

      // ✅ Chemin corrigé — correspond à ton arborescence
      const url = new URL(
        '/api/partenaire/demandes-partenaire/rendezvous',
        window.location.origin,
      );
      if (statut) url.searchParams.set('statut', statut);

      const res = await fetch(url.toString(), {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Erreur ${res.status}`);
      }

      const data: RendezvousResponse = await res.json();
      setRendezvous(data.rendezvous);
      setCount(data.count);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [statut]);

  useEffect(() => {
    if (autoFetch) fetchRendezvous();
  }, [fetchRendezvous, autoFetch]);

  return { rendezvous, count, isLoading, error, refetch: fetchRendezvous, setStatut };
}