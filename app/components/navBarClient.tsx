'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle, FaSignOutAlt, FaCog, FaUser } from "react-icons/fa";
import LanguageSelector from "./LanguageSelector";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
}

export default function NavBarClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hideNavbar = pathname.startsWith('/adherent') || pathname.startsWith('/partenaire') || pathname.startsWith('/formulaire');

  // ✅ Récupérer les données utilisateur depuis localStorage uniquement
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsConnected(true);
      } catch (error) {
        console.error('Erreur parsing user:', error);
        handleLogout();
      }
    } else {
      setIsConnected(false);
    }
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // ✅ Ajouter aussi token
    localStorage.removeItem('currentUser'); // ✅ Nettoyer userContext aussi
    setIsConnected(false);
    setUser(null);
    setShowDropdown(false);
    router.push('/auth/login');
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  if (hideNavbar) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-slate-800 border-b border-orange-500/30 backdrop-blur-sm animate-slide-blur -lg:py-4">
      <div className="flex h-20 md:h-50 items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16 relative">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-4 md:mr-8 lg:mr-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full border-3 sm:border-4 border-orange-500 overflow-hidden shadow-lg ml-2 md:ml-4 lg:ml-6">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              width={150}
              height={150}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </Link>

        <div className="absolute px-15 py-4.5 right-2 top-2 block md:hidden">
          <LanguageSelector />
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex md:gap-2 md:mr-[50px] lg:ml-[80px] lg:gap-6 md:gap-4 xl:gap-8 mx-auto items-center">
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

        {/* Section droite */}
        <div className="hidden md:flex items-center gap-2 md:gap-8 lg:gap-4 xl:gap-6 ml-4 md:ml-2 lg:ml-12 shrink-0">
          <div className="mr-2 lg:mr-8 lg:-ml-8 md:-ml-12">
            <LanguageSelector />
          </div>
          
          {isConnected && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 md:mr-5 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500">
                  {user.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.name}
                      fill
                      className="object-cover"
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
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaUser className="text-gray-400" />
                      Mon profil
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <FaCog className="text-gray-400" />
                      Paramètres
                    </Link>

                    <hr className="my-1 border-gray-200" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="flex items-center lg:gap-4 md:gap-1 md:mr-5 text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
              <FaUserCircle size={24} />
              <span className="text-base font-medium">Connexion</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-orange-500 hover:text-orange-400 transition-colors ml-auto"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-orange-500/30">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors">
              Accueil
            </Link>
            <Link href="/about" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors">
              À propos
            </Link>
            <Link href="/services" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors">
              Services
            </Link>
            <Link href="/contact" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors">
              Contact
            </Link>
            
            <hr className="border-gray-700" />
            
            {isConnected && user ? (
              <>
                <div className="py-2">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Link href="/profile" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors">
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="block py-2 text-gray-100 hover:text-orange-500 transition-colors">
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
