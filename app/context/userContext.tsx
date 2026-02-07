// app/context/userContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ✅ Type léger spécifique au context
export interface CurrentUser {
  nom: string;
  prenom: string;
  email: string;
  photoPersonnelle?: string | null;
  pack: "basique" | "premium";
}

interface UserContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      console.log("🟢 UserContext: Début chargement...");
      
      try {
        console.log("📡 Fetch /api/adherent/me...");
        const res = await fetch("/api/adherent/me", {
          cache: "no-store",
          credentials: "include"
        });

        console.log("📥 Status:", res.status);

        if (res.ok) {
          const profil = await res.json();
          console.log("✅ Profil reçu:", profil);
          
          // ✅ Mapper "basic" → "basique" pour le frontend
          let packValue: "basique" | "premium" = "basique";
          if (profil.typePack === "premium") {
            packValue = "premium";
          } else if (profil.typePack === "basic" || profil.typePack === "basique") {
            packValue = "basique";
          }
          
          const user: CurrentUser = {
            nom: profil.nom,
            prenom: profil.prenom,
            email: profil.email,
            photoPersonnelle: profil.photo,
            pack: packValue, // ✅ Utiliser la valeur mappée
          };
          
          console.log("✅ User construit:", user);
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          const errorText = await res.text();
          console.error("❌ Erreur:", res.status, errorText);
          
          // Fallback localStorage
          const savedUser = localStorage.getItem('currentUser');
          if (savedUser) {
            console.log("📦 Chargement localStorage");
            setCurrentUser(JSON.parse(savedUser));
          } else {
            console.warn("⚠️ Pas de user en localStorage");
          }
        }
      } catch (error) {
        console.error("❌ Exception fetch:", error);
        
        // Fallback localStorage en cas d'erreur réseau
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          console.log("📦 Fallback localStorage");
          setCurrentUser(JSON.parse(savedUser));
        }
      } finally {
        console.log("🏁 setIsLoading(false)");
        setIsLoading(false);
      }
    })();
  }, []);

  const updateCurrentUser = (user: CurrentUser | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // ✅ Loader pendant le chargement initial
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-[9999]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: updateCurrentUser, isLoading }}>
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
