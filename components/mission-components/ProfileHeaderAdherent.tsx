// app/components/adherent/ProfileHeader.tsx
'use client';

import { AdherentNavbarData } from "@/app/types/adherent";
import { apolloClient } from "@/lib/apollo-client";
import { GET_ADHERENT_NAVBAR } from "@/lib/graphql/queries/adherent";
import { Menu, X, Crown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { buildDocumentUrl } from "@/lib/api";

// ============================================
// CONFIGURATION DES TITRES PAR ROUTE
// ============================================
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/adherent/mission-page': {
    title: 'Liste des Missions',
    subtitle: 'Consultez toutes vos missions disponibles'
  },
  '/adherent/profile-adherent': {
    title: 'Mon Profil',
    subtitle: 'Gérez vos informations personnelles'
  }
};

const getPageTitle = (pathname: string) => {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes('/adherent/mission-reservation/')) {
    return { title: 'Mission de Transport', subtitle: 'Détails de la réservation' };
  }
  if (pathname.includes('/adherent/depart-mission/')) {
    return { title: 'Départ de la Mission', subtitle: 'Validation requise avant le démarrage' };
  }
  return null;
};

const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const obtenirInitiales = (prenom?: string, nom?: string): string => {
  const initPrenom = prenom?.charAt(0).toUpperCase() || "";
  const initNom = nom?.charAt(0).toUpperCase() || "";
  return initPrenom && initNom ? `${initPrenom}${initNom}` : "??";
};

// ============================================
// PROFILE HEADER COMPONENT
// ============================================
interface ProfileHeaderProps {
  isMobileMenuOpen: boolean;
  isDesktopMenuOpen: boolean;
  toggleMobileMenu: () => void;
  toggleDesktopMenu: () => void;
}

export default function ProfileHeader({
  isMobileMenuOpen,
  isDesktopMenuOpen,
  toggleMobileMenu,
  toggleDesktopMenu
}: ProfileHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<AdherentNavbarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
const showNavbar = pathname.startsWith('/adherent'); // ✅





  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Fetcher les données avec apolloClient.query()
  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apolloClient.query<AdherentNavbarData>({
          query: GET_ADHERENT_NAVBAR,
          fetchPolicy: 'network-only', // ✅ Corrigé
        });
        
        // ✅ Vérifier que data existe avant de set
        if (result.data) {
          setData(result.data);
        }
        setError(null);
      } catch (err: any) {
        console.error('❌ Apollo Error:', err.message);
        if (err.networkError) console.error('❌ Network Error:', err.networkError);
        if (err.graphQLErrors?.length) console.error('❌ GraphQL Errors:', err.graphQLErrors);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClient]);

  // ✅ Construire l'URL complète pour la photo
  const photoUrl = data?.adherentMe?.photo ? buildDocumentUrl(data.adherentMe.photo) : null;

  // ✅ Données de l'adhérent
  const adherent = {
    nom: data?.adherentMe?.nom || '',
    prenom: data?.adherentMe?.prenom || '',
    email: data?.adherentMe?.email || '',
    photo: photoUrl,
    pack: data?.adherentMe?.typePack || 'basique',
  };

  const nomComplet = `${adherent.prenom} ${adherent.nom}`.trim();
  
if (!showNavbar) return null; // ✅ avant le return JSX

  // ✅ Skeleton pendant le chargement
  if (loading || !data) {
    return (
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="h-5 w-32 bg-slate-700 rounded animate-pulse mb-1"></div>
                <div className="h-4 w-48 bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ✅ Erreur GraphQL
  if (error || !data?.adherentMe) {
    return (
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 text-lg font-semibold mb-2">❌ Erreur de chargement</p>
              <p className="text-gray-400 text-sm">Impossible de récupérer vos informations</p>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-700 ease-out pointer-events-none print:hidden ${
          isMobileMenuOpen || isDesktopMenuOpen ? 'opacity-70 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => {
          if (isMobileMenuOpen) toggleMobileMenu();
          if (isDesktopMenuOpen) toggleDesktopMenu();
        }}
      />

      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000] print:hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-3">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 sm:p-2.5 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Menu Mobile"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`w-full h-full absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} />
                  <X className={`w-full h-full absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} />
                </div>
              </button>

              <button
                onClick={toggleDesktopMenu}
                className="hidden md:block text-white p-3 md:p-3.5 lg:p-4 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Menu Desktop"
              >
                <div className="relative w-7 h-7">
                  <Menu className={`w-7 h-7 absolute transition-all duration-300 ${
                    isDesktopMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} />
                  <X className={`w-7 h-7 absolute transition-all duration-300 ${
                    isDesktopMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} />
                </div>
              </button>

              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

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

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              <div className="text-right max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-none">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight truncate">
                  {truncateText(nomComplet, 20)}
                </h2>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base text-orange-400 font-medium leading-tight truncate">
                  {truncateText(adherent.email, 25)}
                </p>
              </div>

              <div className="relative flex-shrink-0">
                {adherent.photo ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 overflow-hidden shadow-lg">
                    <Image
                      src={adherent.photo}
                      alt={nomComplet}
                      width={100}
                      height={100}
                      priority
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error('❌ Erreur chargement image:', adherent.photo);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                      {obtenirInitiales(adherent.prenom, adherent.nom)}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-slate-800 rounded-full"></div>
              </div>

              <div className="flex flex-col gap-1">
                {adherent.pack === 'basique' && (
                  <button className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Devenir Premium</span>
                  </button>
                )}

                {adherent.pack === 'premium' && (
                  <div className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full font-bold shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap border-2 border-yellow-300">
                    <span className="text-base sm:text-lg md:text-xl">⭐</span>
                    <span>Premium</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>
    </>
  );
}
