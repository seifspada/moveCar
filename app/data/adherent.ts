// ==================== TYPES SIMPLES ====================

export type TypePermis = "B" | "BE" | "C" | "CE" | "D" | "DE";
export type StatutDemande = "en_attente" | "en_verification" | "acceptee" | "refusee" | "incomplete";
export type PackAbonnement = "basique" | "premium";

// Interface pour un document avec dates de création et expiration
export interface Document {
  nom: string;
  url: string;
  dateCreation: string;      // ✅ Date de création du document
  dateExpiration: string;     // ✅ Date d'expiration du document
  dateUpload: string;         // Date d'upload sur la plateforme
  taille: number;             // en Ko
}

// Interface Adherent
export interface Adherent {
  id: number;
  
  // Infos personnelles
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  photoPersonnelle: string;
  
  // Infos entreprise
  raisonSociale: string;
  numeroKbis: string;
  
  // Permis
  numeroPermis: string;
  typePermis: TypePermis;
  dateDelivrancePermis: string;
  
  // Documents (valeurs réelles)
  carteIdentite: Document;
  permisRectoVerso: Document;
  kbis: Document;
  rib: Document;
  assuranceRcPro: Document;
  assuranceRcCirculation: Document;
  casierJudiciaire: Document;
  photoIdentite: Document;
  
  // Véhicule
  immatriculation: string;
  
  // Abonnement
  pack: PackAbonnement;
  montantMensuel: number;
  
  // Statut
  statut: StatutDemande;
  dateSoumission: string;
  dateValidation?: string;
}

// ==================== CONFIGURATIONS ====================

export const typePermisOptions = [
  { value: "B", label: "B (Voiture)" },
  { value: "BE", label: "BE (Voiture + remorque)" },
  { value: "C", label: "C (Poids lourd)" },
  { value: "CE", label: "CE (Poids lourd + remorque)" },
  { value: "D", label: "D (Bus / Transport de personnes)" },
  { value: "DE", label: "DE (Bus + remorque)" }
];

export const packs = {
  basique: {
    nom: "Pack Basique",
    prix: 47.50,
    avantages: [
      "Diffusion des missions",
      "Relance de paiement",
      "Annulation gratuite avant 16h la veille"
    ]
  },
  premium: {
    nom: "Pack Premium",
    prix: 57.50,
    avantages: [
      "Diffusion prioritaire (2h d'avance)",
      "2 lettres de relance",
      "Annulation gratuite avant 12h le jour même"
    ]
  }
};

export const statutColors = {
  en_attente: { bg: "bg-slate-100", text: "text-slate-600", label: "En attente" },
  en_verification: { bg: "bg-blue-100", text: "text-blue-600", label: "En vérification" },
  acceptee: { bg: "bg-green-100", text: "text-green-600", label: "Acceptée" },
  refusee: { bg: "bg-red-100", text: "text-red-600", label: "Refusée" },
  incomplete: { bg: "bg-orange-100", text: "text-orange-600", label: "Incomplète" }
};

export const documentsRequis = [
  "Carte d'identité",
  "Permis recto/verso",
  "Kbis (moins de 3 mois)",
  "RIB",
  "Assurance RC PRO",
  "Assurance RC circulation",
  "Casier judiciaire (moins de 3 mois)",
  "Photo d'identité"
];

// ==================== DONNÉES EXEMPLES ====================

