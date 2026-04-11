// app/utils/format.ts

/**
 * Formate un nombre en prix avec 2 décimales
 * @param value - Valeur à formater (number, string, ou undefined)
 * @returns String formaté avec 2 décimales (ex: "42.50")
 */
export const formatPrice = (value: any): string => {
  const num = typeof value === 'number' ? value : parseFloat(String(value || 0));
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

/**
 * Convertit une valeur en nombre
 * @param value - Valeur à convertir
 * @param defaultValue - Valeur par défaut si conversion échoue
 * @returns Nombre converti ou valeur par défaut
 */
export const toNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};

/**
 * Formate une plage de dates
 * @param dateDebut - Date de début (ISO string ou Date)
 * @param dateFin - Date de fin (ISO string ou Date)
 * @returns String formaté "DD/MM/YYYY - DD/MM/YYYY"
 */
export const formatDateRange = (dateDebut: any, dateFin: any): string => {
  if (!dateDebut || !dateFin) return 'Date non disponible';
  
  try {
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    
    if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
      return 'Date invalide';
    }
    
    return `${debut.toLocaleDateString('fr-FR')} - ${fin.toLocaleDateString('fr-FR')}`;
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Vérifie si une valeur est définie et non nulle
 */
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};
