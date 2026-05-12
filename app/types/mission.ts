// app/types/mission.ts
import type { VehicleType, VehiculeCarburant } from '@/app/config/mission-icons.config';

export interface Adresse {
  villeNom: string;
  adresseComplete: string;
  typeLieu: string;
  nomLieu?: string;           // ✅ Ajouté
  latitude?: number;          // ✅ Ajouté
  longitude?: number;         // ✅ Ajouté
}


export interface Calcul {
  distanceKm: number;
  montantTotal: number;
  fraisPeage: number;
  detailCalcul?: {            // ✅ Rendu optionnel (?)
    dureeFormatee: string;
    prixParKm: number;
  };
}


export interface Vehicule {
  marqueModele: string;
  immatriculation: string;
  typeVehicule: VehicleType;
  typeCarburant: VehiculeCarburant;
  nombrePlaces: number;
  boiteVitesse?: string;      // ✅ Ajouté
}


export interface Disponibilite {
  dateDebut: string;
  dateFin: string;
  dateDepartMax?: string;     // ✅ Ajouté
}


export interface Notification {
  typeNotification: 'DEPART' | 'ARRIVEE';
  actif: boolean;
  nomContact?: string;        // ✅ Optionnel
  telephoneContact?: string;  // ✅ Optionnel
}


// ✅ Interface unique, utilisée partout côté front
export interface MissionFormData {
  // Entité (front uniquement)
  entite: string;
  adresseEntite: string;


  // Adresses
  villeDepart: string;
  adresseDepartComplete: string;
  typeLieuDepart: string;
  nomLieuDepart?: string;


  villeArrivee: string;
  adresseArriveeComplete: string;
  typeLieuArrivee: string;
  nomLieuArrivee?: string;


  // Contacts
  nomContactDepart?: string;
  telephoneContactDepart?: string;
  nomContactArrivee?: string;
  telephoneContactArrivee?: string;


  // Véhicule
  typeVehicule: VehicleType | '';
  typeCarburant: VehiculeCarburant | '';
  marqueModele: string;
  immatriculation: string;
  nombrePlaces: number | string;
  boiteVitesse: string;


  // Disponibilité (dates ISO envoyées au backend)
  dateDebut?: string;
  dateFin?: string;


  // Notifications (flags)
  notifierDepart?: boolean;
  notifierArrivee?: boolean;


  // Commentaire
  commentaire?: string;
}


export interface FileUpload {
  name: string;
  size: number;
  type: string;
  file: File;
}


export interface MissionData {
  id: string;
  statut: string;
  dateCreation: string;
  adresseDepart?: any;
  adresseArrivee?: any;
  calculs?: {
    distanceKm: number;
    montantTotal: number;
    fraisPeage: number;             // ✅ ICI (dans calculs)
    detailCalcul?: {
      dureeFormatee: string;
      prixParKm: number;
    };
  };
  vehicule?: any;
  disponibilite?: any;
  notifications?: any[];
  commentaire?: string;
  documents?: any[];
}



// app/types/mission.ts


// app/types/mission.ts
export type MissionDetails = {
  id: string;
  statut: string;    
  typeVehicule: VehicleType;
  typeCarburant: VehiculeCarburant;
  villeDepart: string;
  villeArrivee: string;
  distanceKm: number;
  fraisPeage: number;
  montantTotal: number;
  dateDebut: string;
  dateDepartMax: string | null;
};


// ==========================================
// ✅ INTERFACES AJOUTÉES POUR LE HOOK
// ==========================================

export interface Partenaire {
  id: number;
  nom: string;
  prenom: string;
  entiteGroupe: string;
  entiteAgence?: string;
  email: string;
  telephone: string;
  logo?: string;
}


// Interface complète pour la page de détails (utilise vos interfaces existantes)
export interface MissionDetail {
  id: string;
  statut: string;
  commentaire?: string;
  dateCreation: string;
  partenaire: Partenaire;
  vehicule: Vehicule;
  adresseDepart: Adresse;
  adresseArrivee: Adresse;
  disponibilite?: Disponibilite;
  calculs?: Calcul;
  notifications: Notification[];
}


// ✅ Import MissionListItem type
import type { MissionListItem } from '@/app/data/missions';

// Props pour le composant MissionDetailsCard
export interface MissionCardProps {
  mission: MissionDetail;
}

// ✅ File data structure
export interface FileData {
  name: string;
  size?: number;
  type?: string;
  url?: string;
}

// ✅ Alias for backwards compatibility - accepts multiple mission types
export type Mission = MissionData | MissionDetail | MissionListItem;
