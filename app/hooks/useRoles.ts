'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Role {
  id: number;
  name: string;
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/roles');
      if (!res.ok) throw new Error('Erreur lors du chargement des rôles');
      const data = await res.json();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (name: string): Promise<Role> => {
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Erreur lors de la création du rôle');
    }
    const newRole = await res.json();
    setRoles((prev) => [...prev, newRole]);
    return newRole;
  }, []);

  const deleteRole = useCallback(async (id: number) => {
    const res = await fetch(`/api/roles/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erreur lors de la suppression');
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, error, refetch: fetchRoles, createRole, deleteRole };
}