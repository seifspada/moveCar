// components/partenaire-components/ProfileHeader.tsx
'use client';

import { PartenaireNavbarData } from "@/app/types/partenaire";
import { GET_PARTENAIRE_NAVBAR } from "@/lib/graphql/queries/partenaire";
import { useQuery } from "@apollo/client/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from 'react';
import { buildDocumentUrl } from "@/lib/api";

interface ProfileHeaderProps {
  isMobileMenuOpen: boolean;
  isDesktopMenuOpen: boolean;
  toggleMobileMenu: () => void;
  toggleDesktopMenu: () => void;
  logoUrl?: string;
}

export default function ProfileHeader({
  isMobileMenuOpen,
  isDesktopMenuOpen,
  toggleMobileMenu,
  toggleDesktopMenu,
  logoUrl
}: ProfileHeaderProps) {
  const pathname = usePathname();
  const showNavbar = pathname.startsWith('/partenaire');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, loading } = useQuery<PartenaireNavbarData>(
    GET_PARTENAIRE_NAVBAR,
    {
      skip: !isClient,
      fetchPolicy: 'cache-and-network',
    }
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ Construire l'URL complète de la photo (comme adherent)
  const rawPhoto = data?.partenaireNavbar?.photo ?? null;
  const photoUrl = rawPhoto ? buildDocumentUrl(rawPhoto) : null;

  const partner = {
    nom: data?.partenaireNavbar?.entite || 'Chargement...',
    email: data?.partenaireNavbar?.email || '',
    photo: photoUrl, // ✅ URL complète
    isOnline: true,
  };

  if (!showNavbar) return null;

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

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-700 ease-out pointer-events-none ${
          isMobileMenuOpen || isDesktopMenuOpen ? 'opacity-70 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => {
          if (isMobileMenuOpen) toggleMobileMenu();
          if (isDesktopMenuOpen) toggleDesktopMenu();
        }}
      />

      {/* Header */}
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5">
          <div className="flex items-center justify-between gap-3 sm:gap-4">

            {/* Section GAUCHE: Bouton Menu + Logo */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Bouton hamburger MOBILE */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white p-2 sm:p-3 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Menu Mobile"
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                  <Menu className={`w-full h-full absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} />
                  <X className={`w-full h-full absolute transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} />
                </div>
              </button>

              {/* Bouton hamburger DESKTOP */}
              <button
                onClick={toggleDesktopMenu}
                className="hidden md:block text-white p-3 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                aria-label="Menu Desktop"
              >
                <div className="relative w-6 h-6">
                  <Menu className={`w-6 h-6 absolute transition-all duration-300 ${
                    isDesktopMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                  }`} />
                  <X className={`w-6 h-6 absolute transition-all duration-300 ${
                    isDesktopMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                  }`} />
                </div>
              </button>

              {/* Logo */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-3 sm:border-4 border-orange-500 overflow-hidden shadow-lg">
                <Image
                  src={logoUrl || "/images/logo.png"}
                  alt="Logo"
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>

              <div className="hidden md:block border-l-4 justify-center border-orange-500 pl-8 mb-1">
                <h1 className="text-3xl font-bold text-white">Demande de Déplacement</h1>
                <p className="text-sm text-white mt-1">Complétez les informations pour votre demande</p>
              </div>
            </div>

            {/* Section DROITE: Profil utilisateur */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {loading ? (
                <>
                  <div className="text-right">
                    <div className="h-5 w-32 bg-slate-700 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-48 bg-slate-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-slate-700 rounded-full animate-pulse"></div>
                </>
              ) : (
                <>
                  {/* Texte utilisateur */}
                  <div className="text-right">
                    <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight">
                      {partner.nom}
                    </h2>
                    <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-orange-400 font-medium leading-tight">
                      {partner.email}
                    </p>
                  </div>

                  {/* ✅ Avatar : photo réelle ou initiales en fallback */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-3 sm:border-4 border-orange-500 overflow-hidden shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      {partner.photo ? (
                        <Image
                          src={partner.photo}
                          alt={partner.nom}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized           // ✅ Bypass next/image optimizer
                          onError={(e) => {
                            console.error('❌ Erreur chargement photo partenaire:', partner.photo);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                          {getInitials(partner.nom)}
                        </span>
                      )}
                    </div>

                    {/* Indicateur en ligne */}
                    {partner.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-slate-800 rounded-full"></div>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
}