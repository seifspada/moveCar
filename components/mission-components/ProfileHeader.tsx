// ProfileHeader.tsx
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarAdherant from "@/app/components/sideBarAdherant";

export default function ProfileHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  return (
    <>
      <header className="w-full bg-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            {/* Bouton hamburger pour MOBILE */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label="Menu Mobile"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Bouton hamburger pour DESKTOP */}
            <button
              onClick={toggleDesktopMenu}
              className="hidden md:block text-white p-2 hover:bg-blue-800 rounded-lg transition-colors"
              aria-label="Menu Desktop"
            >
              {isDesktopMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Infos profil */}
            <div className="flex items-center gap-4 sm:gap-6 flex-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full border-4 border-orange-500 flex-shrink-0" />
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Prénom Nom
                </h2>
                <p className="text-sm sm:text-base text-gray-300">
                  prenom.nom@email.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar avec les deux états */}
      <SidebarAdherant 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />
    </>
  );
}