'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Mission } from "@/app/data/missions";
export default function NavBarClient() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const hideNavbar = pathname === '/signin' || pathname.startsWith('/adherant/');

  if (hideNavbar) return null; // si page login, ne rien afficher

  return (
    <nav className="relative inset-x-0 top-0 z-50 bg-slate-800 border-b border-orange-500/30 backdrop-blur-sm animate-slide-blur">
      <style>{`
        @keyframes slide-blur {
          0% { transform: translateY(-20px); opacity: 0; filter: blur(6px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        .animate-slide-blur { animation: slide-blur 0.7s ease-out; }
      `}</style>

      <div className="flex h-20 md:h-50 items-center justify-center px-4 md:px-8 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 absolute left-4 md:left-8">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={150}
            height={150}
            className="rounded-lg w-16 h-16 md:w-36 md:h-36"
            priority
          />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link href="/" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors">Accueil</Link>
          <Link href="/about" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors">À propos</Link>
          <Link href="/services" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors">Services</Link>
          <Link href="/contact" className="text-lg font-medium text-gray-100 hover:text-orange-500 transition-colors">Contact</Link>
        </div>

        {/* Right side : Connexion */}
        <div className="hidden md:flex absolute right-4 md:right-8 items-center gap-4">
          <Link href="/signin" className="flex items-center gap-2 text-gray-100 hover:text-orange-500 transition-colors">
            <FaUserCircle size={26} />
            <span className="text-base font-medium">Connexion</span>
          </Link>
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-orange-500 hover:text-orange-400 transition-colors absolute right-4"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-orange-500/30 px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">Accueil</Link>
          <Link href="/about" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">À propos</Link>
          <Link href="/services" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">Services</Link>
          <Link href="/contact" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">Contact</Link>

          {/* Connexion inside mobile menu */}
          <Link href="/signin" className="flex items-center gap-2 text-gray-100 hover:text-orange-500 transition-colors py-2">
            <span className="text-base font-medium">Connexion</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
