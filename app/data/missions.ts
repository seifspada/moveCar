// app/data/missions.ts

import { FaGasPump, FaLeaf, FaBolt } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";
import { FuelType } from "../type/fuelConfig";
import { image } from "framer-motion/client";

// Types de véhicules disponibles
export type VehicleType = 
  | "citadine" 
  | "berline" 
  | "compacte" 
  | "suv" 
  | "cabriolet"
  | "monospace"
  | "luxe"
  | "camionnette";


  export type VehiculeCarburant = "Essence" | "Diesel" | "Hybride" | "Electrique";



  export const vehiculeCarburantIcons: Record<VehiculeCarburant,{ image: string; label: string, size: number }> = {
     Essence: { label: "essence", image: "/icons/vehicles/pompe-m.png", size: 24 },
  Diesel: { label: "diesel", image: "/icons/vehicles/pompe-m.png", size: 24 },
  Hybride: { label: "hybride", image: "/icons/vehicles/pompe-m.png", size: 24 },
  Electrique: { label: "electrique", image: "/icons/vehicles/electric-car.png", size: 32 },
  }
// Configuration des icônes pour chaque type de véhicule
export const vehicleIcons: Record<VehicleType, { image: string; label: string; examples: string }> = {
  citadine: {
    label: "Citadine",
    examples: "Fiat 500, Toyota Aygo",
    image: "/icons/vehicles/wagon-salon.png"
  },
  berline: {
    label: "Berline",
    examples: "Toyota Corolla, BMW Série 3",
    image: "/icons/vehicles/berline-de-luxe.png"
  },
  compacte: {
    label: "Compacte",
    examples: "Volkswagen Golf, Honda Civic",
    image: "/icons/vehicles/voiture-compacte.png"
  },
  suv: {
    label: "SUV / Crossover",
    examples: "Nissan Qashqai, Toyota RAV4",
    image: "/icons/vehicles/voiture-suv.png"
  },
  cabriolet: {
    label: "Cabriolet / Roadster",
    examples: "Mazda MX-5, BMW Z4",
    image: "/icons/vehicles/cabriolet.png"
  },
  monospace: {
    label: "Monospace",
    examples: "Renault Espace, Volkswagen Touran",
    image: "/icons/vehicles/monospace.png"
  },
  luxe: {
    label: "Voiture de luxe",
    examples: "Mercedes Classe S, Porsche Panamera",
    image: "/icons/vehicles/lux.png"
  },
  camionnette: {
    label: "Camionnette",
    examples: "Dmax",
    image: "/icons/vehicles/camionette.png"
  }
};


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
  lieuDepart: string;
  adresseDepartComplete: string;
  lieuArrivee: string;
  adresseArriveeComplete: string;

  kmTotalAutorise: number;
  dateDebutMin: string;
  dateDebutMax: string;
  dateHeureExpiration: string;

  modeleVehicule: string;
  typeBoite: "Manuelle" | "Automatique";
  typeCarburant: VehiculeCarburant; // ✅ Utilise directement FuelType au lieu de dupliquer

  tarifDepassementKm: number;
  tarifRetardHeure: number;
  tarifCarburant: string;
  tarifRestitutionAutreEndroit: number;

  conditionsAnnulation: string;
  carburantInclus: boolean;
  peagesInclus: boolean;
}