export const adherents: Adherent[] = [
  {
    id: 1,
    nom: "DUPONT",
    prenom: "Jean",
    dateNaissance: "1985-03-15",
    email: "jean.dupont@example.com",
    telephone: "06 12 34 56 78",
    adresse: "12 rue des Lilas",
    ville: "Paris",
    photoPersonnelle: "/uploads/profiles/photo_dupont.jpg",
    raisonSociale: "SARL TRANSPORT EXPRESS",
    numeroKbis: "123 456 789 00012",
    numeroPermis: "AB-123-CD",
    typePermis: "B",
    dateDelivrancePermis: "2010-06-20",
    carteIdentite: {
      nom: "CNI_DUPONT_Jean.pdf",
      url: "/uploads/documents/cni_1.pdf",
      dateCreation: "2020-03-15",
      dateExpiration: "2030-03-15",
      dateUpload: "2026-01-05T10:30:00",
      taille: 245
    },
    permisRectoVerso: {
      nom: "Permis_DUPONT_RectoVerso.jpg",
      url: "/uploads/documents/permis_1.jpg",
      dateCreation: "2010-06-20",
      dateExpiration: "2040-06-20",
      dateUpload: "2026-01-05T10:32:00",
      taille: 1200
    },
    kbis: {
      nom: "KBIS_Transport_Express.pdf",
      url: "/uploads/documents/kbis_1.pdf",
      dateCreation: "2025-11-10",
      dateExpiration: "2026-02-10",
      dateUpload: "2026-01-05T10:35:00",
      taille: 180
    },
    rib: {
      nom: "RIB_DUPONT_Jean.pdf",
      url: "/uploads/documents/rib_1.pdf",
      dateCreation: "2024-01-15",
      dateExpiration: "2029-01-15",
      dateUpload: "2026-01-05T10:37:00",
      taille: 95
    },
    assuranceRcPro: {
      nom: "Assurance_RC_PRO_2026.pdf",
      url: "/uploads/documents/rc_pro_1.pdf",
      dateCreation: "2026-01-01",
      dateExpiration: "2026-1-13",
      dateUpload: "2026-01-05T10:40:00",
      taille: 320
    },
    assuranceRcCirculation: {
      nom: "Assurance_Vehicule_AB123CD_Photo.jpg",
      url: "/uploads/documents/assurance_1.jpg",
      dateCreation: "2025-06-15",
      dateExpiration: "2025-12-15",
      dateUpload: "2026-01-05T10:42:00",
      taille: 850
    },
    casierJudiciaire: {
      nom: "Casier_Judiciaire_DUPONT.pdf",
      url: "/uploads/documents/casier_1.pdf",
      dateCreation: "2025-11-20",
      dateExpiration: "2026-02-20",
      dateUpload: "2026-01-05T10:45:00",
      taille: 125
    },
    photoIdentite: {
      nom: "Photo_Identite_DUPONT.jpg",
      url: "/uploads/documents/photo_1.jpg",
      dateCreation: "2025-12-01",
      dateExpiration: "2030-12-01",
      dateUpload: "2026-01-05T11:00:00",
      taille: 450
    },
    immatriculation: "AB-123-CD",
    pack: "premium",
    montantMensuel: 57.50,
    statut: "acceptee",
    dateSoumission: "2026-01-05T10:15:00",
    dateValidation: "2026-01-08T14:30:00"
  },
  {
    id: 2,
    nom: "MARTIN",
    prenom: "Sophie",
    dateNaissance: "1990-07-22",
    email: "sophie.martin@example.com",
    telephone: "06 98 76 54 32",
    adresse: "8 avenue des Fleurs",
    ville: "Lyon",
    photoPersonnelle: "/uploads/profiles/photo_martin.jpg",
    raisonSociale: "EURL MARTIN TRANSPORT",
    numeroKbis: "987 654 321 00025",
    numeroPermis: "EF-456-GH",
    typePermis: "C",
    dateDelivrancePermis: "2015-09-10",
    carteIdentite: {
      nom: "CNI_MARTIN_Sophie.pdf",
      url: "/uploads/documents/cni_2.pdf",
      dateCreation: "2019-08-10",
      dateExpiration: "2029-08-10",
      dateUpload: "2026-01-07T09:20:00",
      taille: 230
    },
    permisRectoVerso: {
      nom: "Permis_MARTIN_RectoVerso.jpg",
      url: "/uploads/documents/permis_2.jpg",
      dateCreation: "2015-09-10",
      dateExpiration: "2065-09-10",
      dateUpload: "2026-01-07T09:22:00",
      taille: 1150
    },
    kbis: {
      nom: "KBIS_Martin_Transport.pdf",
      url: "/uploads/documents/kbis_2.pdf",
      dateCreation: "2025-12-05",
      dateExpiration: "2026-03-05",
      dateUpload: "2026-01-07T09:25:00",
      taille: 175
    },
    rib: {
      nom: "RIB_MARTIN_Sophie.pdf",
      url: "/uploads/documents/rib_2.pdf",
      dateCreation: "2023-05-20",
      dateExpiration: "2028-05-20",
      dateUpload: "2026-01-07T09:27:00",
      taille: 88
    },
    assuranceRcPro: {
      nom: "RC_PRO_MARTIN_2026.pdf",
      url: "/uploads/documents/rc_pro_2.pdf",
      dateCreation: "2025-12-20",
      dateExpiration: "2026-12-20",
      dateUpload: "2026-01-07T09:30:00",
      taille: 305
    },
    assuranceRcCirculation: {
      nom: "Assurance_EF456GH_Photo.jpg",
      url: "/uploads/documents/assurance_2.jpg",
      dateCreation: "2025-08-01",
      dateExpiration: "2026-02-01",
      dateUpload: "2026-01-07T09:32:00",
      taille: 920
    },
    casierJudiciaire: {
      nom: "Casier_Judiciaire_MARTIN.pdf",
      url: "/uploads/documents/casier_2.pdf",
      dateCreation: "2025-11-15",
      dateExpiration: "2026-02-15",
      dateUpload: "2026-01-07T09:35:00",
      taille: 118
    },
    photoIdentite: {
      nom: "Photo_Identite_MARTIN.jpg",
      url: "/uploads/documents/photo_2.jpg",
      dateCreation: "2025-10-10",
      dateExpiration: "2030-10-10",
      dateUpload: "2026-01-07T09:40:00",
      taille: 380
    },
    immatriculation: "EF-456-GH",
    pack: "basique",
    montantMensuel: 47.50,
    statut: "en_verification",
    dateSoumission: "2026-01-07T09:15:00"
  }
  // ... (ajoutez les autres adhérents avec le même format)
];

