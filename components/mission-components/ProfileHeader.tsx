// app/components/adherent/ProfileHeader.tsx
'use client';

import { useUser } from "@/app/context/userContext";
import { Menu, X, Crown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  if (pathname.includes('/adherent/mission-reservation/')) {
    return {
      title: 'Mission de Transport',
      subtitle: 'Détails de la réservation'
    };
  }

  if (pathname.includes('/adherent/depart-mission/')) {
    return {
      title: 'Départ de la Mission',
      subtitle: 'Validation requise avant le démarrage'
    };
  }

  return null;
};

// ============================================
// FONCTION UTILITAIRE POUR TRONQUER LE TEXTE
// ============================================
const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ✅ Fonction pour obtenir les initiales
const obtenirInitiales = (user: { nom?: string; prenom?: string } | null): string => {
  if (!user) return "??";
  const initNom = user.nom?.charAt(0).toUpperCase() || "";
  const initPrenom = user.prenom?.charAt(0).toUpperCase() || "";
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
  const { currentUser, isLoading } = useUser();

  // ✅ Si en cours de chargement
  if (isLoading) {
    return (
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white">Chargement du profil...</p>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ✅ Si pas d'utilisateur connecté
  if (!currentUser) {
    return (
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7">
          <div className="flex items-center justify-center">
            <p className="text-white text-lg">Non connecté</p>
          </div>
        </div>
      </header>
    );
  }

  // ✅ Construire l'URL complète pour la photo
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const photoUrl = currentUser.photoPersonnelle
    ? currentUser.photoPersonnelle.startsWith('http')
      ? currentUser.photoPersonnelle
      : currentUser.photoPersonnelle.startsWith('/uploads')
      ? `${API_URL}${currentUser.photoPersonnelle}`
      : null
    : null;

  // ✅ Valeurs avec fallback
  const nomComplet = `${currentUser.prenom || 'Prénom'} ${currentUser.nom || 'Nom'}`.trim();
  const email = currentUser.email || 'Email non disponible';
  const pack = currentUser.pack || 'basique';

  // ✅ DEBUG - Logs détaillés
  console.log('🔍 ProfileHeader Debug:');
  console.log('  - currentUser:', currentUser);
  console.log('  - photoPersonnelle:', currentUser.photoPersonnelle);
  console.log('  - photoUrl final:', photoUrl);
  console.log('  - pack:', pack);
  console.log('  - pack === "basique":', pack === 'basique');
  console.log('  - pack === "premium":', pack === 'premium');

  return (
    <>
      {/* Overlay avec animation fade fluide */}
      <div
        className={`fixed inset-0 bg-black z-30 transition-opacity duration-700 ease-out pointer-events-none ${
          isMobileMenuOpen || isDesktopMenuOpen ? 'opacity-70 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => {
          if (isMobileMenuOpen) toggleMobileMenu();
          if (isDesktopMenuOpen) toggleDesktopMenu();
        }}
      />

      {/* Header responsive */}
      <header className="w-full bg-slate-800 border-b border-orange-500/30 shadow-2xl sticky top-0 z-[2000]">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-3">
          <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-4">

            {/* ✅ Section GAUCHE: Bouton Menu + Logo */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
              {/* Bouton hamburger MOBILE */}
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

              {/* Bouton hamburger DESKTOP */}
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

              {/* Logo */}
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

            {/* ✅ Section CENTRE: Titre dynamique */}
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

            {/* ✅ Section DROITE: Profil utilisateur */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              {/* Texte utilisateur */}
              <div className="text-right max-w-[100px] sm:max-w-[140px] md:max-w-[180px] lg:max-w-none">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight truncate">
                  {truncateText(nomComplet, 20)}
                </h2>
                <p className="text-xs sm:text-xs md:text-sm lg:text-base text-orange-400 font-medium leading-tight truncate">
                  {truncateText(email, 25)}
                </p>
              </div>

              {/* Avatar avec photo ou initiales */}
              <div className="relative flex-shrink-0">
                {photoUrl ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 overflow-hidden shadow-lg">
                    <Image
                      src={photoUrl}
                      alt={nomComplet}
                      width={100}
                      height={100}
                      priority
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error('❌ Erreur chargement image:', photoUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                      {obtenirInitiales(currentUser)}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-slate-800 rounded-full"></div>
              </div>

              {/* ✅ Badge pack avec debug visuel */}
              <div className="flex flex-col gap-1">
                {/* Debug temporaire - à retirer après */}
                
               {/* ✅ Badge pack */}
{pack === 'basique' && (
  <button className="flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 text-white px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded-full font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap hover:scale-105 active:scale-95">
    <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Devenir Premium</span>
  </button>
)}

{pack === 'premium' && (
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
