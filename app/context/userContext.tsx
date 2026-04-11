// app/context/userContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdherentNavbarData } from '../types/adherent';
import { PartenaireNavbarData } from '../types/partenaire';

// ✅ AJOUTER LE MODE DEBUG
const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

const log = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// ✅ Type unifié pour adhérent ET partenaire
export interface CurrentUser {
  // Commun
  email: string;
  role: 'adherent' | 'partenaire' | null;
  
  // Spécifique adhérent
  nom?: string;
  prenom?: string;
  photoPersonnelle?: string | null;
  pack?: "basique" | "premium";
  
  // Spécifique partenaire
  entite?: string;
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
  const [hasChecked, setHasChecked] = useState(false);

  // ✅ Fonction de chargement réutilisable
  const loadUserData = async () => {
    log("🟢 UserContext: Chargement des données...");
    
    try {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') as 'adherent' | 'partenaire' | null;

      log("🔑 Token présent:", !!token);
      if (token) {
        log("🔑 Token (20 premiers chars):", token.substring(0, 20) + "...");
      }
      log("👤 Role:", role);

      if (!token || !role) {
        log("⚠️ Pas de token ou role");
        setIsLoading(false);
        return;
      }

      let user: CurrentUser | null = null;

      // ✅ ADHÉRENT : GraphQL
      if (role === 'adherent') {
        log("📡 Fetch GraphQL adherentMe...");
        log("🌐 URL:", "/api/graphql");
        
        const res = await fetch("/api/graphql", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query AdherentMe {
                adherentMe {
                  nom
                  prenom
                  email
                  photo
                  typePack
                }
              }
            `
          }),
          cache: "no-store"
        });

        log("📥 Status adherent:", res.status);
        log("📥 Status text:", res.statusText);

        if (res.ok) {
          const result: { data?: AdherentNavbarData; errors?: any[] } = await res.json();
          log("✅ Result adherent (stringified):", JSON.stringify(result, null, 2));
          
          if (result.data?.adherentMe) {
            const profil = result.data.adherentMe;
            
            let packValue: "basique" | "premium" = "basique";
            if (profil.typePack === "premium") packValue = "premium";
            
            user = {
              role: 'adherent',
              nom: profil.nom,
              prenom: profil.prenom,
              email: profil.email,
              photoPersonnelle: profil.photo,
              pack: packValue,
            };
            log("✅ User adhérent créé:", user);
          } else if (result.errors) {
            console.error("❌ Erreurs GraphQL:"); // ✅ Garder console.error
            result.errors.forEach((error: any, index: number) => {
              console.error(`\n--- Erreur GraphQL ${index + 1} ---`);
              console.error("Message:", error.message);
              console.error("Extensions:", error.extensions);
              console.error("Path:", error.path);
              console.error("Locations:", error.locations);
            });
            
            const authError = result.errors.find(
              (err: any) => 
                err.extensions?.code === 'UNAUTHENTICATED' || 
                err.message?.toLowerCase().includes('unauthorized') ||
                err.message?.toLowerCase().includes('non autorisé')
            );
            
            if (authError) {
              console.warn("⚠️ Erreur d'authentification, nettoyage..."); // ✅ Garder console.warn
              localStorage.clear();
            }
          }
        } else if (res.status === 401) {
          console.warn("⚠️ Token adherent invalide (401), nettoyage...");
          localStorage.clear();
        } else {
          const errorText = await res.text();
          console.error("❌ Erreur HTTP adherent:", res.status, errorText);
        }
      } 
      
      // ✅ PARTENAIRE : GraphQL
      else if (role === 'partenaire') {
        log("📡 Fetch GraphQL partenaireNavbar...");
        log("🌐 URL:", "/api/graphql");
        
        const res = await fetch("/api/graphql", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query PartenaireNavbar {
                partenaireNavbar {
                  entite
                  email
                }
              }
            `
          }),
          cache: "no-store"
        });

        log("📥 Status partenaire:", res.status);
        log("📥 Status text:", res.statusText);

        if (res.ok) {
          const result: { data?: PartenaireNavbarData; errors?: any[] } = await res.json();
          log("✅ Result partenaire (stringified):", JSON.stringify(result, null, 2));
          
          if (result.data?.partenaireNavbar) {
            const profil = result.data.partenaireNavbar;
            
            user = {
              role: 'partenaire',
              entite: profil.entite,
              email: profil.email,
            };
            log("✅ User partenaire créé:", user);
          } else if (result.errors) {
            console.error("❌ Erreurs GraphQL:");
            result.errors.forEach((error: any, index: number) => {
              console.error(`\n--- Erreur GraphQL ${index + 1} ---`);
              console.error("Message:", error.message);
              console.error("Extensions:", error.extensions);
              console.error("Path:", error.path);
              console.error("Locations:", error.locations);
            });
            
            const authError = result.errors.find(
              (err: any) => 
                err.extensions?.code === 'UNAUTHENTICATED' || 
                err.message?.toLowerCase().includes('unauthorized') ||
                err.message?.toLowerCase().includes('non autorisé')
            );
            
            if (authError) {
              console.warn("⚠️ Erreur d'authentification, nettoyage...");
              localStorage.clear();
            }
          }
        } else if (res.status === 401) {
          console.warn("⚠️ Token partenaire invalide (401), nettoyage...");
          localStorage.clear();
        } else {
          const errorText = await res.text();
          console.error("❌ Erreur HTTP partenaire:", res.status, errorText);
        }
      }

      if (user) {
        log("✅ User final:", user);
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        log("⚠️ Aucun user créé");
        
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          log("📦 Fallback localStorage");
          try {
            const parsed = JSON.parse(savedUser);
            log("📦 User from localStorage:", parsed);
            setCurrentUser(parsed);
          } catch (e) {
            console.error("❌ Erreur parse localStorage:", e);
            localStorage.removeItem('currentUser');
          }
        }
      }

    } catch (error: any) {
      console.error("❌ Exception dans loadUserData:");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      
      if (error.message?.includes('fetch failed') || 
          error.message?.includes('Failed to fetch') ||
          error.cause?.code === 'ECONNREFUSED') {
        console.error("🔴 Erreur réseau: Impossible de contacter /api/graphql");
        console.error("🔴 Vérifiez que Next.js est bien démarré");
      }
      
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        log("📦 Fallback localStorage (erreur réseau)");
        try {
          const parsed = JSON.parse(savedUser);
          log("📦 User from localStorage:", parsed);
          setCurrentUser(parsed);
        } catch (e) {
          console.error("❌ Erreur parse localStorage:", e);
          localStorage.removeItem('currentUser');
        }
      }
    } finally {
      log("🏁 setIsLoading(false)");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasChecked) return;
    log("🔵 useEffect: Premier chargement");
    loadUserData();
    setHasChecked(true);
  }, [hasChecked]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'role') {
        log("🔄 Changement localStorage détecté, rechargement...");
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateCurrentUser = (user: CurrentUser | null) => {
    log("🔄 updateCurrentUser appelé avec:", user);
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      log("🧹 Nettoyage complet du localStorage");
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  };

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
