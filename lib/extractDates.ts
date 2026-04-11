export type ExtractDatesResult = {
  source: string;
  dateDebut: string | null;
  dateFin:   string | null;
  confidence: number;
};

// ✅ kbis supprimé du type
export type TypeDocumentAssurance = 'assuranceRcPro' | 'assuranceRcCirculation';

export async function extractDates(
  file: File,
  typeDocument: TypeDocumentAssurance,
): Promise<ExtractDatesResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('typeDocument', typeDocument);

  const res = await fetch('/api/adherent/extract-date', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? 'Erreur extraction dates');
  }

  return res.json();
}