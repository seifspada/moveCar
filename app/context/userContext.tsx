"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Adherent, adherents } from '../data/adherent';

interface UserContextType {
  currentUser: Adherent | null;
  setCurrentUser: (user: Adherent | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Adherent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger l'utilisateur depuis localStorage au montage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Utilisateur par défaut
      setCurrentUser(adherents.find(a => a.id === 1) || null);
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  const updateCurrentUser = (user: Adherent | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Éviter le rendu avant le chargement (hydration mismatch)
  if (!isLoaded) {
    return null;
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: updateCurrentUser }}>
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
