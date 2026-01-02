const cityCoordinates: Record<string, [number, number]> = {
  // France
  "Paris": [48.8566, 2.3522],
  "Lyon": [45.7640, 4.8357],
  "Marseille": [43.2965, 5.3698],
  "Nice": [43.7102, 7.2620],
  "Lille": [50.6292, 3.0573],
  "Bordeaux": [44.8378, -0.5792],
  "Toulouse": [43.6047, 1.4442],
  "Strasbourg": [48.5734, 7.7521],
  "Metz": [49.1193, 6.1757],
  "Nantes": [47.2184, -1.5536],
  "Rennes": [48.1173, -1.6778],
  "Montpellier": [43.6108, 3.8767],
  "Grenoble": [45.1885, 5.7245],
  "Dijon": [47.3220, 5.0415],
  "Reims": [49.2583, 4.0317],
  "Le Havre": [49.4944, 0.1079],
  "Saint-Étienne": [45.4397, 4.3872],
  "Toulon": [43.1242, 5.9280],
  "Angers": [47.4784, -0.5632],
  "Brest": [48.3904, -4.4861],
  
  // Belgique
  "Bruxelles": [50.8503, 4.3517],
  "Anvers": [51.2194, 4.4025],
  "Gand": [51.0543, 3.7174],
  "Liège": [50.6326, 5.5797],
  
  // Luxembourg
  "Luxembourg": [49.6116, 6.1319],
  
  // Suisse
  "Genève": [46.2044, 6.1432],
  "Zurich": [47.3769, 8.5417],
  "Berne": [46.9480, 7.4474],
  "Lausanne": [46.5197, 6.6323]
};

export default cityCoordinates;
export function getCityCoordinates(cityName: string): [number, number] | null {
  return cityCoordinates[cityName] || null;
}

