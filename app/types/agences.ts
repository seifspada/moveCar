// ─── Agence ───────────────────────────────────────────────────────────────────
export interface Agence {
  id: number;
  nom: string;
  adresse?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  telephone?: string | null;
  email?: string | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Agent ────────────────────────────────────────────────────────────────────
export interface Agent {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  email: string;
  telephone?: string | null;
  photo?: string | null;
  isActive: boolean;
  isProfileCompleted: boolean;
  profileTokenExpiresAt?: string | null;
  agenceId?: number | null;
  userId?: number | null;
  createdAt?: string;
}
// ─── Réponses API ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = null> {
  success: boolean;
  error?: string;
  message?: string;
  data?: T;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface ChangeAgentDto {
  email: string;
}
