// src/types/partenaire.ts

export type StatutEntreprise = 
  | 'DIRECTEUR_GENERAL'
  | 'DIRECTEUR'
  | 'MANAGER'
  | 'RESPONSABLE_TRANSPORT'
  | 'RESPONSABLE_LOGISTIQUE'
  | 'CHEF_ENTREPRISE'
  | 'AUTRE';

export type TypeRendezvous = 'TELEPHONIQUE' | 'PHYSIQUE';

export interface DemandePartenaireData {
  nom: string;
  entite: string;
  statut: StatutEntreprise;
  telephone: string;
  email: string;
  confirmEmail: string;
  nombreDeplacements?: number;
  nombreAgences?: number;
  typeRdv: TypeRendezvous;
  dateRdv: string; // Format: YYYY-MM-DD
  creneau: string; // Format: HH:MM - HH:MM
}

export interface CreneauxDisponiblesResponse {
  success: boolean;
  date: string;
  disponible: boolean;
  motif?: string;
  creneaux: string[];
  creneauxReserves: string[];
}

export interface DatesIndisponiblesResponse {
  success: boolean;
  annee: number;
  mois: number;
  count: number;
  dates: Array<{
    date: string;
    motif: string;
  }>;
}

export interface DemandePartenaireResponse {
  success: boolean;
  message: string;
  demande: {
    id: number;
    nom: string;
    entite: string;
    email: string;
    statutDemande: string;
    rendezvous: {
      id: number;
      typeRdv: string;
      dateRdv: string;
      creneau: string;
      statut: string;
    };
    createdAt: string;
  };
}
