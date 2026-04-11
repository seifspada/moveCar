// app/hooks/useDemandeAdherent.ts
import { useEffect, useState, useCallback } from 'react';
import { DemandeAdherent } from '../types/adherent';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
      const res = await fetch(`${BACKEND}/demandes-adherents/${demandeId}`, {
        headers: authHeaders(),
      });

      const raw = await res.text();
      console.log('🔵 backend status:', res.status);
      console.log('🔵 backend response:', raw);

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

  // ✅ CORRIGÉ — body JSON vide envoyé obligatoirement
  const confirmer = useCallback(async () => {
    if (!demandeId) return;

    try {
      setActionLoading('confirmer');
      setActionError(null);

      const res = await fetch(`${BACKEND}/demandes-adherents/${demandeId}/accepter`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({}), // ✅ body vide mais JSON valide
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);

      setDemande((prev) => (prev ? { ...prev, statut: 'ACCEPTEE' } : prev));
      await fetchDemande();
    } catch (err: any) {
      setActionError(err.message ?? 'Erreur lors de la confirmation');
    } finally {
      setActionLoading(null);
    }
  }, [demandeId, fetchDemande]);

  // ✅ CORRIGÉ — accepte un motif optionnel + body JSON envoyé
  const refuser = useCallback(async (motif?: string) => {
    if (!demandeId) return;

    try {
      setActionLoading('refuser');
      setActionError(null);

      const res = await fetch(`${BACKEND}/demandes-adherents/${demandeId}/refuser`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(motif ? { motif } : {}), // ✅ inclut le motif si fourni
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Erreur ${res.status}`);

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