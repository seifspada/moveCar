export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  roleId: number;
}


// lib/types.ts
export interface LoginDto {
  email: string;
  password: string;
}

// ✅ Interface pour la réponse du backend NestJS (avec role objet)
export interface AuthResponse {
  accessToken: string; // ✅ Votre backend utilise accessToken
  user: {
    id: number;
    name: string;
    email: string;
    roleId: number;
    role: {
      id: number;
      name: string; // ✅ "adherent", "partenaire", "admin", "manager"
    };
  };
}
