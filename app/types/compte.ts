// app/types/compte.ts

export type DocumentStatus = 'valide' | 'bientot_expire' | 'expire';

export interface AdherentDocument { // ✅ Renommé (plus de conflit DOM)
  nom: string;
  dateExpiration: Date | string; // ✅ Accepte les deux
  statut: DocumentStatus;
}

export interface UserProfile {
  photo: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  rib: string;
}
