// utils/route-point-icons.ts
import { divIcon } from "leaflet";

export function buildRoutePointIcon(type: "departure" | "destination", size: "small" | "large" = "large") {
  const isDeparture = type === "departure";
  const color = isDeparture ? "#f97316" : "#10b981"; // Orange for departure, Green for arrival
  const label = isDeparture ? "D" : "A";
  const iconSize = size === "large" ? 44 : 36;
  const iconSizeNum = size === "large" ? 44 : 36;
  const baseY = size === "large" ? 20 : 17;

  // SVG avec symbole unifié
  const symbol = isDeparture
    ? `<path d="M16 28 V15 h9.5 c3 0 5 1.8 5 4.5s-2 4.5-5 4.5H16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<path d="M16 29 24 13l8 16M19 24h10" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  return divIcon({
    className: "route-point-marker",
    iconSize: [iconSizeNum, iconSize],
    iconAnchor: [iconSizeNum / 2, iconSize - 2],
    popupAnchor: [0, -(iconSize - 6)],
    html: `
<svg xmlns="http://www.w3.org/2000/svg" width="${iconSizeNum}" height="${iconSize}" viewBox="0 0 36 44">
  <defs>
    <filter id="route-icon-${type}-${size}">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>
  <!-- Pin teardrop shape -->
  <path d="M18 2 C9.7 2 3 8.7 3 17 c0 11 15 25 15 25s15-14 15-25C33 8.7 26.3 2 18 2Z"
    fill="#18181b" stroke="${color}" stroke-width="2.5" filter="url(#route-icon-${type}-${size})"/>
  <!-- Circle background -->
  <circle cx="18" cy="${baseY}" r="11" fill="${color}"/>
  <!-- Symbol -->
  ${symbol}
  <!-- Label letter -->
  <text x="18" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="white">${label}</text>
</svg>`.trim(),
  });
}

/**
 * Crée un marqueur de cercle simple pour ville de départ/arrivée
 * utilisé dans les listes ou les connexions visuelles
 */
export function buildCityMarkerIcon(type: "departure" | "destination", size: number = 20) {
  const isDeparture = type === "departure";
  const color = isDeparture ? "#f97316" : "#10b981";
  const bgColor = isDeparture ? "rgb(254, 243, 235)" : "rgb(236, 253, 245)";

  return divIcon({
    className: "city-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 20 20">
  <circle cx="10" cy="10" r="9" fill="${bgColor}" stroke="${color}" stroke-width="2"/>
  <circle cx="10" cy="10" r="5" fill="${color}"/>
</svg>`.trim(),
  });
}

/**
 * Options de polyline pour le trajet
 */
export const RouteLineStyles = {
  departure: {
    color: "#f97316",
    weight: 5,
    opacity: 0.8,
    dashArray: undefined,
    lineJoin: "round" as const,
    lineCap: "round" as const,
  },
  directEstimate: {
    color: "#f97316",
    weight: 5,
    opacity: 0.5,
    dashArray: "10, 10",
    lineJoin: "round" as const,
    lineCap: "round" as const,
  },
  pastTrack: {
    color: "#3b82f6",
    weight: 3,
    opacity: 0.75,
    lineJoin: "round" as const,
    lineCap: "round" as const,
  },
  remainingTrack: {
    color: "#ea580c",
    weight: 3,
    opacity: 0.8,
    dashArray: "8 6",
    lineJoin: "round" as const,
    lineCap: "round" as const,
  },
};