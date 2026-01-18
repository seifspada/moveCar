import axios from 'axios';

// URL de votre API NestJS backend
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
