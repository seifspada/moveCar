const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class PartenaireProfilAPI {
  // Créer le profil partenaire à partir du token
  static async createProfilPartenaire(params: {
    profileToken: string;
    codePartenaire: string;
    formData: FormData;
  }) {
    const { profileToken, codePartenaire, formData } = params;

    const response = await fetch(
      `${API_URL}/partenaire/creer-profil/${profileToken}?code=${encodeURIComponent(
        codePartenaire,
      )}`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message ?? "Erreur lors de la création du profil partenaire");
    }

    return response.json();
  }
}
