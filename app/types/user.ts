export interface Role {
  id: number;
  name: 'admin' | 'adherent' | 'partenaire' | 'agent';
}

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export type UsersResponse = User[];