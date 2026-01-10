// app/types/mission.ts
import { EtatMission, VehicleType, VehiculeCarburant } from '../data/missions';

export interface Mission {
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateDisposition: string;
  nbKm: number;
  fraisPeage: string;
  montant: number;
  vehicleType: VehicleType;
  entite: string;

  lieuDepart?: string;
  adresseDepartComplete?: string;
  lieuArrivee?: string;
  adresseArriveeComplete?: string;

  kmTotalAutorise: number;
  dateDebutMin: string;
  dateDebutMax: string;
  dateHeureExpiration: string;

  modeleVehicule: string;
  typeBoite: "Manuelle" | "Automatique";
  immatriculation: string;
  typeCarburant: VehiculeCarburant;

  tarifDepassementKm: number;
  tarifRetardHeure: number;
  tarifCarburant: string;
  tarifRestitutionAutreEndroit: number;

  conditionsAnnulation: string;
  carburantInclus: boolean;
  peagesInclus: boolean;
  favorite?: boolean;

  etatMission: EtatMission;
  dateHeureDebut?: string;
  dateHeureFin?: string;
}