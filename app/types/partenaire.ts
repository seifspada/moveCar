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


// --- partenaire navbar ---

// types/partenaire.ts
export interface PartenaireNavbar {
  entite: string;
  email: string;
  photo: string | null;
}

export interface PartenaireNavbarData {
  partenaireNavbar: PartenaireNavbar;
}

export interface PartenaireMissionHeader {
  entite: string;
  adresse: string | null;
  ville: string | null;
}

export interface PartenaireMissionHeaderData {
  partenaireMissionHeader: PartenaireMissionHeader;
}
export interface CreneauReserve {
  id: number;
  date: string;
  creneau: string;
  type: string;
  motif: string;
  estActif: boolean;
}
export interface Rendezvous {
  id: number;
  typeRdv: 'TELEPHONIQUE' | 'PHYSIQUE' | 'VISIO';
  dateRdv: string;
  creneau: string;
  statut: string;
  lienVisio: string | null;
  adresse: string | null;
  creneauReserve: CreneauReserve;
}
export interface DemandePartenaire {
  id: number;
  createdAt: string;
  updatedAt: string;
  nom: string;
  entite: string;
  statut: string;
  telephone: string;
  email: string;
  nombreDeplacements: number | null;
  nombreAgences: number | null;
  statutDemande: string;
  codePartenaire: string | null;
  notesInternes: string | null;
  rendezvous: Rendezvous | null;
  partenaire: null;
}

export const STATUT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  EN_ATTENTE: { label: 'En attente',  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
  ACCEPTE:    { label: 'Accepté',     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  REFUSE:     { label: 'Refusé',      color: 'text-red-600',     bg: 'bg-red-50 border-red-200' },
  EN_COURS:   { label: 'En cours',    color: 'text-blue-600',    bg: 'bg-blue-50 border-blue-200' },
};

export const RDV_CONFIG: Record<string, { label: string; color: string }> = {
  TELEPHONIQUE: { label: 'Téléphonique',    color: 'text-violet-600' },
  PHYSIQUE:     { label: 'Physique',        color: 'text-orange-600' },
  VISIO:        { label: 'Visioconférence', color: 'text-blue-600' },
};
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));