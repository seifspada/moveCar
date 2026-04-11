// app/config/mission-icons.config.ts
import { FaGasPump, FaLeaf, FaBolt } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";


// ==================== TYPES ====================


// ✅ Mapper les types du backend (UPPERCASE) vers frontend
export type VehicleType = 
  | "CITADINE" 
  | "BERLINE" 
  | "COMPACTE"
  | "SUV"          // ✅ AJOUTÉ
  | "CABRIOLET"
  | "MONOSPACE"
  | "LUXE"
  | "VU_3M3"
  | "VU_6M3"
  | "VU_9M3"
  | "VU_12M3"
  | "VU_15M3"
  | "VU_20M3"
  | "VU_25M3"
  | "VU_30M3";


export type VehiculeCarburant = "ESSENCE" | "DIESEL" | "HYBRIDE" | "ELECTRIQUE";


// ==================== ICÔNES CARBURANT ====================


// ✅ Configuration avec images PNG (comme votre ancien code)
export const carburantConfig: Record<VehiculeCarburant, { 
  image: string; 
  label: string;
  color: string;
  bgColor: string;
}> = {
  ESSENCE: { 
    label: "Essence", 
    image: "/icons/vehicles/pompe-m.png",
    color: "text-red-600",
    bgColor: "bg-red-100"
  },
  DIESEL: { 
    label: "Diesel", 
    image: "/icons/vehicles/pompe-m.png",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  HYBRIDE: { 
    label: "Hybride", 
    image: "/icons/vehicles/pompe-m.png",
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  ELECTRIQUE: { 
    label: "Électrique", 
    image: "/icons/vehicles/carE.png",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100"
  },
};


// ==================== ICÔNES VÉHICULES ====================


export const vehicleConfig: Record<VehicleType, { 
  label: string; 
  icon: string; // Image path
  color: string;
  examples: string;
}> = {
  CITADINE: {
    label: "Citadine",
    icon: "/icons/vehicles/wagon-salon.png",
    color: "text-purple-600",
    examples: "Fiat 500, Toyota Aygo"
  },
  BERLINE: {
    label: "Berline",
    icon: "/icons/vehicles/berline-de-luxe.png",
    color: "text-blue-600",
    examples: "Toyota Corolla, BMW Série 3"
  },
  COMPACTE: {
    label: "Compacte",
    icon: "/icons/vehicles/voiture-compacte.png",
    color: "text-teal-600",
    examples: "Volkswagen Golf, Honda Civic"
  },
  SUV: {                    // ✅ AJOUTÉ
    label: "SUV / Crossover",
    icon: "/icons/vehicles/voiture-suv.png",
    color: "text-green-600",
    examples: "Nissan Qashqai, Toyota RAV4"
  },
  CABRIOLET: {
    label: "Cabriolet",
    icon: "/icons/vehicles/cabriolet.png",
    color: "text-orange-600",
    examples: "Mazda MX-5, BMW Z4"
  },
  MONOSPACE: {
    label: "Monospace",
    icon: "/icons/vehicles/monospace.png",
    color: "text-indigo-600",
    examples: "Renault Espace, VW Touran"
  },
  LUXE: {
    label: "Luxe",
    icon: "/icons/vehicles/lux.png",
    color: "text-yellow-600",
    examples: "Mercedes Classe S, Porsche"
  },
  VU_3M3: {
    label: "VU 3m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Utilitaire compact"
  },
  VU_6M3: {
    label: "VU 6m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Utilitaire moyen"
  },
  VU_9M3: {
    label: "VU 9m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Grand utilitaire"
  },
  VU_12M3: {
    label: "VU 12m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Très grand utilitaire"
  },
  VU_15M3: {
    label: "VU 15m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camionnette XL"
  },
  VU_20M3: {
    label: "VU 20m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camion léger"
  },
  VU_25M3: {
    label: "VU 25m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camion moyen"
  },
  VU_30M3: {
    label: "VU 30m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Grand camion"
  }
};


// ==================== HELPER FUNCTIONS ====================


/**
 * Récupère la config d'un type de carburant
 */
export const getCarburantConfig = (typeCarburant: string | undefined | null) => {
  if (!typeCarburant) {
    console.warn('⚠️ typeCarburant est undefined, utilisation de ESSENCE par défaut');
    return carburantConfig.ESSENCE;
  }
  
  const type = typeCarburant.toUpperCase() as VehiculeCarburant;
  return carburantConfig[type] || carburantConfig.ESSENCE;
};


/**
 * Récupère la config d'un type de véhicule
 */
export const getVehicleConfig = (typeVehicule: string | undefined | null) => {
  if (!typeVehicule) {
    console.warn('⚠️ typeVehicule est undefined, utilisation de BERLINE par défaut');
    return vehicleConfig.BERLINE;
  }
  
  const type = typeVehicule.toUpperCase() as VehicleType;
  return vehicleConfig[type] || vehicleConfig.BERLINE;
};
