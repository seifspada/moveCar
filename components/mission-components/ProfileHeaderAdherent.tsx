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
  const showNavbar = pathname.startsWith('/adherent');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apolloClient.query<AdherentNavbarData>({
          query: GET_ADHERENT_NAVBAR,
          fetchPolicy: 'network-only',
        });
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

  const photoUrl = data?.adherentMe?.photo ? buildDocumentUrl(data.adherentMe.photo) : null;

  const adherent = {
    nom: data?.adherentMe?.nom || '',
    prenom: data?.adherentMe?.prenom || '',
    email: data?.adherentMe?.email || '',
    photo: photoUrl,
    pack: data?.adherentMe?.typePack || 'basique',
  };

  const nomComplet = `${adherent.prenom} ${adherent.nom}`.trim();

  if (!showNavbar) return null;

  // ✅ Skeleton pendant le chargement
  if (loading || !data) {
    return (
      <header
        className="w-full sticky top-0 z-[2000]"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full animate-pulse"
                style={{ background: 'rgba(255,255,255,0.07)' }}></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="h-5 w-32 rounded animate-pulse mb-1" style={{ background: 'rgba(255,255,255,0.07)' }}></div>
                <div className="h-4 w-48 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }}></div>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full animate-pulse"
                style={{ background: 'rgba(255,255,255,0.07)' }}></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ✅ Erreur GraphQL
  if (error || !data?.adherentMe) {
    return (
      <header
        className="w-full sticky top-0 z-[2000]"
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 text-lg font-semibold mb-2">❌ Erreur de chargement</p>
              <p className="text-gray-500 text-sm">Impossible de récupérer vos informations</p>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-700 ease-out pointer-events-none print:hidden ${
          isMobileMenuOpen || isDesktopMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={() => {
          if (isMobileMenuOpen) toggleMobileMenu();
          if (isDesktopMenuOpen) toggleDesktopMenu();
        }}
      />

      {/* ── HEADER ── */}
      <header
        className="w-full sticky top-0 z-[2000] print:hidden"
        style={{
          background: 'rgba(5, 5, 8, 0.60)',
          backdropFilter: 'blur(24px) saturate(200%) brightness(0.85)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow:
            '0 4px 6px -1px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Subtle top-edge reflection line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent)',
          }}
        />

        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-3">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">

            {/* ── LEFT: menu toggle + logo ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              {/* Mobile toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 sm:p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
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

              {/* Desktop toggle */}
              <button
                onClick={toggleDesktopMenu}
                className="hidden md:block text-white p-3 md:p-3.5 lg:p-4 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
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

              {/* Logo */}
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden flex-shrink-0"
                style={{
                  border: '2px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
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

            {/* ── CENTER: page title ── */}
            {pageTitle && (
              <div
                className="hidden lg:block pl-4 xl:pl-8 mb-1"
                style={{ borderLeft: '3px solid rgba(255,255,255,0.25)' }}
              >
                <h1 className="text-2xl xl:text-4xl font-bold text-white truncate max-w-xs xl:max-w-none"
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                  {pageTitle.title}
                </h1>
                <p className="text-sm xl:text-base mt-1 truncate max-w-xs xl:max-w-none"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {pageTitle.subtitle}
                </p>
              </div>
            )}

            {/* ── RIGHT: user info + avatar + pack ── */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              <div className="text-right max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-none">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight truncate"
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>
                  {truncateText(nomComplet, 20)}
                </h2>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base font-medium leading-tight truncate"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {truncateText(adherent.email, 25)}
                </p>
              </div>

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {adherent.photo ? (
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden"
                    style={{
                      border: '2px solid rgba(255,255,255,0.18)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.6)',
                    }}
                  >
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
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '2px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.6)',
                    }}
                  >
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                      {obtenirInitiales(adherent.prenom, adherent.nom)}
                    </span>
                  </div>
                )}
                {/* Online dot */}
                <div
                  className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full"
                  style={{
                    background: '#22c55e',
                    border: '2px solid rgba(0,0,0,0.7)',
                    boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                  }}
                />
              </div>

              {/* Pack badge */}
              <div className="flex flex-col gap-1">
                {adherent.pack === 'basique' && (
                  <button
                    className="flex items-center gap-1 sm:gap-1.5 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, rgba(234,179,8,0.9), rgba(202,138,4,0.9))',
                      border: '1px solid rgba(253,224,71,0.4)',
                      boxShadow: '0 4px 20px rgba(234,179,8,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Devenir Premium</span>
                  </button>
                )}

                {adherent.pack === 'premium' && (
                  <div
                    className="flex items-center gap-1 sm:gap-1.5 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full font-bold text-xs sm:text-sm md:text-base whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, rgba(234,179,8,0.85), rgba(202,138,4,0.85))',
                      border: '1px solid rgba(253,224,71,0.5)',
                      boxShadow: '0 4px 20px rgba(234,179,8,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <span className="text-base sm:text-lg md:text-xl">⭐</span>
                    <span>Premium</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom-edge inner shadow for depth */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, transparent)',
          }}
        />
      </header>
    </>
  );
}