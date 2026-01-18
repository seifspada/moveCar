


export interface DepartMission {
  id: number;
  missionId: number;
  adherentId: number;
  reservationId: number;             

  dateCreation: string;               
  dateCompletionTotal?: string;       

  etape1_instructionsLues: boolean;           
  etape1_dateValidation?: string;

  etape2_photoAdherent: string | null;        // URL de la photo
  etape2_photoPermisRecto: string | null;     // URL photo recto permis
  etape2_photoPermisVerso: string | null;     // URL photo verso permis
  etape2_conditionsAcceptees: boolean;        // Toggle activé = true
  etape2_dateValidation?: string;

  etape3_kilometrage: number;                 // Nombre saisi par compteur

  etape3_niveauCarburant: number;             // 0-100%

  etape3_photoImmatriculation: string | null; // Photo plaque
  etape3_photoTableauBord: string | null;     // Photo tableau de bord

  etape3_videoInterieur: string | null;       // Vidéo intérieur véhicule
  etape3_videoExterieur: string | null;       // Vidéo extérieur véhicule

  etape3_conditionsAcceptees: boolean;        // Toggle activé = true
  etape3_dateValidation?: string;

  etape4_signatureAdherent: string | null;    // Signature canvas
  etape4_signatureEntite: string | null;      // Signature responsable
  etape4_conditionsFinalesAcceptees: boolean; // Toggle activé = true
  etape4_dateValidation?: string;

  etape1Complete: boolean;
  etape2Complete: boolean;
  etape3Complete: boolean;
  etape4Complete: boolean;
  toutComplet: boolean;                       // true si 4 étapes = true
  pourcentageProgression: number;             // 0, 25, 50, 75, 100
}


export const departsEnCours: DepartMission[] = [
  {
    id: 1,
    missionId: 1,
    adherentId: 1,
    reservationId: 1,
    dateCreation: "2026-01-10T07:30:00",

    etape1_instructionsLues: true,
    etape1_dateValidation: "2026-01-10T07:35:00",

    etape2_photoAdherent: null,
    etape2_photoPermisRecto: null,
    etape2_photoPermisVerso: null,
    etape2_conditionsAcceptees: false,

    etape3_kilometrage: 0,
    etape3_niveauCarburant: 0,
    etape3_photoImmatriculation: null,
    etape3_photoTableauBord: null,
    etape3_videoInterieur: null,
    etape3_videoExterieur: null,
    etape3_conditionsAcceptees: false,

    etape4_signatureAdherent: null,
    etape4_signatureEntite: null,
    etape4_conditionsFinalesAcceptees: false,

    etape1Complete: true,
    etape2Complete: false,
    etape3Complete: false,
    etape4Complete: false,
    toutComplet: false,
    pourcentageProgression: 25
  },

  {
    id: 2,
    missionId: 3,
    adherentId: 2,
    reservationId: 4,
    dateCreation: "2025-12-20T07:30:00",
    dateCompletionTotal: "2025-12-20T07:55:00",

    etape1_instructionsLues: true,
    etape1_dateValidation: "2025-12-20T07:32:00",

    etape2_photoAdherent: "/uploads/departs/d2/photo_adherent.jpg",
    etape2_photoPermisRecto: "/uploads/departs/d2/permis_recto.jpg",
    etape2_photoPermisVerso: "/uploads/departs/d2/permis_verso.jpg",
    etape2_conditionsAcceptees: true,
    etape2_dateValidation: "2025-12-20T07:40:00",

    etape3_kilometrage: 28450,
    etape3_niveauCarburant: 100,
    etape3_photoImmatriculation: "/uploads/departs/d2/immatriculation.jpg",
    etape3_photoTableauBord: "/uploads/departs/d2/tableau_bord.jpg",
    etape3_videoInterieur: "/uploads/departs/d2/video_interieur.mp4",
    etape3_videoExterieur: "/uploads/departs/d2/video_exterieur.mp4",
    etape3_conditionsAcceptees: true,
    etape3_dateValidation: "2025-12-20T07:50:00",

    etape4_signatureAdherent: "/uploads/departs/d2/signature_adherent.png",
    etape4_signatureEntite: "/uploads/departs/d2/signature_entite.png",
    etape4_conditionsFinalesAcceptees: true,
    etape4_dateValidation: "2025-12-20T07:55:00",

    etape1Complete: true,
    etape2Complete: true,
    etape3Complete: true,
    etape4Complete: true,
    toutComplet: true,
    pourcentageProgression: 100
  }
];


export const validateEtape1 = (depart: DepartMission): boolean => {
  return depart.etape1_instructionsLues === true;
};

export const validateEtape2 = (depart: DepartMission): boolean => {
  return (
    depart.etape2_photoAdherent !== null &&
    depart.etape2_photoPermisRecto !== null &&
    depart.etape2_photoPermisVerso !== null &&
    depart.etape2_conditionsAcceptees === true
  );
};

export const validateEtape3 = (depart: DepartMission): boolean => {
  return (
    depart.etape3_kilometrage > 0 &&
    depart.etape3_photoImmatriculation !== null &&
    depart.etape3_photoTableauBord !== null &&
    depart.etape3_videoInterieur !== null &&
    depart.etape3_videoExterieur !== null &&
    depart.etape3_conditionsAcceptees === true
  );
};

export const validateEtape4 = (depart: DepartMission): boolean => {
  return (
    depart.etape4_signatureAdherent !== null &&
    depart.etape4_signatureEntite !== null &&
    depart.etape4_conditionsFinalesAcceptees === true
  );
};


export const departHelpers = {
  calculateProgression: (depart: DepartMission): number => {
    let completed = 0;
    if (depart.etape1Complete) completed += 25;
    if (depart.etape2Complete) completed += 25;
    if (depart.etape3Complete) completed += 25;
    if (depart.etape4Complete) completed += 25;
    return completed;
  },

  isToutComplet: (depart: DepartMission): boolean => {
    return (
      depart.etape1Complete &&
      depart.etape2Complete &&
      depart.etape3Complete &&
      depart.etape4Complete
    );
  },

  getByMission: (missionId: number): DepartMission | undefined => {
    return departsEnCours.find(d => d.missionId === missionId);
  },

  getByReservation: (reservationId: number): DepartMission | undefined => {
    return departsEnCours.find(d => d.reservationId === reservationId);
  },

  getByAdherent: (adherentId: number): DepartMission[] => {
    return departsEnCours.filter(d => d.adherentId === adherentId);
  },

  getIncomplete: (): DepartMission[] => {
    return departsEnCours.filter(d => !d.toutComplet);
  }
};

