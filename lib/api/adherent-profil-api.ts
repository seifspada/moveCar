const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class AdherentProfilAPI {
  // Vérifier le token
  static async verifyToken(token: string) {
    const res = await fetch(`${API_URL}/demandes-adherents/verify-token/${token}`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? "Token invalide");
    }

    return res.json();
  }

  // Créer le compte à partir du token
  static async createWithToken(token: string, formData: FormData) {
    const res = await fetch(`${API_URL}/adherent/creer-profil/${token}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? "Erreur lors de la création du compte");
    }

    return res.json();
  }
}
