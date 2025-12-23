
import React, { useState, useEffect } from 'react';
import { Car, Fuel, Clock, MapPin, Euro, AlertCircle, ArrowRight, ChevronDown, ArrowLeft } from 'lucide-react';

// Interface Mission complète
export interface Mission {
  // Attributs existants (corps original)
  id: number;
  villeDepart: string;
  villeArrivee: string;
  dateDisposition: string;
  nbKm: number;
  fraisPeage: string;
  montant: number;
  vehicleType?: string;
  
  // Attributs ajoutés pour les détails complets
  entite?: string;
  lieuDepart?: string;
  adresseDepartComplete?: string;
  lieuArrivee?: string;
  adresseArriveeComplete?: string;
  kmTotalAutorise?: number;
  dateDebutMin?: string;
  dateDebutMax?: string;
  dateHeureExpiration?: string;
  modeleVehicule?: string;
  typeBoite?: 'Manuelle' | 'Automatique';
  typeCarburant?: string;
  tarifDepassementKm?: number;
  tarifRetardHeure?: number;
  tarifCarburant?: string;
  tarifRestitutionAutreEndroit?: number;
  conditionsAnnulation?: string;
  carburantInclus?: boolean;
  peagesInclus?: boolean;
}

// Données des missions
const missionsData: Mission[] = [
  {
    id: 1,
    villeDepart: "Paris",
    villeArrivee: "Lyon",
    dateDisposition: "15/12/2025 - 20/12/2025",
    nbKm: 450,
    fraisPeage: "45 €",
    montant: 300,
    vehicleType: "Berline",
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
    typeCarburant: "Diesel",
    tarifDepassementKm: 0.50,
    tarifRetardHeure: 25.00,
    tarifCarburant: "Prix selon convention signée",
    tarifRestitutionAutreEndroit: 1.20,
    conditionsAnnulation: "Selon convention signée",
    carburantInclus: true,
    peagesInclus: true
  },
  {
    id: 2,
    villeDepart: "Marseille",
    villeArrivee: "Nice",
    dateDisposition: "18/12/2025",
    nbKm: 200,
    fraisPeage: "20 €",
    montant: 500,
    vehicleType: "SUV",
    entite: "FranceCars",
    lieuDepart: "Aéroport Marseille Provence",
    adresseDepartComplete: "Terminal 1",
    lieuArrivee: "Aéroport Nice Côte d'Azur",
    adresseArriveeComplete: "Terminal 2",
    kmTotalAutorise: 250,
    dateDebutMin: "18/12/2025 - 10:00",
    dateDebutMax: "18/12/2025 - 16:00",
    dateHeureExpiration: "2025-12-18T16:00:00",
    modeleVehicule: "Renault Kadjar",
    typeBoite: "Manuelle",
    typeCarburant: "Essence",
    tarifDepassementKm: 0.60,
    tarifRetardHeure: 30.00,
    tarifCarburant: "Prix selon convention signée",
    tarifRestitutionAutreEndroit: 1.50,
    conditionsAnnulation: "Selon convention signée",
    carburantInclus: true,
    peagesInclus: true
  },
];