// ==================== FONCTIONS UTILES ====================

// Vérifier si tous les documents sont présents
export function dossierComplet(adherent: Adherent): boolean {
  return !!(
    adherent.carteIdentite &&
    adherent.permisRectoVerso &&
    adherent.kbis &&
    adherent.rib &&
    adherent.assuranceRcPro &&
    adherent.assuranceRcCirculation &&
    adherent.casierJudiciaire &&
    adherent.photoIdentite
  );
}

// ✅ Vérifier si un document est expiré
export function estDocumentExpire(document: Document): boolean {
  const aujourdhui = new Date();
  const dateExp = new Date(document.dateExpiration);
  return aujourdhui > dateExp;
}

// ✅ Calculer les jours restants avant expiration
export function joursAvantExpiration(document: Document): number {
  const aujourdhui = new Date();
  const dateExp = new Date(document.dateExpiration);
  const diffTime = dateExp.getTime() - aujourdhui.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// ✅ Vérifier si un document expire bientôt (moins de 30 jours)
export function documentExpireBientot(document: Document): boolean {
  const jours = joursAvantExpiration(document);
  return jours > 0 && jours <= 30;
}

// ✅ Obtenir tous les documents expirés d'un adhérent
export function documentsExpires(adherent: Adherent): Document[] {
  return listeDocuments(adherent).filter(doc => estDocumentExpire(doc));
}

// ✅ Obtenir tous les documents qui expirent bientôt
export function documentsARenouveler(adherent: Adherent): Document[] {
  return listeDocuments(adherent).filter(doc => documentExpireBientot(doc));
}

// Obtenir la liste des documents
export function listeDocuments(adherent: Adherent): Document[] {
  return [
    adherent.carteIdentite,
    adherent.permisRectoVerso,
    adherent.kbis,
    adherent.rib,
    adherent.assuranceRcPro,
    adherent.assuranceRcCirculation,
    adherent.casierJudiciaire,
    adherent.photoIdentite
  ];
}

// Calculer la taille totale des documents (en Ko)
export function tailleTotaleDocuments(adherent: Adherent): number {
  return listeDocuments(adherent).reduce((total, doc) => total + doc.taille, 0);
}

// Calculer l'âge
export function calculerAge(dateNaissance: string): number {
  const aujourdhui = new Date();
  const naissance = new Date(dateNaissance);
  let age = aujourdhui.getFullYear() - naissance.getFullYear();
  const mois = aujourdhui.getMonth() - naissance.getMonth();
  if (mois < 0 || (mois === 0 && aujourdhui.getDate() < naissance.getDate())) {
    age--;
  }
  return age;
}

// Filtrer par statut
export function filtrerParStatut(statut: StatutDemande): Adherent[] {
  return adherents.filter(a => a.statut === statut);
}

// Filtrer par pack
export function filtrerParPack(pack: PackAbonnement): Adherent[] {
  return adherents.filter(a => a.pack === pack);
}

// Formater la taille en Mo si nécessaire
export function formaterTaille(tailleKo: number): string {
  if (tailleKo > 1024) {
    return `${(tailleKo / 1024).toFixed(2)} Mo`;
  }
  return `${tailleKo} Ko`;
}

// Obtenir les initiales pour l'avatar
export function obtenirInitiales(adherent: Adherent): string {
  return `${adherent.prenom.charAt(0)}${adherent.nom.charAt(0)}`.toUpperCase();
}

// ✅ Formater une date en français
export function formaterDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
