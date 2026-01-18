"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Adherent, adherents } from '../data/adherent';

interface UserContextType {
  currentUser: Adherent | null;
  setCurrentUser: (user: Adherent | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Simuler l'utilisateur connecté (id: 1 = Jean DUPONT)
  const [currentUser, setCurrentUser] = useState<Adherent | null>(
    adherents.find(a => a.id === 1) || null
  );

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
