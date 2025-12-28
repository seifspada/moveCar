"use client";
import React, { useState } from 'react';
import { Menu, X, Briefcase, Calendar, Heart, User, LogOut, MapPin, Filter, Clock, Package, Link } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation'; // ✅ Correction ici

// ============================================
// SIDEBAR COMPONENT - Animation améliorée
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
  const menuItems = [
    { icon: Briefcase, label: 'Liste des missions', href: '#missions' },
    { icon: Calendar, label: 'Réservations', href: '#reservations' },
    { icon: Heart, label: 'Favoris', href: '#favoris' },
    { icon: User, label: 'Compte', href: '#compte' },
  ];
  
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };
  return (
    <>
      {/* ========================================
          DESKTOP SIDEBAR avec animation fluide
      ======================================== */}
      <aside 
        className={`hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-72 bg-black border-r-2 border-orange-500 z-50 transform transition-all duration-700 ease-out shadow-2xl ${
          isDesktopMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        {/* Header avec logo */}
        <div className="h-24 flex items-center justify-between px-6 border-b-2 border-orange-500 bg-gradient-to-r from-zinc-900 to-black">
            <div onClick={handleLogoClick}  className="flex items-center gap-3">

              <Image
              src="/images/R.jpeg"
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

        {/* Navigation avec animations au hover */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={onDesktopMenuToggle}
              className="flex items-center gap-4 px-5 py-4 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl transition-all duration-300 group transform hover:scale-105 hover:shadow-lg"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
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
          MOBILE SIDEBAR avec animation fluide
      ======================================== */}
      <aside 
        className={`md:hidden fixed left-0 top-0 h-screen w-80 bg-black border-r-2 border-orange-500 z-50 transform transition-all duration-700 ease-out shadow-2xl ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
      >
        {/* Header */}
        <div className="h-24 flex items-center justify-between px-6 border-b-2 border-orange-500 bg-gradient-to-r from-zinc-900 to-black">
          <div className="flex items-center gap-3">
             <div onClick={handleLogoClick}  className="flex items-center gap-3">

              <Image
              src="/images/R.jpeg"
              alt="Logo"
              width={150}
              height={150}
              className="rounded-lg w-25 h-18  md:w-20 md:h-20 md:mr-10 "
              priority
                      />
            </div>
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
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={onMobileMenuToggle}
              className="flex items-center gap-4 px-5 py-4 text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl transition-all duration-300 group transform hover:scale-105"
            >
              <item.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
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
