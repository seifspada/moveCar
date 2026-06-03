// app/components/agent/ProfileHeader.tsx
'use client';

import { apolloClient } from "@/lib/apollo-client";
import { Menu, X, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { gql } from "@apollo/client";
import { AgentNavbarData } from "@/app/types/agent";
import { GET_AGENT_NAVBAR } from "@/lib/graphql/queries/agent";
import { buildDocumentUrl } from "@/lib/api";

// ============================================
// CONFIGURATION DES TITRES PAR ROUTE (AGENT)
// ============================================
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/agent/mission-page": {
    title: "Liste des Missions",
    subtitle: "Gérez toutes vos missions actives",
  },
  "/agent/profile-agent": {
    title: "Mon Profil",
    subtitle: "Gérez vos informations agent",
  },
};

const getPageTitle = (pathname: string) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes("/agent/mission-reservation/")) {
    return { title: "Mission de Transport", subtitle: "Détails de réservation agent" };
  }
  if (pathname.includes("/agent/depart-mission/")) {
    return { title: "Départ Mission", subtitle: "Validation départ mission" };
  }
  return null;
};


const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const obtenirInitiales = (prenom?: string, nom?: string): string => {
  const initPrenom = prenom?.charAt(0).toUpperCase() || "";
  const initNom = nom?.charAt(0).toUpperCase() || "";
  return initPrenom && initNom ? `${initPrenom}${initNom}` : "AG";
};

// Props
interface ProfileHeaderProps {
  isMobileMenuOpen: boolean;
  isDesktopMenuOpen: boolean;
  toggleMobileMenu: () => void;
  toggleDesktopMenu: () => void;
}

export default function ProfileHeaderAgent({
  isMobileMenuOpen,
  isDesktopMenuOpen,
  toggleMobileMenu,
  toggleDesktopMenu,
}: ProfileHeaderProps) {
   const pathname = usePathname();
  const showNavbar = pathname.startsWith('/agent'); // ✅ 1er
  const pageTitle = getPageTitle(pathname);
  
  const [isClient, setIsClient] = useState(false);  // ✅ Hooks après
  const [data, setData] = useState<AgentNavbarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch agentMe
  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apolloClient.query<AgentNavbarData>({
          query: GET_AGENT_NAVBAR,
          fetchPolicy: "network-only",
        });

       if (result.data) {
  console.log("🟢 Agent navbar data:", result.data);
  console.log("🖼️ agentMe.photo brut:", data?.agentMe?.photo);
console.log("🖼️ URL finale agent.photo:", photoUrl);
  setData(result.data);
}
        setError(null);
      } catch (err: any) {
  console.error("❌ Apollo Agent Error:", err.message);

  if (err.networkError && "result" in err.networkError) {
    console.error("❌ GraphQL result:", err.networkError.result);
  }

  setError(err);
} finally {
  setLoading(false);
}

    };

    fetchData();
  }, [isClient]);

  const photoUrl = data?.agentMe?.photo ? buildDocumentUrl(data.agentMe.photo) : null;

  const agent = {
    nom: data?.agentMe?.nom || "",
    prenom: data?.agentMe?.prenom || "",
    email: data?.agentMe?.email || "",
    photo: photoUrl,
  };

  const nomComplet = `${agent.prenom} ${agent.nom}`.trim();

  if (!showNavbar) return null;  // ✅ Ajout - cache sur les autres routes

  // Skeleton
  if (loading || !data) {
    return (
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-slate-700 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="h-5 w-32 bg-slate-700 rounded animate-pulse mb-1" />
                <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-slate-700 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Erreur
  if (error || !data?.agentMe) {
    return (
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 text-lg font-semibold mb-2">❌ Erreur agent</p>
              <p className="text-gray-400 text-sm">Impossible de charger profil agent</p>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-700 ease-out pointer-events-none ${
          isMobileMenuOpen || isDesktopMenuOpen ? "opacity-70 pointer-events-auto" : "opacity-0"
        }`}
        onClick={() => {
          if (isMobileMenuOpen) toggleMobileMenu();
          if (isDesktopMenuOpen) toggleDesktopMenu();
        }}
      />

      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-3">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
            {/* Menus + logo */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 sm:p-2.5 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`w-full h-full absolute transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    className={`w-full h-full absolute transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                    }`}
                  />
                </div>
              </button>
              <button
                onClick={toggleDesktopMenu}
                className="hidden md:block text-white p-3 md:p-3.5 lg:p-4 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
              >
                <div className="relative w-7 h-7">
                  <Menu
                    className={`w-7 h-7 absolute transition-all duration-300 ${
                      isDesktopMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                    }`}
                  />
                  <X
                    className={`w-7 h-7 absolute transition-all duration-300 ${
                      isDesktopMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                    }`}
                  />
                </div>
              </button>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

            {/* Titre page */}
            {pageTitle && (
              <div className="hidden lg:block border-l-4 border-orange-500 pl-4 xl:pl-8 mb-1">
                <h1 className="text-2xl xl:text-4xl font-bold text-white truncate max-w-xs xl:max-w-none">
                  {pageTitle.title}
                </h1>
                <p className="text-sm xl:text-base text-white mt-1 truncate max-w-xs xl:max-w-none">
                  {pageTitle.subtitle}
                </p>
              </div>
            )}

            {/* Profil agent */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              <div className="text-right max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-none">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight truncate">
                  {truncateText(nomComplet, 20)}
                </h2>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base text-orange-400 font-medium leading-tight truncate">
                  {truncateText(agent.email, 25)}
                </p>
              </div>

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {agent.photo ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 overflow-hidden shadow-lg">
                    <Image
                      src={agent.photo}
                      alt={nomComplet}
                      width={100}
                      height={100}
                      priority
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error("❌ Erreur image agent:", agent.photo);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                      {obtenirInitiales(agent.prenom, agent.nom)}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-slate-800 rounded-full" />
              </div>

              {/* Badge Agent */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full font-bold shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all duration-300">
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Agent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
