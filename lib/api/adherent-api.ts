// app/lib/adherent-api.ts  ← nouveau fichier
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class AdherentAPI {
  static async createDemande(fd: FormData): Promise<any> {
    const res = await fetch(`${API_URL}/demandes-adherents`, {
      method: 'POST',
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? `Erreur API (${res.status})`);
    }

    return res.json();
  }
}