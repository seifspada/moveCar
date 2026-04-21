let API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
let configInitialized = false;

export async function initializeApiConfig() {
  if (configInitialized) return;
  try {
    const response = await fetch(`${API_BASE}/config`);
    if (response.ok) {
      const config = await response.json();
      API_BASE = config.apiBase;
      console.log('✅ API_BASE initialized:', API_BASE);
    }
  } catch (error) {
    console.warn('⚠️ Failed to fetch config, using default:', error);
  }
  configInitialized = true;
}

export function getApiBase() {
  return API_BASE;
}

export function buildDocumentUrl(cheminFichier: string): string {
  if (!cheminFichier) return '';
  if (cheminFichier.startsWith('http')) return cheminFichier;
  return `${API_BASE}${cheminFichier}`;
}
