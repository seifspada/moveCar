// types/reservation.types.ts

/**
 * Input pour créer une réservation (envoyé au backend)
 */
export interface CreateReservationInput {
  missionId: string;
  dateDepart: string; // Format: YYYY-MM-DD
  heureDepart: string; // Format: HH:mm
}

/**
 * Réservation retournée par le backend
 */
export interface Reservation {
  id: string;
  numeroReservation: string;
  statut: string;
  dateDepart: string;
  heureDepart: string;
  dateArrivee?: string;
  heureArrivee?: string;
  dureeEstimee?: number;
  montantTotal?: number;
  fraisPeage?: number;
  distanceKm?: number;
  dateCreation: string;
}

/**
 * ✅ AJOUTER : Réponse structurée avec success/message/code
 */
export interface ReservationResponse {
  success: boolean;
  message: string;
  code?: string;
  reservation?: Reservation;
}

/**
 * Enum des statuts de réservation
 */
export enum StatutReservation {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRMEE = 'CONFIRMEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
  REFUSEE = 'REFUSEE', // ✅ Ajouter ce statut
}

/**
 * ✅ AJOUTER : Codes d'erreur possibles
 */
export enum ReservationErrorCode {
  RESERVATION_ALREADY_EXISTS = 'RESERVATION_ALREADY_EXISTS',
  MISSION_NOT_FOUND = 'MISSION_NOT_FOUND',
  MISSION_NOT_AVAILABLE = 'MISSION_NOT_AVAILABLE',
  ADHERENT_NOT_FOUND = 'ADHERENT_NOT_FOUND',
  ADHERENT_NOT_AUTHORIZED = 'ADHERENT_NOT_AUTHORIZED',
  INVALID_DEPARTURE_DATE = 'INVALID_DEPARTURE_DATE',
  GRAPHQL_ERROR = 'GRAPHQL_ERROR',
  NO_RESPONSE = 'NO_RESPONSE',
}

/**
 * Réponse de la query myReservations
 */
export interface MyReservationsResponse {
  myReservations: Reservation[];
}

/**
 * Variables pour la mutation createReservation
 */
export interface CreateReservationVariables {
  input: CreateReservationInput;
}

/**
 * ✅ MODIFIER : Réponse avec ReservationResponse
 */
export interface CreateReservationResponse {
  createReservation: ReservationResponse; // ✅ Changé de Reservation à ReservationResponse
}

/**
 * Variables pour la mutation cancelReservation
 */
export interface CancelReservationVariables {
  id: string;
}

/**
 * Réponse de la mutation cancelReservation
 */
export interface CancelReservationResponse {
  cancelReservation: Reservation;
}
