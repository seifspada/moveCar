//api/partenaire/fiche-partenaire/route.ts

import { CreneauxDisponiblesResponse, DatesIndisponiblesResponse, DemandePartenaireData, DemandePartenaireResponse } from "@/app/type/partenaire";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class PartenaireAPI {
  /**
   * Créer une demande de partenariat
   */
  static async createDemande(data: DemandePartenaireData): Promise<DemandePartenaireResponse> {
    const response = await fetch(`${API_URL}/demandes-partenaire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création de la demande');
    }

    return response.json();
  }

  /**
   * Récupérer les créneaux disponibles pour une date
   */
  static async getCreneauxDisponibles(date: string): Promise<CreneauxDisponiblesResponse> {
    const response = await fetch(
      `${API_URL}/demandes-partenaire/creneaux/disponibles?date=${date}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des créneaux');
    }

    return response.json();
  }

  /**
   * Récupérer les dates indisponibles du mois
   */
  static async getDatesIndisponibles(annee: number, mois: number): Promise<DatesIndisponiblesResponse> {
    const response = await fetch(
      `${API_URL}/demandes-partenaire/dates/indisponibles?annee=${annee}&mois=${mois}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des dates indisponibles');
    }

    return response.json();
  }
}
