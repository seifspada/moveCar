// app/data/cities.ts
/*
import { City } from "@/app/types/search";

// Liste des principales villes françaises avec coordonnées GPS
export const frenchCities: City[] = [
  { name: "Paris", coordinates: { lat: 48.8566, lng: 2.3522 }, postalCode: "75000" },
  { name: "Marseille", coordinates: { lat: 43.2965, lng: 5.3698 }, postalCode: "13000" },
  { name: "Lyon", coordinates: { lat: 45.7640, lng: 4.8357 }, postalCode: "69000" },
  { name: "Toulouse", coordinates: { lat: 43.6047, lng: 1.4442 }, postalCode: "31000" },
  { name: "Nice", coordinates: { lat: 43.7102, lng: 7.2620 }, postalCode: "06000" },
  { name: "Nantes", coordinates: { lat: 47.2184, lng: -1.5536 }, postalCode: "44000" },
  { name: "Montpellier", coordinates: { lat: 43.6108, lng: 3.8767 }, postalCode: "34000" },
  { name: "Strasbourg", coordinates: { lat: 48.5734, lng: 7.7521 }, postalCode: "67000" },
  { name: "Bordeaux", coordinates: { lat: 44.8378, lng: -0.5792 }, postalCode: "33000" },
  { name: "Lille", coordinates: { lat: 50.6292, lng: 3.0573 }, postalCode: "59000" },
  { name: "Rennes", coordinates: { lat: 48.1173, lng: -1.6778 }, postalCode: "35000" },
  { name: "Reims", coordinates: { lat: 49.2583, lng: 4.0317 }, postalCode: "51100" },
  { name: "Le Havre", coordinates: { lat: 49.4944, lng: 0.1079 }, postalCode: "76600" },
  { name: "Saint-Étienne", coordinates: { lat: 45.4397, lng: 4.3872 }, postalCode: "42000" },
  { name: "Toulon", coordinates: { lat: 43.1242, lng: 5.9280 }, postalCode: "83000" },
  { name: "Grenoble", coordinates: { lat: 45.1885, lng: 5.7245 }, postalCode: "38000" },
  { name: "Dijon", coordinates: { lat: 47.3220, lng: 5.0415 }, postalCode: "21000" },
  { name: "Angers", coordinates: { lat: 47.4784, lng: -0.5632 }, postalCode: "49000" },
  { name: "Nîmes", coordinates: { lat: 43.8367, lng: 4.3601 }, postalCode: "30000" },
  { name: "Villeurbanne", coordinates: { lat: 45.7667, lng: 4.8800 }, postalCode: "69100" },
  { name: "Le Mans", coordinates: { lat: 48.0077, lng: 0.1984 }, postalCode: "72000" },
  { name: "Aix-en-Provence", coordinates: { lat: 43.5297, lng: 5.4474 }, postalCode: "13100" },
  { name: "Clermont-Ferrand", coordinates: { lat: 45.7772, lng: 3.0870 }, postalCode: "63000" },
  { name: "Brest", coordinates: { lat: 48.3904, lng: -4.4861 }, postalCode: "29200" },
  { name: "Tours", coordinates: { lat: 47.3941, lng: 0.6848 }, postalCode: "37000" },
  { name: "Limoges", coordinates: { lat: 45.8336, lng: 1.2611 }, postalCode: "87000" },
  { name: "Amiens", coordinates: { lat: 49.8942, lng: 2.2957 }, postalCode: "80000" },
  { name: "Perpignan", coordinates: { lat: 42.6886, lng: 2.8948 }, postalCode: "66000" },
  { name: "Metz", coordinates: { lat: 49.1193, lng: 6.1757 }, postalCode: "57000" },
  { name: "Besançon", coordinates: { lat: 47.2380, lng: 6.0243 }, postalCode: "25000" },
  { name: "Boulogne-Billancourt", coordinates: { lat: 48.8351, lng: 2.2398 }, postalCode: "92100" },
  { name: "Orléans", coordinates: { lat: 47.9029, lng: 1.9093 }, postalCode: "45000" },
  { name: "Mulhouse", coordinates: { lat: 47.7508, lng: 7.3359 }, postalCode: "68100" },
  { name: "Rouen", coordinates: { lat: 49.4431, lng: 1.0993 }, postalCode: "76000" },
  { name: "Caen", coordinates: { lat: 49.1829, lng: -0.3707 }, postalCode: "14000" },
  { name: "Nancy", coordinates: { lat: 48.6921, lng: 6.1844 }, postalCode: "54000" },
  { name: "Argenteuil", coordinates: { lat: 48.9472, lng: 2.2469 }, postalCode: "95100" },
  { name: "Montreuil", coordinates: { lat: 48.8634, lng: 2.4411 }, postalCode: "93100" },
  { name: "Saint-Denis", coordinates: { lat: 48.9362, lng: 2.3574 }, postalCode: "93200" },
  { name: "Roubaix", coordinates: { lat: 50.6942, lng: 3.1746 }, postalCode: "59100" }
];

// Fonction utilitaire pour rechercher une ville
export function searchCities(query: string, limit: number = 5): City[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return frenchCities
    .filter(city => city.name.toLowerCase().includes(lowerQuery))
    .slice(0, limit);
}*/