// app/types/fuelConfig.ts
// ✅ CORRIGÉ : clés en MAJUSCULES anglais correspondant exactement au backend TypeCarburantEnum

import { FaGasPump, FaLeaf, FaBolt } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";

// ✅ CORRIGÉ : clés MAJUSCULES = exactement ce que renvoie le backend GraphQL
export const fuelConfig = {
  ESSENCE: {
    icon: FaGasPump,
    color: "text-red-500",
    label: "Essence",
  },
  DIESEL: {
    icon: MdLocalGasStation,
    color: "text-blue-500",
    label: "Diesel",
  },
  HYBRIDE: {
    icon: FaLeaf,
    color: "text-green-500",
    label: "Hybride",
  },
  // ✅ CORRIGÉ : "Électrique" → "ELECTRIQUE" (sans accent, MAJUSCULES)
  ELECTRIQUE: {
    icon: FaBolt,
    color: "text-orange-500",
    label: "Électrique",
  },
} as const;

export type FuelType = keyof typeof fuelConfig;

/**
 * Helper pour récupérer la config carburant de manière sécurisée
 * ✅ Normalise la valeur reçue du backend avant lookup
 */
export const getFuelConfig = (typeCarburant: string | undefined | null) => {
  if (!typeCarburant) return fuelConfig.ESSENCE;

  const normalized = typeCarburant
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") as FuelType;

  return fuelConfig[normalized] ?? fuelConfig.ESSENCE;
};