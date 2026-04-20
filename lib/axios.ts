import axios from 'axios';

/**
 * ⚠️ IMPORTANT: This file is server-only (imported only by API routes).
 * It uses NEXT_PUBLIC_API_URL which should match the Vercel environment variable.
 * 
 * In production, requires:
 * NEXT_PUBLIC_API_URL=https://movecar-backend.onrender.com
 */

const BACKEND_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.BACKEND_API_URL ||
  'http://localhost:3001';

if (!BACKEND_URL || BACKEND_URL.includes('localhost')) {
  console.warn(
    '⚠️ BACKEND_URL is using localhost. Check if NEXT_PUBLIC_API_URL is set in environment variables.'
  );
}

export const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