export const missionsData: Mission[] = [
  {
    id: 1,
    villeDepart: "Paris",
    villeArrivee: "Lyon",
    dateDisposition: "15/12/2025 - 20/12/2025",
    nbKm: 450,
    fraisPeage: "45 €",
    montant: 300,
    vehicleType: "berline",
    entite: "Avis Location",
    lieuDepart: "Concession Paris Nord",
    adresseDepartComplete: "45 Avenue de la République",
    lieuArrivee: "Gare Part-Dieu Lyon",
    adresseArriveeComplete: "Place Charles Béraudier",
    kmTotalAutorise: 500,
    dateDebutMin: "15/12/2025 - 08:00",
    dateDebutMax: "15/12/2025 - 18:00",
    dateHeureExpiration: "2025-12-15T18:00:00",
    modeleVehicule: "Peugeot 508",
    typeBoite: "Automatique",
    typeCarburant: "Diesel", // ✅ Plus besoin de typeCarburantIcon
    tarifDepassementKm: 0.50,
    tarifRetardHeure: 25.0,
    tarifCarburant: "Prix selon convention signée",
    tarifRestitutionAutreEndroit: 1.2,
    conditionsAnnulation: "Selon convention signée",
    carburantInclus: true,
    peagesInclus: true
  },
  {
    id: 2,
    villeDepart: "Marseille",
    villeArrivee: "Nice",
    dateDisposition: "18/12/2025 - 22/12/2025",
    nbKm: 200,
    fraisPeage: "30 €",
    montant: 180,
    vehicleType: "camionnette",
    entite: "Europcar",
    lieuDepart: "Port de Marseille",
    adresseDepartComplete: "Quai du Lazaret",
    lieuArrivee: "Aéroport Nice Côte d'Azur",
    adresseArriveeComplete: "Rue Costes et Bellonte",
    kmTotalAutorise: 250,
    dateDebutMin: "18/12/2025 - 09:00",
    dateDebutMax: "18/12/2025 - 17:00",
    dateHeureExpiration: "2025-12-18T17:00:00",
    modeleVehicule: "Toyota RAV4",
    typeBoite: "Automatique",
    typeCarburant: "Hybride",
    tarifDepassementKm: 0.6,
    tarifRetardHeure: 30,
    tarifCarburant: "Inclus",
    tarifRestitutionAutreEndroit: 1.5,
    conditionsAnnulation: "48h avant départ",
    carburantInclus: true,
    peagesInclus: true
  },
  {
    id: 3,
    villeDepart: "Lille",
    villeArrivee: "Bruxelles",
    dateDisposition: "20/12/2025 - 21/12/2025",
    nbKm: 120,
    fraisPeage: "0 €",
    montant: 120,
    vehicleType: "citadine",
    entite: "Sixt",
    lieuDepart: "Gare Lille Europe",
    adresseDepartComplete: "Place François Mitterrand",
    lieuArrivee: "Centre-ville Bruxelles",
    adresseArriveeComplete: "Rue Royale",
    kmTotalAutorise: 150,
    dateDebutMin: "20/12/2025 - 07:00",
    dateDebutMax: "20/12/2025 - 12:00",
    dateHeureExpiration: "2025-12-20T12:00:00",
    modeleVehicule: "Renault Clio",
    typeBoite: "Manuelle",
    typeCarburant: "Essence",
    tarifDepassementKm: 0.4,
    tarifRetardHeure: 20,
    tarifCarburant: "À la charge du chauffeur",
    tarifRestitutionAutreEndroit: 1.0,
    conditionsAnnulation: "Non remboursable",
    carburantInclus: false,
    peagesInclus: false
  },
  {
    id: 4,
    villeDepart: "Bordeaux",
    villeArrivee: "Toulouse",
    dateDisposition: "22/12/2025 - 24/12/2025",
    nbKm: 245,
    fraisPeage: "28 €",
    montant: 200,
    vehicleType: "luxe",
    entite: "FranceCars",
    lieuDepart: "Aéroport Bordeaux",
    adresseDepartComplete: "Avenue René Cassin",
    lieuArrivee: "Aéroport Toulouse",
    adresseArriveeComplete: "Blagnac",
    kmTotalAutorise: 300,
    dateDebutMin: "22/12/2025 - 10:00",
    dateDebutMax: "22/12/2025 - 16:00",
    dateHeureExpiration: "2025-12-22T16:00:00",
    modeleVehicule: "Skoda Octavia",
    typeBoite: "Manuelle",
    typeCarburant: "Diesel",
    tarifDepassementKm: 0.55,
    tarifRetardHeure: 22,
    tarifCarburant: "Selon facture",
    tarifRestitutionAutreEndroit: 1.3,
    conditionsAnnulation: "24h avant",
    carburantInclus: true,
    peagesInclus: true
  },
  {
    id: 5,
    villeDepart: "Strasbourg",
    villeArrivee: "Metz",
    dateDisposition: "23/12/2025 - 24/12/2025",
    nbKm: 165,
    fraisPeage: "18 €",
    montant: 140,
    vehicleType: "berline",
    entite: "Hertz",
    lieuDepart: "Centre Strasbourg",
    adresseDepartComplete: "Rue du Faubourg",
    lieuArrivee: "Gare Metz",
    adresseArriveeComplete: "Place du Général de Gaulle",
    kmTotalAutorise: 200,
    dateDebutMin: "23/12/2025 - 08:30",
    dateDebutMax: "23/12/2025 - 14:00",
    dateHeureExpiration: "2025-12-23T14:00:00",
    modeleVehicule: "BMW Série 3",
    typeBoite: "Automatique",
    typeCarburant: "Electrique",
    tarifDepassementKm: 0.7,
    tarifRetardHeure: 35,
    tarifCarburant: "Inclus",
    tarifRestitutionAutreEndroit: 1.8,
    conditionsAnnulation: "Selon contrat",
    carburantInclus: true,
    peagesInclus: true
  }
];