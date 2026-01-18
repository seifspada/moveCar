// ==================== TYPES DEMANDE RESERVATION ====================

export type StatutReservation = "en_attente" | "acceptee" | "refusee" | "terminee" | "annulee";

export interface DemandeReservation {
  id: number;
  missionId: number;
  adherentId: number;
  dateDisponibilite: string;        // Format: "YYYY-MM-DD"
  heureDisponibilite: string;       // Format: "HH:MM"
  dateHeureDemande: string;         // Format: "YYYY-MM-DDTHH:MM:SS"
  statut: StatutReservation;
}

// Configuration des couleurs pour les statuts de réservation
export const statutReservationConfig: Record<StatutReservation, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: string;
}> = {
  en_attente: {
    label: "En attente",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: "⏳"
  },
  acceptee: {
    label: "Acceptée",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: "✅"
  },
  refusee: {
    label: "Refusée",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: "❌"
  },
  terminee: {
    label: "Terminée",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: "✔️"
  },
  annulee: {
    label: "Annulée",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    icon: "🚫"
  }
};

// ==================== DONNÉES ====================

export const demandesReservation: DemandeReservation[] = [
  {
    "id": 1,
    "missionId": 1,
    "adherentId": 1,
    "dateDisponibilite": "2026-01-10",
    "heureDisponibilite": "08:00",
    "dateHeureDemande": "2026-01-09T14:30:00",
    "statut": "acceptee",
  },
  {
    "id": 2,
    "missionId": 2,
    "adherentId": 2,
    "dateDisponibilite": "2026-01-18",
    "heureDisponibilite": "09:00",
    "dateHeureDemande": "2026-01-11T10:15:00",
    "statut": "en_attente",
  },
  {
    "id": 3,
    "missionId": 4,
    "adherentId": 1,
    "dateDisponibilite": "2026-01-22",
    "heureDisponibilite": "10:00",
    "dateHeureDemande": "2026-01-11T16:45:00",
    "statut": "en_attente",
  },
  {
    "id": 4,
    "missionId": 3,
    "adherentId": 2,
    "dateDisponibilite": "2025-12-20",
    "heureDisponibilite": "08:00",
    "dateHeureDemande": "2025-12-19T18:20:00",
    "statut": "terminee",
  },
  {
    "id": 5,
    "missionId": 5,
    "adherentId": 1,
    "dateDisponibilite": "2026-01-23",
    "heureDisponibilite": "08:30",
    "dateHeureDemande": "2026-01-10T09:00:00",
    "statut": "annulee",
  }
];

// ==================== FONCTIONS UTILITAIRES ====================

export const reservationHelpers = {
  // Obtenir toutes les réservations d'un adhérent
  getReservationsByAdherent: (adherentId: number): DemandeReservation[] => {
    return demandesReservation.filter(d => d.adherentId === adherentId);
  },

  // Obtenir toutes les réservations pour une mission
  getReservationsByMission: (missionId: number): DemandeReservation[] => {
    return demandesReservation.filter(d => d.missionId === missionId);
  },

  // Filtrer par statut
  filterByStatut: (statut: StatutReservation): DemandeReservation[] => {
    return demandesReservation.filter(d => d.statut === statut);
  },

  // Vérifier si un adhérent a déjà une demande pour une mission
  hasExistingRequest: (adherentId: number, missionId: number): boolean => {
    return demandesReservation.some(
      d => d.adherentId === adherentId && d.missionId === missionId
    );
  },

  // Formater la date et l'heure en français
  formatDateHeure: (date: string, heure: string): string => {
    const d = new Date(date);
    return `${d.toLocaleDateString('fr-FR')} à ${heure}`;
  },

  // Obtenir les réservations récentes (dernières 24h)
  getRecentReservations: (): DemandeReservation[] => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return demandesReservation.filter(d => 
      new Date(d.dateHeureDemande) >= yesterday
    );
  }
};