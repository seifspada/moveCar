// app/hooks/useDemandeAdherent.ts
import { useEffect, useState, useCallback } from 'react';
import { DemandeAdherent } from '../types/adherent';

// ✅ Pointe vers la route Next.js, pas directement NestJS
const NEXT_API = '/api/adherent/demande-adherent';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

export function useDemandeAdherent(id: string | string[] | undefined) {
  const demandeId = Array.isArray(id) ? id[0] : id;

  const [demande, setDemande] = useState<DemandeAdherent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<'confirmer' | 'refuser' | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchDemande = useCallback(async () => {
    if (!demandeId) return;

    setLoading(true);
    setError(null);

    try {
      // ✅ Passe par la route Next.js API
      const res = await fetch(`${NEXT_API}/${demandeId}`, {
        headers: authHeaders(),
      });

      const raw = await res.text();
      console.log('🔵 [fetchDemande] status:', res.status);
      console.log('🔵 [fetchDemande] response:', raw);

      if (!res.ok) throw new Error(`Erreur ${res.status}: ${raw}`);

      const data = JSON.parse(raw);
      setDemande(data.demande ?? data);
    } catch (err: any) {
      setError(err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [demandeId]);

  useEffect(() => {
    fetchDemande();
  }, [fetchDemande]);

  const confirmer = useCallback(async () => {
    if (!demandeId) return;

    try {
      setActionLoading('confirmer');
      setActionError(null);

      // ✅ PATCH vers Next.js avec { action: 'confirmer' }
      const res = await fetch(`${NEXT_API}/${demandeId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'confirmer' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || `Erreur ${res.status}`);

      setDemande((prev) => (prev ? { ...prev, statut: 'ACCEPTEE' } : prev));
      await fetchDemande();
    } catch (err: any) {
      setActionError(err.message ?? 'Erreur lors de la confirmation');
    } finally {
      setActionLoading(null);
    }
  }, [demandeId, fetchDemande]);

  const refuser = useCallback(async (motif?: string) => {
    if (!demandeId) return;

    try {
      setActionLoading('refuser');
      setActionError(null);

      // ✅ PATCH vers Next.js avec { action: 'refuser', motif? }
      const res = await fetch(`${NEXT_API}/${demandeId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ action: 'refuser', ...(motif ? { motif } : {}) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || `Erreur ${res.status}`);

      setDemande((prev) => (prev ? { ...prev, statut: 'REFUSEE' } : prev));
      await fetchDemande();
    } catch (err: any) {
      setActionError(err.message ?? 'Erreur lors du refus');
    } finally {
      setActionLoading(null);
    }
  }, [demandeId, fetchDemande]);

  return {
    demande,
    loading,
    error,
    confirmer,
    refuser,
    actionLoading,
    actionError,
    refetch: fetchDemande,
  };
}