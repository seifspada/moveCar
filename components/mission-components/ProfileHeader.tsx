// ProfileHeader.tsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarAdherant from "@/app/components/sideBarAdherant";

  
// ============================================
// PROFILE HEADER COMPONENT - Amélioré
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

      {/* Header amélioré */}
      <header className="w-full bg-gradient-to-r from-black via-zinc-900 to-black border-b-2 border-orange-500 shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            
            {/* Bouton hamburger MOBILE avec animation */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-3 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Menu Mobile"
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>

            {/* Bouton hamburger DESKTOP avec animation */}
            <button
              onClick={toggleDesktopMenu}
              className="hidden md:block text-white p-3 hover:bg-orange-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-label="Menu Desktop"
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isDesktopMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-300 ${isDesktopMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>

            {/* Profil utilisateur amélioré */}
            <div className="flex items-center gap-4 sm:gap-6 flex-1">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-4 border-orange-500 flex-shrink-0 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl sm:text-3xl">PN</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-black rounded-full"></div>
              </div>
              
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Prénom Nom
                </h2>
                <p className="text-sm sm:text-base text-orange-400 font-medium">
                  prenom.nom@email.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}