
import React, { useState, useEffect } from 'react';
import { Car, Fuel, Clock, MapPin, Euro, AlertCircle, ArrowRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { VehicleType, VehiculeCarburant } from '../data/missions';
// app/types/mission.ts
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

  lieuDepart?: string;                // ← make optional if some missions may not have it
  adresseDepartComplete?: string;
  lieuArrivee?: string;
  adresseArriveeComplete?: string;

  kmTotalAutorise: number;
  dateDebutMin: string;
  dateDebutMax: string;
  dateHeureExpiration: string;

  modeleVehicule: string;
  typeBoite: "Manuelle" | "Automatique";
  typeCarburant: VehiculeCarburant;

  tarifDepassementKm: number;
  tarifRetardHeure: number;
  tarifCarburant: string;
  tarifRestitutionAutreEndroit: number;

  conditionsAnnulation: string;
  carburantInclus: boolean;
  peagesInclus: boolean;
}
