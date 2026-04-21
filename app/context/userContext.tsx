// app/context/userContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdherentNavbarData } from '../types/adherent';
import { PartenaireNavbarData } from '../types/partenaire';

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

const log = (...args: any[]) => {
  if (DEBUG_MODE) console.log(...args);
};

export interface CurrentUser {
  email: string;
  role: 'adherent' | 'partenaire' | 'agent' | 'admin' | null;
  photoPersonnelle?: string | null; // ✅ null pour admin

  // Adhérent
  nom?: string;
  prenom?: string;
  pack?: "basique" | "premium";

  // Partenaire
  entite?: string;

  // Agent / Admin
  nomComplet?: string;
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

  const loadUserData = async () => {
    log("🟢 UserContext: Chargement des données...");

    try {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role') as 'adherent' | 'partenaire' | 'agent' | 'admin' | null;

      log("🔑 Token présent:", !!token);
      if (token) log("🔑 Token (20 premiers chars):", token.substring(0, 20) + "...");
      log("👤 Role:", role);

      if (!token || !role) {
        log("⚠️ Pas de token ou role");
        setIsLoading(false);
        return;
      }

      let user: CurrentUser | null = null;

      // ─── ADHÉRENT ────────────────────────────────────────────────────────────
      if (role === 'adherent') {
        log("📡 Fetch GraphQL adherentMe...");

        const res = await fetch("/api/graphql", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            query: `
              query AdherentMe {
                adherentMe {
                  nom
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

        if (res.ok) {
          const result: { data?: AdherentNavbarData; errors?: any[] } = await res.json();
          log("✅ Result adherent:", JSON.stringify(result, null, 2));

          if (result.data?.adherentMe) {
            const profil = result.data.adherentMe;
            user = {
              role: 'adherent',
              nom: profil.nom,
              prenom: undefined,  // ✅ Backend no longer provides separate prenom
              email: profil.email,
              photoPersonnelle: profil.photo ?? null,
              pack: profil.typePack === "premium" ? "premium" : "basique",
            };
            log("✅ User adhérent créé:", user);
          } else if (result.errors) {
            console.error("❌ Erreurs GraphQL adherent:");
            result.errors.forEach((e: any, i: number) => {
              console.error(`--- Erreur ${i + 1} --- Message:`, e.message);
            });
            const authError = result.errors.find((e: any) =>
              e.extensions?.code === 'UNAUTHENTICATED' ||
              e.message?.toLowerCase().includes('unauthorized') ||
              e.message?.toLowerCase().includes('non autorisé')
            );
            if (authError) { console.warn("⚠️ Auth error adherent, nettoyage..."); localStorage.clear(); }
          }
        } else if (res.status === 401) {
          console.warn("⚠️ Token adherent invalide (401), nettoyage...");
          localStorage.clear();
        } else {
          console.error("❌ Erreur HTTP adherent:", res.status, await res.text());
        }
      }

      // ─── PARTENAIRE ──────────────────────────────────────────────────────────
      else if (role === 'partenaire') {
        log("📡 Fetch GraphQL partenaireNavbar...");

        const res = await fetch("/api/graphql", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            query: `
              query PartenaireNavbar {
                partenaireNavbar {
                  entite
                  email
                  photo
                }
              }
            `
          }),
          cache: "no-store"
        });

        log("📥 Status partenaire:", res.status);

        if (res.ok) {
          const result: { data?: PartenaireNavbarData; errors?: any[] } = await res.json();
          log("✅ Result partenaire:", JSON.stringify(result, null, 2));

          if (result.data?.partenaireNavbar) {
            const profil = result.data.partenaireNavbar;
            user = {
              role: 'partenaire',
              entite: profil.entite,
              email: profil.email,
              photoPersonnelle: profil.photo ?? null,
            };
            log("✅ User partenaire créé:", user);
          } else if (result.errors) {
            console.error("❌ Erreurs GraphQL partenaire:");
            result.errors.forEach((e: any, i: number) => {
              console.error(`--- Erreur ${i + 1} --- Message:`, e.message);
            });
            const authError = result.errors.find((e: any) =>
              e.extensions?.code === 'UNAUTHENTICATED' ||
              e.message?.toLowerCase().includes('unauthorized') ||
              e.message?.toLowerCase().includes('non autorisé')
            );
            if (authError) { console.warn("⚠️ Auth error partenaire, nettoyage..."); localStorage.clear(); }
          }
        } else if (res.status === 401) {
          console.warn("⚠️ Token partenaire invalide (401), nettoyage...");
          localStorage.clear();
        } else {
          console.error("❌ Erreur HTTP partenaire:", res.status, await res.text());
        }
      }

      // ─── AGENT ───────────────────────────────────────────────────────────────
      else if (role === 'agent') {
        log("📡 Fetch GraphQL agentMe...");

        const res = await fetch("/api/graphql", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            query: `
              query AgentMe {
                agentMe {
                  email
                  nom
                  photo
                }
              }
            `
          }),
          cache: "no-store"
        });

        log("📥 Status agent:", res.status);

        if (res.ok) {
          const result: { data?: any; errors?: any[] } = await res.json();
          log("✅ Result agent:", JSON.stringify(result, null, 2));

          if (result.data?.agentMe) {
            const profil = result.data.agentMe;
            user = {
              role: 'agent',
              email: profil.email,
              nom: profil.nom,
              prenom: undefined,  // ✅ Backend no longer provides separate prenom
              nomComplet: profil.nom,  // ✅ Use nom directly
              photoPersonnelle: profil.photo ?? null,
            };
            log("✅ User agent créé:", user);
          } else if (result.errors) {
            console.error("❌ Erreurs GraphQL agent:");
            result.errors.forEach((e: any, i: number) => {
              console.error(`--- Erreur ${i + 1} --- Message:`, e.message);
            });
            const authError = result.errors.find((e: any) =>
              e.extensions?.code === 'UNAUTHENTICATED' ||
              e.message?.toLowerCase().includes('unauthorized') ||
              e.message?.toLowerCase().includes('non autorisé')
            );
            if (authError) { console.warn("⚠️ Auth error agent, nettoyage..."); localStorage.clear(); }
          }
        } else if (res.status === 401) {
          console.warn("⚠️ Token agent invalide (401), nettoyage...");
          localStorage.clear();
        } else {
          console.error("❌ Erreur HTTP agent:", res.status, await res.text());
        }
      }

      // ─── ADMIN ───────────────────────────────────────────────────────────────
      else if (role === 'admin') {
        log("📡 Fetch GraphQL adminMe...");

        const res = await fetch("/api/graphql", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            query: `
              query AdminMe {
                adminMe {
                  email
                  nom
                }
              }
            `  // ✅ Pas de photo — AdminPublic ne l'expose pas
          }),
          cache: "no-store"
        });

        log("📥 Status admin:", res.status);

        if (res.ok) {
          const result: { data?: any; errors?: any[] } = await res.json();
          log("✅ Result admin:", JSON.stringify(result, null, 2));

          if (result.data?.adminMe) {
            const profil = result.data.adminMe;
            user = {
              role: 'admin',
              email: profil.email,
              nom: profil.nom,
              prenom: undefined,  // ✅ Backend no longer provides separate prenom
              nomComplet: profil.nom,  // ✅ Use nom directly
              photoPersonnelle: null, // ✅ Admin n'a pas de photo
            };
            log("✅ User admin créé:", user);
          } else if (result.errors) {
            console.error("❌ Erreurs GraphQL admin:");
            result.errors.forEach((e: any, i: number) => {
              console.error(`--- Erreur ${i + 1} --- Message:`, e.message);
            });
            const authError = result.errors.find((e: any) =>
              e.extensions?.code === 'UNAUTHENTICATED' ||
              e.message?.toLowerCase().includes('unauthorized') ||
              e.message?.toLowerCase().includes('non autorisé')
            );
            if (authError) { console.warn("⚠️ Auth error admin, nettoyage..."); localStorage.clear(); }
          }
        } else if (res.status === 401) {
          console.warn("⚠️ Token admin invalide (401), nettoyage...");
          localStorage.clear();
        } else {
          console.error("❌ Erreur HTTP admin:", res.status, await res.text());
        }
      }

      // ─── Résultat final ───────────────────────────────────────────────────────
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
            // ✅ Valider que l'objet est complet avant de l'utiliser
            if (parsed?.role && parsed?.email) {
              log("📦 User from localStorage:", parsed);
              setCurrentUser(parsed);
            } else {
              console.warn("⚠️ localStorage corrompu (objet incomplet), nettoyage...");
              localStorage.removeItem('currentUser');
            }
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

      if (
        error.message?.includes('fetch failed') ||
        error.message?.includes('Failed to fetch') ||
        error.cause?.code === 'ECONNREFUSED'
      ) {
        console.error("🔴 Erreur réseau: Impossible de contacter /api/graphql");
      }

      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        log("📦 Fallback localStorage (erreur réseau)");
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed?.role && parsed?.email) {
            log("📦 User from localStorage:", parsed);
            setCurrentUser(parsed);
          } else {
            localStorage.removeItem('currentUser');
          }
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