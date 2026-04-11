// hooks/useExtractDates.ts
'use client';

import { useState, useCallback } from 'react';

export type TypeDocumentAssurance = 'assuranceRcPro' | 'assuranceRcCirculation';

export interface ExtractDatesResult {
  source: string;
  dateDebut: string | null;
  dateFin: string | null;
  confidence: number;
}

interface ExtractDatesState {
  data: ExtractDatesResult | null;
  loading: boolean;
  error: string | null;
}

export function useExtractDates() {
  const [rcPro, setRcPro] = useState<ExtractDatesState>({
    data: null, loading: false, error: null,
  });

  const [rcCirculation, setRcCirculation] = useState<ExtractDatesState>({
    data: null, loading: false, error: null,
  });

  const extract = useCallback(async (
    file: File,
    typeDocument: TypeDocumentAssurance,
  ): Promise<ExtractDatesResult | null> => {
    const setState =
      typeDocument === 'assuranceRcPro' ? setRcPro : setRcCirculation;

    setState({ data: null, loading: true, error: null });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('typeDocument', typeDocument);

      // ✅ Chemin vérifié — correspond à :
      // app/api/adherent/extract-date/route.ts
      const res = await fetch('/api/adherent/extract-date', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setState({ data: null, loading: false, error: json.message ?? 'Erreur extraction' });
        return null;
      }

      setState({ data: json, loading: false, error: null });
      return json;
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error: err.message ?? 'Erreur réseau',
      });
      return null;
    }
  }, []);

  const extractBoth = useCallback(async (
    fileRcPro: File,
    fileRcCirculation: File,
  ): Promise<{
    rcPro: ExtractDatesResult | null;
    rcCirculation: ExtractDatesResult | null;
  }> => {
    const [resRcPro, resRcCirc] = await Promise.allSettled([
      extract(fileRcPro,         'assuranceRcPro'),
      extract(fileRcCirculation, 'assuranceRcCirculation'),
    ]);

    return {
      rcPro:
        resRcPro.status === 'fulfilled' ? resRcPro.value : null,
      rcCirculation:
        resRcCirc.status === 'fulfilled' ? resRcCirc.value : null,
    };
  }, [extract]);

  const reset = useCallback((type?: TypeDocumentAssurance) => {
    const empty = { data: null, loading: false, error: null };
    if (!type || type === 'assuranceRcPro')         setRcPro(empty);
    if (!type || type === 'assuranceRcCirculation') setRcCirculation(empty);
  }, []);

  return {
    rcPro,
    rcCirculation,
    loading: rcPro.loading || rcCirculation.loading,
    extract,
    extractBoth,
    reset,
  };
}