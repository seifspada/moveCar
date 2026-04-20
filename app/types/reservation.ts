// types/reservation.types.ts

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export enum StatutReservation {
  EN_ATTENTE            = 'EN_ATTENTE',
  ACCEPTED_BY_AGENT     = 'ACCEPTED_BY_AGENT',
  CONFIRMED_BY_ADHERENT = 'CONFIRMED_BY_ADHERENT',
  ANNULATION_DEMANDEE   = 'ANNULATION_DEMANDEE',
  EN_COURS              = 'EN_COURS',
  TERMINEE              = 'TERMINEE',
  ANNULEE               = 'ANNULEE',
  REFUSEE               = 'REFUSEE',
}

export enum ReservationErrorCode {
  RESERVATION_ALREADY_EXISTS = 'RESERVATION_ALREADY_EXISTS',
  MISSION_NOT_FOUND          = 'MISSION_NOT_FOUND',
  MISSION_NOT_AVAILABLE      = 'MISSION_NOT_AVAILABLE',
  ADHERENT_NOT_FOUND         = 'ADHERENT_NOT_FOUND',
  ADHERENT_NOT_AUTHORIZED    = 'ADHERENT_NOT_AUTHORIZED',
  INVALID_DEPARTURE_DATE     = 'INVALID_DEPARTURE_DATE',
  GRAPHQL_ERROR              = 'GRAPHQL_ERROR',
  NO_RESPONSE                = 'NO_RESPONSE',
}

// ─────────────────────────────────────────────
// SOUS-TYPES
// ─────────────────────────────────────────────

export interface UserSimple {
  name: string;
  email: string;
  photo?: string | null;
}

export interface AdherentSimple {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string | null;
  statut: string;
  user?: UserSimple | null;
}

export interface MissionSimple {
  id: string;
  statut: string;
  agentId?: number | null;
  vehicule?: {
    marqueModele: string;
    immatriculation: string;
  } | null;
  adresseDepart?: {
    villeNom: string;
    adresseComplete?: string | null;
  } | null;
  adresseArrivee?: {
    villeNom: string;
    adresseComplete?: string | null;
  } | null;
  calculs?: {
    distanceKm: number;
    montantTotal: number;
    fraisPeage: number;
  } | null;
}

// ─────────────────────────────────────────────
// RESERVATION
// ─────────────────────────────────────────────

export interface Reservation {
  id: string;
  missionId: string;                        // ✅ indispensable pour refetchQueries
  numeroReservation: string;
  statut: string;
  statutPrecedent?: string | null;

  dateDepart: string;
  heureDepart: string;
  dateArrivee?: string | null;
  heureArrivee?: string | null;
  dureeEstimee?: number | null;

  montantTotal?: number | string | null;
  fraisPeage?: number | string | null;
  distanceKm?: number | string | null;

  // Motifs
  motifRefus?: string | null;
  motifAnnulation?: string | null;

  // Annulation
  annulePar?: string | null;               // "ADHERENT" | "AGENT"

  // Dates
  dateCreation?: string | null;
  dateValidation?: string | null;
  dateRefus?: string | null;
  dateAcceptationAgent?: string | null;
  dateConfirmationAdherent?: string | null;
  dateAnnulation?: string | null;

  // Relations
  adherent?: AdherentSimple | null;
  mission?: MissionSimple | null;
}

export type ReservationWithDetails = Reservation & {
  statut: StatutReservation;
  adherent: AdherentSimple;
  mission: MissionSimple;
};

// ─────────────────────────────────────────────
// QUERY RESPONSES
// ─────────────────────────────────────────────

export interface ReservationResponse {
  success: boolean;
  message: string;
  code?: string | null;
  reservation?: Reservation | null;
}

export interface MyReservationsResponse {
  myReservations: Reservation[];
}

export interface ReservationsByMissionResponse {
  reservationsByMission: ReservationWithDetails[];
}

export interface AllReservationsResponse {
  allReservations: ReservationWithDetails[];
}

export interface ReservationByIdResponse {
  reservationById: Reservation;
}

// ─────────────────────────────────────────────
// INPUTS
// ─────────────────────────────────────────────

export interface CreateReservationInput {
  missionId: string;
  dateDepart: string;   // YYYY-MM-DD
  heureDepart: string;  // HH:mm
}

// ─────────────────────────────────────────────
// VARIABLES
// ─────────────────────────────────────────────

export interface CreateReservationVariables {
  input: CreateReservationInput;
}

export interface CancelReservationVariables {
  id: string;
  motifAnnulation?: string;
}

export interface AcceptReservationVariables {
  id: string;
}

export interface ConfirmReservationByAdherentVariables {
  id: string;
}

export interface RefuseReservationVariables {
  id: string;
  motifRefus: string;
}

export interface RequestCancellationVariables {
  id: string;
  motifAnnulation: string;
}

export interface AcceptCancellationRequestVariables {
  id: string;
}

export interface RefuseCancellationRequestVariables {
  id: string;
  motifRefus: string;
}

// ─────────────────────────────────────────────
// MUTATION RESPONSES
// ─────────────────────────────────────────────

export interface CreateReservationResponse {
  createReservation: ReservationResponse;
}

export interface CancelReservationResponse {
  cancelReservation: Reservation;
}

export interface AcceptReservationResponse {
  acceptReservation: Reservation;
}

export interface ConfirmReservationByAdherentResponse {
  confirmReservationByAdherent: Reservation;
}

export interface RefuseReservationResponse {
  refuseReservation: Reservation;
}

export interface RequestCancellationResponse {
  requestCancellation: Reservation;
}

export interface AcceptCancellationRequestResponse {
  acceptCancellationRequest: Reservation;
}

export interface RefuseCancellationRequestResponse {
  refuseCancellationRequest: Reservation;
}

export interface CancelPendingReservationResponse {
  cancelPendingReservation: Reservation;
}