// lib/api/score-ml-api.ts
// Endpoint: GET http://localhost:3000/score-ml/export/mission/{missionId}

const SCORE_ML_URL = process.env.NEXT_PUBLIC_SCORE_ML_URL || 'http://localhost:3000';

export interface ScoreMLExport {
  missionId: string;
  conducteurAge: number;
  conducteurNom: string;
  noteAgentConducteur: number;
  distanceKm: number;
  retardDepart: number;
  retardArrivee: number;
  conditionsMeteo: string;
  joursemaine: number;
  scoreLogistiqueActuel: number;
  labelScorePrediction: string;
}

export class ScoreMLAPI {
  /**
   * Récupère le score logistique ML exporté pour une mission donnée.
   * GET /score-ml/export/mission/{missionId}
   */
  static async getMissionScore(missionId: string): Promise<ScoreMLExport> {
    const response = await fetch(
      `${SCORE_ML_URL}/score-ml/export/mission/${missionId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string })?.message ??
          `Erreur API score-ml (${response.status})`
      );
    }

    return response.json() as Promise<ScoreMLExport>;
  }
}
