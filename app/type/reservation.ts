// types/reservation.ts

/**
 * Statut possible d'une réservation
 */
export enum StatutReservation {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
  TERMINEE = "TERMINEE",
  CLOTUREE = "CLOTUREE",
  ANNULEE = "ANNULEE"
}

/**
 * Type d'incident possible
 */
export enum TypeIncident {
  CREVAISON = "CREVAISON",
  PANNE_MOTEUR = "PANNE_MOTEUR",
  ACCIDENT = "ACCIDENT",
  AUTRE = "AUTRE"
}

/**
 * Coordonnées GPS
 */
export interface CoordonneesGPS {
  latitude: number;
  longitude: number;
}

/**
 * Détails de départ (Annexe 3-1)
 */
export interface DetailDepart {
  missionId: string;
  villeDepart: string;
  heureDepart: string; // Format ISO 8601 ou "HH:mm"
  dateDepartEffective?: string; // Date réelle de départ
  photoVehicule?: string; // URL ou base64
  kmCompteur?: number;
  niveauCarburant?: number; // Pourcentage
  etatVehicule?: string;
  observations?: string;
}

/**
 * Détails d'arrivée (Annexe 3-2)
 */
export interface DetailArrivee {
  missionId: string;
  villeArrivee: string;
  heureArriveePrevue: string;
  heureArriveeEstimee?: string;
  heureArriveeEffective?: string;
  photoVehicule?: string;
  kmCompteur?: number;
  niveauCarburant?: number;
  etatVehicule?: string;
  observations?: string;
}

/**
 * Formulaire d'incident
 */
export interface FormulaireIncident {
  id?: string;
  numeroMission: string;
  villeDepart: string;
  villeArrivee: string;
  heureArriveePrevue: string;
  heureArriveeEstimee?: string;
  
  // Détails de l'incident
  positionIncident: CoordonneesGPS;
  numeroRC: string; // Numéro RC circulation
  typeIncident: TypeIncident[];
  autreIncident?: string; // Si TypeIncident.AUTRE
  
  // Photos et preuves
  photos: string[]; // URLs ou base64
  
  // Métadonnées
  dateIncident: string; // ISO 8601
  heureIncident: string;
  description?: string;
  
  // Statut
  envoye: boolean;
  dateEnvoi?: string;
}

/**
 * Destinataires de l'incident
 */
export interface DestinataireIncident {
  email: string;
  nom: string;
  role: "APPLICATION" | "RESPONSABLE_DEPART" | "RESPONSABLE_ARRIVEE" | "DONNEUR_ORDRE";
}

/**
 * Mission/Réservation principale
 */
export interface Reservation {
  id: string;
  numeroMission: string;
  
  // Informations mission
  villeDepart: string;
  villeArrivee: string;
  dateDepart: string;
  dateDepartPrevue: string;
  dateArriveePrevue: string;
  
  // Statut
  statut: StatutReservation;
  
  // Détails
  detailDepart?: DetailDepart;
  detailArrivee?: DetailArrivee;
  
  // Incidents
  incidents: FormulaireIncident[];
  
  // Véhicule
  typeVehicule: string;
  immatriculation?: string;
  marque?: string;
  modele?: string;
  
  // Convoyeur
  convoyeurId: string;
  convoyeurNom?: string;
  
  // Donneur d'ordre
  donneurOrdreId: string;
  donneurOrdreNom?: string;
  donneurOrdreEmail?: string;
  
  // Montant
  montant?: number;
  
  // Métadonnées
  dateCreation: string;
  dateModification: string;
  notes?: string;
}

/**
 * Filtre pour les réservations
 */
export interface FiltreReservation {
  statut?: StatutReservation[];
  dateDebut?: string;
  dateFin?: string;
  villeDepart?: string;
  villeArrivee?: string;
  convoyeurId?: string;
  avecIncidents?: boolean;
}

/**
 * Réponse API pour la liste des réservations
 */
export interface ReservationsResponse {
  reservationsEnCours: Reservation[];
  missionsClosturees: Reservation[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Données pour l'envoi du formulaire incident
 */
export interface EnvoiIncidentData {
  incident: FormulaireIncident;
  destinataires: DestinataireIncident[];
  copie?: string[]; // Emails en copie
  sujet?: string;
  corpsMessage?: string;
}