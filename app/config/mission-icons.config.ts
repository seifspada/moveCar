// app/config/mission-icons.config.ts

/**
 * ==================== VEHICLE AND FUEL ICON CONFIGURATION ====================
 * 
 * Maps backend vehicle types (UPPERCASE) to frontend icon paths and metadata.
 * Used by MissionCard to display vehicle and fuel icons.
 * 
 * IMPORTANT: Ensure all PNG files exist in /public/icons/vehicles/
 */

// ==================== TYPES ====================

export type VehicleType = 
  | "CITADINE" 
  | "BERLINE" 
  | "COMPACTE"
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

// ==================== FUEL CONFIGURATION ====================

interface CarburantConfig {
  label: string;
  image: string;
  color: string;
  bgColor: string;
  description: string;
}

export const carburantConfig: Record<VehiculeCarburant, CarburantConfig> = {
  ESSENCE: {
    label: "Essence",
    image: "/icons/vehicles/pompe-m.png",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Carburant essence"
  },
  DIESEL: {
    label: "Diesel",
    image: "/icons/vehicles/pompe-m.png",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Carburant diesel"
  },
  HYBRIDE: {
    label: "Hybride",
    image: "/icons/vehicles/pompe-m.png",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Carburant hybride"
  },
  ELECTRIQUE: {
    label: "Électrique",
    image: "/icons/vehicles/carE.png",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "Véhicule électrique"
  }
};

// ==================== VEHICLE CONFIGURATION ====================

interface VehicleConfig {
  label: string;
  icon: string;
  color: string;
  examples: string;
  capacity?: string;
}

export const vehicleConfig: Record<VehicleType, VehicleConfig> = {
  // Voitures particulières
  CITADINE: {
    label: "Citadine",
    icon: "/icons/vehicles/wagon-salon.png",
    color: "text-purple-600",
    examples: "Fiat 500, Toyota Aygo",
    capacity: "1-5 places"
  },
  BERLINE: {
    label: "Berline",
    icon: "/icons/vehicles/berline-de-luxe.png",
    color: "text-blue-600",
    examples: "Toyota Corolla, BMW Série 3",
    capacity: "1-5 places"
  },
  COMPACTE: {
    label: "Compacte",
    icon: "/icons/vehicles/voiture-compacte.png",
    color: "text-teal-600",
    examples: "Volkswagen Golf, Honda Civic",
    capacity: "1-5 places"
  },
  CABRIOLET: {
    label: "Cabriolet",
    icon: "/icons/vehicles/cabriolet.png",
    color: "text-orange-600",
    examples: "Mazda MX-5, BMW Z4",
    capacity: "2-5 places"
  },
  MONOSPACE: {
    label: "Monospace",
    icon: "/icons/vehicles/monospace.png",
    color: "text-indigo-600",
    examples: "Renault Espace, VW Touran",
    capacity: "5-7 places"
  },
  LUXE: {
    label: "Luxe",
    icon: "/icons/vehicles/lux.png",
    color: "text-yellow-600",
    examples: "Mercedes Classe S, Porsche",
    capacity: "1-5 places"
  },

  // Utilitaires (VU)
  VU_3M3: {
    label: "VU 3m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Utilitaire compact",
    capacity: "3 m³"
  },
  VU_6M3: {
    label: "VU 6m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Utilitaire moyen",
    capacity: "6 m³"
  },
  VU_9M3: {
    label: "VU 9m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Grand utilitaire",
    capacity: "9 m³"
  },
  VU_12M3: {
    label: "VU 12m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Très grand utilitaire",
    capacity: "12 m³"
  },
  VU_15M3: {
    label: "VU 15m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camionnette XL",
    capacity: "15 m³"
  },
  VU_20M3: {
    label: "VU 20m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camion léger",
    capacity: "20 m³"
  },
  VU_25M3: {
    label: "VU 25m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camion moyen",
    capacity: "25 m³"
  },
  VU_30M3: {
    label: "VU 30m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Grand camion",
    capacity: "30 m³"
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Récupère la config d'un type de carburant
 * @param typeCarburant - Type de carburant depuis le backend (UPPERCASE)
 * @returns Configuration du carburant avec image et label
 */
export const getCarburantConfig = (
  typeCarburant: string | undefined | null
): CarburantConfig => {
  if (!typeCarburant) {
    console.warn(
      '⚠️ typeCarburant est undefined, utilisation de ESSENCE par défaut'
    );
    return carburantConfig.ESSENCE;
  }

  const type = typeCarburant.toUpperCase() as VehiculeCarburant;
  const config = carburantConfig[type];

  if (!config) {
    console.warn(
      `⚠️ typeCarburant '${type}' non trouvé, utilisation de ESSENCE par défaut`
    );
    return carburantConfig.ESSENCE;
  }

  return config;
};

/**
 * Récupère la config d'un type de véhicule
 * @param typeVehicule - Type de véhicule depuis le backend (UPPERCASE)
 * @returns Configuration du véhicule avec icône et label
 */
export const getVehicleConfig = (
  typeVehicule: string | undefined | null
): VehicleConfig => {
  if (!typeVehicule) {
    console.warn(
      '⚠️ typeVehicule est undefined, utilisation de BERLINE par défaut'
    );
    return vehicleConfig.BERLINE;
  }

  const type = typeVehicule.toUpperCase() as VehicleType;
  const config = vehicleConfig[type];

  if (!config) {
    console.warn(
      `⚠️ typeVehicule '${type}' non trouvé, utilisation de BERLINE par défaut`
    );
    return vehicleConfig.BERLINE;
  }

  return config;
};

/**
 * Obtient tous les types de véhicules disponibles
 */
export const getAllVehicleTypes = (): VehicleType[] => {
  return Object.keys(vehicleConfig) as VehicleType[];
};

/**
 * Obtient tous les types de carburants disponibles
 */
export const getAllCarburantTypes = (): VehiculeCarburant[] => {
  return Object.keys(carburantConfig) as VehiculeCarburant[];
};

/**
 * Valide si un type de véhicule existe
 */
export const isValidVehicleType = (type: string): type is VehicleType => {
  return type in vehicleConfig;
};

/**
 * Valide si un type de carburant existe
 */
export const isValidCarburantType = (type: string): type is VehiculeCarburant => {
  return type in carburantConfig;
};