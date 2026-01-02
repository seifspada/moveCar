'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { Mission } from "@/app/data/missions";
import LanguageSelector from "./LanguageSelector";

export default function NavBarClient() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/adherant')|| pathname.startsWith('/partenaire');

  if (hideNavbar) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-slate-800 border-b border-orange-500/30 backdrop-blur-sm animate-slide-blur">
      <style>{`
        @keyframes slide-blur {
          0% { transform: translateY(-20px); opacity: 0; filter: blur(6px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        .animate-slide-blur { animation: slide-blur 0.7s ease-out; }
      `}</style>

      <div className="flex h-20 md:h-50 items-center justify-between px-4 md:px-8 lg:px-12 xl:px-16 relative">
        
        {/* Logo - avec marge droite responsive */}
        <Link href="/" className="flex items-center gap-3 shrink-0 mr-4 md:mr-8 lg:mr-12">
          <Image
            src="/images/logo.jpg"
            alt="Logo"
            width={150}
            height={150}
            className="rounded-lg w-16 h-16 md:w-36 md:h-36"
            priority
          />
        </Link>

  <div className="absolute px-15 py-4.5 right-2 top-2 block md:hidden">
    <LanguageSelector />
  </div>




        {/* Menu Desktop - au centre avec marges */}
<div className=" hidden md:flex 
            md:gap-2       <!-- gap tablette -->
            md:mr-[50px]   <!-- marge uniquement tablette -->
            lg:ml-[80px]  <!-- marge uniquement desktop -->
            lg:gap-6       <!-- gap desktop -->
            md:gap-4       <!-- gap md -->
            xl:gap-8       <!-- gap xl -->
            mx-auto
            items-center">
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

        {/* Section droite: Language + Connexion avec marges */}
        <div className="hidden md:flex items-center gap-2 md:gap-8 lg:gap-4 xl:gap-6 ml-4 md:ml-2 lg:ml-12 shrink-0">
          <div className="mr-2 lg:mr-8 lg:-ml-8 md:-ml-12">
            <LanguageSelector />
          </div>
          
          <Link href="/signin" className="flex items-center lg:gap-4 md:gap-1 md:mr-5 text-gray-100 hover:text-orange-500 transition-colors whitespace-nowrap">
            <FaUserCircle size={24} />
            <span className="text-base font-medium">Connexion</span>
          </Link>
        </div>

        {/* Hamburger Button (Mobile Only) */}
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
        <div className="md:hidden bg-slate-800 border-t border-orange-500/30 px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">
            Accueil
          </Link>
          <Link href="/about" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">
            À propos
          </Link>
          <Link href="/services" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">
            Services
          </Link>
          <Link href="/contact" className="text-base font-medium text-gray-100 hover:text-orange-500 py-2">
            Contact
          </Link>

          {/* Connexion inside mobile menu */}
          <Link href="/signin" className="flex items-center md:mr-4 lg:mr-8 gap-2 text-gray-100 hover:text-orange-500 transition-colors py-2">
            <span className="text-base font-medium">Connexion</span>
          </Link>
        </div>
      )}
    </nav>
  );
}