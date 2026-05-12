// app/config/mission-icons.config.ts
// ✅ CORRIGÉ : icônes carburant différenciées + logs de debug

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

// ✅ CORRIGÉ : clés en MAJUSCULES anglais, correspondant exactement au backend
export type VehiculeCarburant = "ESSENCE" | "DIESEL" | "HYBRIDE" | "ELECTRIQUE";

// ==================== FUEL CONFIGURATION ====================

interface CarburantConfig {
  label: string;
  image: string;
  color: string;
  bgColor: string;
  description: string;
}

// ✅ CORRIGÉ : chaque carburant a sa propre icône distincte
export const carburantConfig: Record<VehiculeCarburant, CarburantConfig> = {
  ESSENCE: {
    label: "Essence",
    image: "/icons/vehicles/pompe-m.png",   // icône pompe rouge
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Carburant essence",
  },
  DIESEL: {
    label: "Diesel",
    image: "/icons/vehicles/pompe.png",     // ✅ icône pompe bleue (différente d'essence)
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Carburant diesel",
  },
  HYBRIDE: {
    label: "Hybride",
    image: "/icons/vehicles/electriqueCar.png", // ✅ icône hybride verte
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Carburant hybride",
  },
  ELECTRIQUE: {
    label: "Électrique",
    image: "/icons/vehicles/carE.png",      // icône électrique jaune (inchangée)
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "Véhicule électrique",
  },
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
  CITADINE: {
    label: "Citadine",
    icon: "/icons/vehicles/wagon-salon.png",
    color: "text-purple-600",
    examples: "Fiat 500, Toyota Aygo",
    capacity: "1-5 places",
  },
  BERLINE: {
    label: "Berline",
    icon: "/icons/vehicles/berline-de-luxe.png",
    color: "text-blue-600",
    examples: "Toyota Corolla, BMW Série 3",
    capacity: "1-5 places",
  },
  COMPACTE: {
    label: "Compacte",
    icon: "/icons/vehicles/voiture-compacte.png",
    color: "text-teal-600",
    examples: "Volkswagen Golf, Honda Civic",
    capacity: "1-5 places",
  },
  CABRIOLET: {
    label: "Cabriolet",
    icon: "/icons/vehicles/cabriolet.png",
    color: "text-orange-600",
    examples: "Mazda MX-5, BMW Z4",
    capacity: "2-5 places",
  },
  MONOSPACE: {
    label: "Monospace",
    icon: "/icons/vehicles/monospace.png",
    color: "text-indigo-600",
    examples: "Renault Espace, VW Touran",
    capacity: "5-7 places",
  },
  LUXE: {
    label: "Luxe",
    icon: "/icons/vehicles/lux.png",        // ✅ icône spécifique luxe
    color: "text-yellow-600",
    examples: "Mercedes Classe S, Porsche",
    capacity: "1-5 places",
  },
  VU_3M3: {
    label: "VU 3m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Utilitaire compact",
    capacity: "3 m³",
  },
  VU_6M3: {
    label: "VU 6m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Utilitaire moyen",
    capacity: "6 m³",
  },
  VU_9M3: {
    label: "VU 9m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Grand utilitaire",
    capacity: "9 m³",
  },
  VU_12M3: {
    label: "VU 12m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Très grand utilitaire",
    capacity: "12 m³",
  },
  VU_15M3: {
    label: "VU 15m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camionnette XL",
    capacity: "15 m³",
  },
  VU_20M3: {
    label: "VU 20m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camion léger",
    capacity: "20 m³",
  },
  VU_25M3: {
    label: "VU 25m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Camion moyen",
    capacity: "25 m³",
  },
  VU_30M3: {
    label: "VU 30m³",
    icon: "/icons/vehicles/camionette.png",
    color: "text-gray-600",
    examples: "Grand camion",
    capacity: "30 m³",
  },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Récupère la config d'un type de carburant
 * ✅ CORRIGÉ : normalisation + logs détaillés pour debug
 */
export const getCarburantConfig = (
  typeCarburant: string | undefined | null
): CarburantConfig => {
  if (!typeCarburant) {
    console.warn("⚠️ getCarburantConfig: typeCarburant est undefined/null → fallback ESSENCE");
    return carburantConfig.ESSENCE;
  }

  // ✅ Normalise en MAJUSCULES et supprime les accents éventuels
  const normalized = typeCarburant
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // supprime les accents (ex: ÉLECTRIQUE → ELECTRIQUE)

  const config = carburantConfig[normalized as VehiculeCarburant];

  if (!config) {
    console.warn(
      `⚠️ getCarburantConfig: '${typeCarburant}' (normalisé: '${normalized}') non trouvé dans carburantConfig.`,
      `Clés disponibles: ${Object.keys(carburantConfig).join(", ")} → fallback ESSENCE`
    );
    return carburantConfig.ESSENCE;
  }

  return config;
};

/**
 * Récupère la config d'un type de véhicule
 * ✅ CORRIGÉ : normalisation + logs détaillés pour debug
 */
export const getVehicleConfig = (
  typeVehicule: string | undefined | null
): VehicleConfig => {
  if (!typeVehicule) {
    console.warn("⚠️ getVehicleConfig: typeVehicule est undefined/null → fallback BERLINE");
    return vehicleConfig.BERLINE;
  }

  // ✅ Normalise en MAJUSCULES (sécurité si le backend envoie en minuscules)
  const normalized = typeVehicule.toUpperCase() as VehicleType;
  const config = vehicleConfig[normalized];

  if (!config) {
    console.warn(
      `⚠️ getVehicleConfig: '${typeVehicule}' (normalisé: '${normalized}') non trouvé dans vehicleConfig.`,
      `Clés disponibles: ${Object.keys(vehicleConfig).join(", ")} → fallback BERLINE`
    );
    return vehicleConfig.BERLINE;
  }

  return config;
};

export const getAllVehicleTypes = (): VehicleType[] =>
  Object.keys(vehicleConfig) as VehicleType[];

export const getAllCarburantTypes = (): VehiculeCarburant[] =>
  Object.keys(carburantConfig) as VehiculeCarburant[];

export const isValidVehicleType = (type: string): type is VehicleType =>
  type in vehicleConfig;

export const isValidCarburantType = (type: string): type is VehiculeCarburant =>
  type in carburantConfig;