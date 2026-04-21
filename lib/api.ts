// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function trimSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function ensureLeadingSlash(value: string) {
  return value.startsWith('/') ? value : `/${value}`;
}

export function initializeApiConfig() {
  if (typeof window !== 'undefined') {
    console.log('[API] NEXT_PUBLIC_API_URL =', API_URL);
  }
}

export function buildDocumentUrl(path?: string | null): string {
  if (!path) return '';

  const clean = path.trim();
  if (!clean) return '';

  if (clean.startsWith('https://')) return clean;

  if (clean.startsWith('http://')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return clean.replace(/^http:\/\//i, 'https://');
    }
    return clean;
  }

  return `${trimSlash(API_URL)}${ensureLeadingSlash(clean)}`;
}

export { API_URL };