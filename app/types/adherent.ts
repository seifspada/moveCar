// app/types/adherent.ts

// ================== NAVBAR / PROFILE ==================

export interface AdherentNavbar {
  nom:      string;
  prenom:   string;
  email:    string;
  photo:    string | null;
  typePack: string;
}

export interface AdherentNavbarData {
  adherentMe: {
    nom:      string;
    prenom:   string;
    email:    string;
    photo:    string | null;
    typePack: 'basique' | 'premium';
  };
}

export interface AdherentProfile {
  nom:       string;
  prenom:    string;
  email:     string;
  photo:     string | null;
  telephone: string | null;
  adresse:   string | null;
  ville:     string | null;
  typePack:  string;
}

export interface AdherentProfileData {
  adherentProfile: AdherentProfile;
}

// ================== DEMANDE ADHÉSION ==================

// ✅ Statuts réels du backend (StatutDemande dans Prisma)
export type StatutAdherent =
  | 'EN_ATTENTE'
  | 'ACCEPTEE'   // ← avec double E (comme dans Prisma)
  | 'REFUSEE'    // ← avec double E (comme dans Prisma)
  | 'VALIDEE';   // ← avec double E (comme dans Prisma)

export type TypeDocument =
  | 'CARTE_IDENTITE'
  | 'PERMIS'
  | 'KBIS'
  | 'RIB'
  | 'RC_PRO'
  | 'RC_CIRCULATION'
  | 'CASIER_JUDICIAIRE'
  | 'W_GARAGE';

export type StatutDocument = 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';

// ✅ Fichier attaché à un document (réponse réelle de l'API)
export type FichierDocument = {
  id:               number;
  cheminFichier:    string;
  documentId:       number;
  dateCreation:     string;
  dateModification: string;
};

// ✅ Document avec fichiers[] (structure réelle de l'API)
export interface DocumentAdherent {
  id:                number;
  typeDocument:      TypeDocument;
  statut:            StatutDocument | null;  // ← ajouté
  demandeAdhesionId: number;
  dateCreation:      string;
  dateModification:  string;
  fichiers:          FichierDocument[];      // ← remplace cheminFichier direct

  // Champs optionnels selon le type de document
  numero?:             string | null;        // PERMIS uniquement
  dateDebutValidite?:  string | null;        // PERMIS, RC_PRO, RC_CIRCULATION
  dateFinValidite?:    string | null;        // RC_PRO, RC_CIRCULATION
}

// ✅ Demande complète
export interface DemandeAdherent {
  id:               number;
  nom:              string;
  prenom:           string;
  dateNaissance:    string;
  email:            string;
  telephone:        string;
  adresse:          string;
  ville:            string;
  raisonSociale:    string;
  numeroKbis:       string;
  statut:           StatutAdherent;
  dateCreation:     string;
  dateModification: string;
  documents:        DocumentAdherent[];
  adherent:         any[];
  // profileToken et profileTokenExpiry exclus volontairement (nettoyés côté backend)
}

// ================== CONFIG STATUT ==================

export const STATUT_ADHERENT_CONFIG: Record<StatutAdherent, {
  label: string;
  color: string;
  bg:    string;
}> = {
  EN_ATTENTE: { label: 'En attente', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  ACCEPTEE:   { label: 'Acceptée',   color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  REFUSEE:    { label: 'Refusée',    color: 'text-red-600',   bg: 'bg-red-50   border-red-200'   },
  VALIDEE:    { label: 'Validée',    color: 'text-blue-600',  bg: 'bg-blue-50  border-blue-200'  },
};