'use client';

import { useEffect, useState, useCallback } from 'react';
import { Agence } from '@/app/types/agences';
import {
  fetchAgences as fetchAgencesApi,
  toggleAgence,
  deleteAgence,
  changeAgent,
  resendInvitation,
} from '@/app/utils/agenceApi';

export function useAgences(refreshTrigger: number) {
  const [agences, setAgences]                     = useState<Agence[]>([]);
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState<string | null>(null);
  const [search, setSearch]                       = useState('');
  const [selectedAgence, setSelectedAgence]       = useState<Agence | null>(null);
  const [changeAgentAgence, setChangeAgentAgence] = useState<Agence | null>(null);

  const fetchAgences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgencesApi();
      setAgences(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgences(); }, [refreshTrigger, fetchAgences]);

  // Sync drawer après refresh
  useEffect(() => {
    if (selectedAgence) {
      const updated = agences.find((a) => a.id === selectedAgence.id);
      if (updated) setSelectedAgence(updated);
    }
  }, [agences]);

  const filtered = agences.filter((a) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.nom?.toLowerCase().includes(q)       ||
      a.ville?.toLowerCase().includes(q)     ||
      a.email?.toLowerCase().includes(q)     ||
      a.telephone?.toLowerCase().includes(q) ||
      a.adresse?.toLowerCase().includes(q)
    );
  });

  return {
    agences,
    filtered,
    loading,
    error,
    search,
    setSearch,
    selectedAgence,
    setSelectedAgence,
    changeAgentAgence,
    setChangeAgentAgence,
    fetchAgences,
  };
}
