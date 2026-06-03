'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Truck } from "lucide-react";

export default function NavFormulaire() {


    return (
        <nav className="fixed inset-x-0 top-0 z-50 bg-slate-800 border-b border-orange-500/30 backdrop-blur-sm animate-slide-blur -pt-20">
            <style>{`
        @keyframes slide-blur {
          0% { transform: translateY(-20px); opacity: 0; filter: blur(6px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        .animate-slide-blur { animation: slide-blur 0.7s ease-out; }
      `}</style>

            <div className="relative flex items-center justify-center h-20 md:h-24 px-4 md:px-8">
             {/* Logo */}
<Link
  href="/"
  className="absolute left-4 md:left-8 flex items-center gap-3"
>
  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-3 sm:border-4 border-orange-500 overflow-hidden shadow-lg">
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


                {/* Texte centré */}
                <div className="text-center sm:gap-4  text-white sm:text-s md:text-xl lg:text-2xl font-semibold">

                    <p className="text-lg md:text-xl font-bold inline-flex items-center justify-center gap-2">
                        <Truck className="w-5 h-5 text-orange-500" />
                        Compléter le profil
                    </p>

                    <p className="text-[10px] md:text-base text-gray-300 ml-2 md:ml-6">
                        Tous les champs marqués par <span className="text-orange-500 font-bold">*</span> sont obligatoires
                    </p>


                </div>
            </div>
        </nav>
    );
}
