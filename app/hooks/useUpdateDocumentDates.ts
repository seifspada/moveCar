// app/hooks/useUpdateDocumentDates.ts
import { useState } from 'react';

type UpdateDatesPayload = {
  dateDebutValidite?: string;
  dateFinValidite?: string;
};

type UseUpdateDocumentDatesReturn = {
  updateDates: (
    demandeId: number | string,
    documentId: number,
    payload: UpdateDatesPayload,
  ) => Promise<void>;
  loading: boolean;
  error:   string | null;
  success: boolean;
  reset:   () => void;
};

export function useUpdateDocumentDates(): UseUpdateDocumentDatesReturn {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function reset() {
    setError(null);
    setSuccess(false);
  }

  async function updateDates(
    demandeId: number | string,
    documentId: number,
    payload: UpdateDatesPayload,
  ) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `/api/adherent/demande-adherent/${demandeId}/documents/${documentId}/dates`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Erreur ${res.status}`);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? 'Erreur inconnue');
      throw err; // re-throw pour que l'appelant puisse aussi catcher si besoin
    } finally {
      setLoading(false);
    }
  }

  return { updateDates, loading, error, success, reset };
}