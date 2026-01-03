// ProfileHeader.tsx
import { Menu, X } from "lucide-react";
import Image from "next/image";

// ============================================
// PROFILE HEADER COMPONENT - Totalement responsive
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5">
          <div className="flex items-center justify-between gap-3 sm:gap-4">

            {/* ✅ Section GAUCHE: Bouton Menu + Logo */}
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

              {/* ✅ Logo responsive - tailles augmentées */}
              <Image
                src="/images/logo.jpg"
                alt="Logo"
                width={150}
                height={150}
                className="rounded-lg w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                priority
              />
            </div>

            {/* ✅ Section DROITE: Profil utilisateur - visible sur mobile */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {/* Texte utilisateur - TOUJOURS visible */}
              <div className="text-right">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight">
                  Prénom Nom
                </h2>
                <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-orange-400 font-medium leading-tight">
                  prenom.nom@email.com
                </p>
              </div>
              
              {/* Avatar responsive - tailles augmentées */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-3 sm:border-4 border-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">PN</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-black rounded-full"></div>
              </div>

              {/* Bouton Premium - adapté mais visible */}
              <button className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold hover:from-yellow-600 hover:to-yellow-700 transition shadow-lg text-xs sm:text-sm md:text-base whitespace-nowrap">
                <span className="hidden sm:inline">Devenez</span> Premium
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}