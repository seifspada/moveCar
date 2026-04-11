export type StatutRendezvous = 'PLANIFIE' | 'CONFIRME' | 'ANNULE' | 'TERMINE';
export type StatutDemande = 'EN_ATTENTE' | 'EN_COURS_TRAITEMENT' | 'ACCEPTEE' | 'REFUSEE';

export interface Rendezvous {
  id: number;
  typeRdv: string;
  dateRdv: string;
  creneau: string;
  statut: StatutRendezvous;
  lienVisio: string | null;
  adresse: string | null;
  email: string;
  nom: string;
  entite: string;
  statutDemande: StatutDemande;
}

export interface RendezvousResponse {
  success: boolean;
  count: number;
  rendezvous: Rendezvous[];
}