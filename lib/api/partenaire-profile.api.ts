// lib/api/partenaire-profil.api.ts

export class PartenaireProfilAPI {
  // ✅ Appelle la route Next.js /api/partenaire/inscription-formulaire
  static async createProfilPartenaire(params: {
    profileToken: string;
    codePartenaire: string;
    formData: FormData;
  }) {
    const { profileToken, codePartenaire, formData } = params;

    const response = await fetch(
      `/api/partenaire/inscription-formulaire?profileToken=${encodeURIComponent(
        profileToken,
      )}&code=${encodeURIComponent(codePartenaire)}`,
      {
        method: "POST",
        body: formData,
        // ⚠️ Pas de Content-Type — géré automatiquement avec FormData
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));

      const message = Array.isArray(err?.message)
        ? err.message.join(", ")
        : (err?.message ?? "Erreur lors de la création du profil partenaire");

      throw new Error(message);
    }

    return response.json();
  }
}