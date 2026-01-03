"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Briefcase, Calendar, Heart, User, LogOut } from 'lucide-react';
import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';

// ============================================
// SIDEBAR COMPONENT - Détection automatique de la page active
// ============================================
interface SidebarAdherantProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  isDesktopMenuOpen: boolean;
  onDesktopMenuToggle: () => void;
}

export default function SidebarAdherant({ 
  isMobileMenuOpen, 
  onMobileMenuToggle,
  isDesktopMenuOpen,
  onDesktopMenuToggle
}: SidebarAdherantProps) {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Détecte la route actuelle
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // Configuration des items du menu avec leurs routes
  const menuItems = [
    { key: 'missions', icon: Briefcase, label: 'Liste des missions', href: '/adherant/mission-page' },
    { key: 'reservations', icon: Calendar, label: 'Réservations', href: '/adherant/reservations' },
    { key: 'favoris', icon: Heart, label: 'Favoris', href: '/adherant/favoris' },
    { key: 'compte', icon: User, label: 'Mon profile', href: '/adherant/profile-adherant' },
  ];

  // ✅ Détection automatique de la page active au chargement et après navigation
  useEffect(() => {
    const currentItem = menuItems.find(item => pathname === item.href);
    if (currentItem) {
      setActiveItem(currentItem.key);
    } else {
      // Si on est sur une page avec un hash (#missions, #reservations, etc.)
      const hash = window.location.hash.replace('#', '');
      if (hash && menuItems.find(item => item.key === hash)) {
        setActiveItem(hash);
      }
    }
  }, [pathname]); // Se relance à chaque changement de route

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleNavClick = (item: typeof menuItems[0]) => {
    setActiveItem(item.key);
    
    // Navigation selon le type de lien
    if (item.href.startsWith('#')) {
      // Pour les ancres dans la page
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Pour les vraies routes
      router.push(item.href);
    }
  };

  // ✅ Fonction pour déterminer si un item est actif
  const isItemActive = (item: typeof menuItems[0]) => {
    // Vérification par route exacte
    if (pathname === item.href) return true;
    
    // Vérification par clé active
    if (activeItem === item.key) return true;
    
    return false;
  };

  return (
    <>
      {/* ========================================
          DESKTOP SIDEBAR avec détection automatique
      ======================================== */}
      <aside 
        className={`hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-72 bg-black border-r-2 border-orange-500 z-[3000] transform transition-all duration-700 ease-out shadow-2xl ${
          isDesktopMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        {/* Header avec logo */}
        <div className="h-30 flex items-center justify-between px-6 border-b border-orange-500/30 bg-slate-800 ">
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/images/R-bg.png"
              alt="Logo"
              width={150}
              height={150}
              className="rounded-lg w-25 h-15 md:w-25 md:h-20"
              priority
            />
          </div>
          
          <button 
            onClick={onDesktopMenuToggle} 
            className="text-white p-2 hover:bg-orange-500/20 rounded-lg transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation avec détection automatique */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            
            return (
              <button
                key={item.key}
                onClick={() => {
                  handleNavClick(item);
                  onDesktopMenuToggle();
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50'
                    : 'text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600'
                }`}
              >
                <item.icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-orange-500 group-hover:text-white'
                  }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer avec déconnexion */}
        <div className="p-4 border-t-2 border-orange-500 bg-gradient-to-r from-zinc-900 to-black">
          <button className="w-full flex items-center gap-4 px-5 py-4 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 group transform hover:scale-105">
            <LogOut className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ========================================
          MOBILE SIDEBAR avec détection automatique
      ======================================== */}
      <aside 
        className={`md:hidden fixed left-0 top-0 h-screen w-80 bg-black border-r-2 border-orange-500 z-50 transform transition-all duration-700 ease-out shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        {/* Header */}
        <div className="h-26 flex items-center justify-between px-6 border-b border-orange-500/30 bg-slate-800">
          <div onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer">
            <Image
              src="/images/R-bg.png"
              alt="Logo"
              width={150}
              height={150}
              className="rounded-lg w-25 h-18 md:w-20 md:h-20 md:mr-10"
              priority
            />
          </div>
          
          <button 
            onClick={onMobileMenuToggle} 
            className="text-white p-2 hover:bg-orange-500/20 rounded-lg transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            
            return (
              <button
                key={item.key}
                onClick={() => {
                  handleNavClick(item);
                  onMobileMenuToggle();
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50'
                    : 'text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600'
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    isActive
                      ? 'text-white'
                      : 'text-orange-500 group-hover:text-white'
                  }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-orange-500 bg-gradient-to-r from-zinc-900 to-black">
          <button className="w-full flex items-center gap-4 px-5 py-4 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-300 group">
            <LogOut className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}