'use client';

import { useEffect, useState, useCallback } from 'react';

// ✅ Proxy Next.js — jamais le backend directement depuis le client
const API = '/api/partenaire';

function getToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  };
}

function isValid(id: string | undefined): boolean {
  return !!id && id !== 'undefined' && !isNaN(Number(id));
}

export function useDemandePartenaire(id: string | string[] | undefined) {
  const demandeId = Array.isArray(id) ? id[0] : id;

  const [demande,       setDemande]       = useState<any | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<'confirmer' | 'refuser' | 'reporter' | null>(null);
  const [actionError,   setActionError]   = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchDemande = useCallback(async () => {
    if (!isValid(demandeId)) return;
    setLoading(true);
    setError(null);
    try {
      // ✅ Via proxy Next.js
      const res  = await fetch(`${API}/demandes-partenaire/${demandeId}`, {
        headers: authHeaders(),
      });
      const raw  = await res.text();
      if (!res.ok) throw new Error(`Erreur ${res.status}: ${raw}`);
      const data = JSON.parse(raw);
      setDemande(data.demande ?? data);
    } catch (err: any) {
      setError(err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [demandeId]);

  useEffect(() => { fetchDemande(); }, [fetchDemande]);

  // ── Confirmer RDV ──────────────────────────────────────
  const confirmer = useCallback(async () => {
    if (!isValid(demandeId)) return;
    setActionLoading('confirmer');
    setActionError(null);
    try {
      // ✅ PATCH via proxy avec action
      const res  = await fetch(`${API}/demandes-partenaire/${demandeId}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ action: 'confirmer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || `Erreur ${res.status}`);
      await fetchDemande();
    } catch (err: any) {
      setActionError(err.message ?? 'Erreur lors de la confirmation');
    } finally {
      setActionLoading(null);
    }
  }, [demandeId, fetchDemande]);

  // ── Refuser ────────────────────────────────────────────
  const refuser = useCallback(async (motif?: string) => {
    if (!isValid(demandeId)) return;
    setActionLoading('refuser');
    setActionError(null);
    try {
      // ✅ PATCH via proxy avec action
      const res  = await fetch(`${API}/demandes-partenaire/${demandeId}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ action: 'refuser', ...(motif ? { motif } : {}) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || `Erreur ${res.status}`);
      await fetchDemande();
    } catch (err: any) {
      setActionError(err.message ?? 'Erreur lors du refus');
    } finally {
      setActionLoading(null);
    }
  }, [demandeId, fetchDemande]);

  // ── Reporter ───────────────────────────────────────────
  const reporter = useCallback(async (nouvelleDateRdv: string, nouveauCreneau: string) => {
    if (!isValid(demandeId)) return;
    setActionLoading('reporter');
    setActionError(null);
    try {
      // ✅ PATCH via proxy avec action
      const res  = await fetch(`${API}/demandes-partenaire/${demandeId}`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ action: 'reporter', nouvelleDateRdv, nouveauCreneau }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || `Erreur ${res.status}`);
      await fetchDemande();
    } catch (err: any) {
      setActionError(err.message ?? 'Erreur lors du report');
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
    reporter,
    actionLoading,
    actionError,
    refetch: fetchDemande,
  };
}