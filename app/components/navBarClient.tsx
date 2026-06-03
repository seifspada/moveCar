'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaSignOutAlt, FaCog, FaUser, FaHome, FaClipboardList } from "react-icons/fa";
import LanguageSelector from "./LanguageSelector";
import { useUser } from "@/app/context/userContext";

export default function NavBarClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // ✅ État de chargement
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { currentUser, setCurrentUser } = useUser();

  const hideNavbar = pathname.startsWith('/') || pathname.startsWith('/partenaire') || pathname.startsWith('/formulaire') || pathname.startsWith('/agent')|| pathname.startsWith('/admin');

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Fonction de déconnexion avec appel API
  // Dans NavBarClient.tsx
// Dans NavBarClient.tsx
const handleLogout = async () => {
  setIsLoggingOut(true);
  
  try {
    // ✅ Essayer les deux noms de token
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    console.log('🔑 Token à envoyer:', token ? 'Présent' : 'Manquant');
    
    if (token) {
      console.log('📤 Envoi de la requête logout...');
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Réponse logout - Status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Logout réussi:', result);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur logout:', response.status, errorText);
      }
    } else {
      console.warn('⚠️ Aucun token trouvé, déconnexion locale seulement');
    }
  } catch (error: any) {
    console.error('❌ Exception lors du logout:', error.message);
  } finally {
    // ✅ Toujours nettoyer le localStorage et rediriger
    console.log('🧹 Nettoyage et redirection...');
    setCurrentUser(null);
    localStorage.clear();
    setShowDropdown(false);
    setIsLoggingOut(false);
    router.push('/auth/login');
  }
};



  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  const getFullPhotoUrl = (photoPath: string | null | undefined): string | undefined => {
    if (!photoPath) return undefined;
    
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    if (photoPath.startsWith('/uploads')) {
      return `${API_URL}${photoPath}`;
    }
    
    return `${API_URL}/uploads/${photoPath}`;
  };

  const getUserDisplay = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'adherent') {
      const fullPhotoUrl = getFullPhotoUrl(currentUser.photoPersonnelle);
      
      return {
        name: `${currentUser.prenom} ${currentUser.nom}`,
        email: currentUser.email,
        role: 'Adhérent',
        photoUrl: fullPhotoUrl,
      };
    } else if (currentUser.role === 'partenaire') {
      return {
        name: currentUser.entite || 'Partenaire',
        email: currentUser.email,
        role: 'Partenaire',
        photoUrl: undefined,
      };
    }

    return null;
  };

  const user = getUserDisplay();
  const isConnected = !!currentUser;

  if (hideNavbar) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-slate-800 border-b border-orange-500/30 backdrop-blur-sm py-8">
      <div className="flex h-auto items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-2 sm:border-3 md:border-4 border-orange-500 overflow-hidden shadow-lg">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </Link>

        {/* Section droite mobile */}
        <div className="md:hidden flex items-center gap-2">
          <div className="scale-90">
            <LanguageSelector />
          </div>

          {isConnected && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
                  {user.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error('❌ Erreur chargement image:', user.photoUrl);
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown mobile */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={currentUser?.role === 'adherent' ? '/adherent/mission-page' : '/partenaire/acceuil'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaHome className="text-gray-400" />
                      Accueil
                    </Link>

                    {currentUser?.role === 'adherent' && (
                      <Link
                        href="/adherent/mission-page"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaClipboardList className="text-gray-400" />
                        Mes missions
                      </Link>
                    )}

                    <Link
                      href={currentUser?.role === 'adherent' ? '/adherent/profile' : '/partenaire/profile'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="text-gray-400" />
                      Mon profil
                    </Link>

                    <Link
                      href={currentUser?.role === 'adherent' ? '/adherent/settings' : '/partenaire/settings'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaCog className="text-gray-400" />
                      Paramètres
                    </Link>

                    <hr className="my-1 border-gray-200" />

                    {/* ✅ Bouton de déconnexion avec état de chargement */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSignOutAlt className={isLoggingOut ? 'animate-spin' : ''} />
                      {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-gray-100 hover:text-orange-500 transition-colors">
              <FaUserCircle size={24} />
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-orange-500 hover:text-orange-400 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex md:gap-2 lg:gap-6 xl:gap-8 mx-auto items-center">
          <Link href="/" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
            Accueil
          </Link>
          <Link href="/about" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
            À propos
          </Link>
          <Link href="/services" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
            Services
          </Link>
          <Link href="/contact" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
            Contact
          </Link>
        </div>

        {/* Section droite Desktop */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <LanguageSelector />
          
          {isConnected && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
                  {user.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error('❌ Erreur chargement image:', user.photoUrl);
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-300">{user.email}</p>
                </div>

                <svg 
                  className={`hidden lg:block w-4 h-4 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown desktop */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={currentUser?.role === 'adherent' ? '/adherent/mission-page' : '/partenaire/acceuil'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaHome className="text-gray-400" />
                      Accueil
                    </Link>

                    {currentUser?.role === 'adherent' && (
                      <Link
                        href="/adherent/mission-page"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaClipboardList className="text-gray-400" />
                        Mes missions
                      </Link>
                    )}

                    <Link
                      href={currentUser?.role === 'adherent' ? '/adherent/profile' : '/partenaire/profile'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="text-gray-400" />
                      Mon profil
                    </Link>

                    <Link
                      href={currentUser?.role === 'adherent' ? '/adherent/settings' : '/partenaire/settings'}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaCog className="text-gray-400" />
                      Paramètres
                    </Link>

                    <hr className="my-1 border-gray-200" />

                    {/* ✅ Bouton de déconnexion avec état de chargement */}
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSignOutAlt className={isLoggingOut ? 'animate-spin' : ''} />
                      {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
              <FaUserCircle size={24} />
              <span className="text-base font-medium">Connexion</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-orange-500/30">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>
              Accueil
            </Link>
            <Link href="/about" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>
              À propos
            </Link>
            <Link href="/services" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link href="/contact" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
