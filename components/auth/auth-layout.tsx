import React from "react"
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-gray-50 pt-45">
      {/* Partie gauche : Image + Titre */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/loginImage.jpg"
            alt="Convoyeur industriel et logistique"
            fill
            sizes="50vw"
            className="object-cover object-bottom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>

        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="relative z-10 flex flex-col justify-center items-start w-full h-full px-16 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium">Service Premium</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            Déplacement de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              véhicules
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-md leading-relaxed">
            Convoyage de véhicules privés et services de transport fiables pour tous vos besoins logistiques
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                ✓
              </div>
              <span className="text-sm font-medium">Service disponible 24/7</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                ✓
              </div>
              <span className="text-sm font-medium">Suivi en temps réel</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                ✓
              </div>
              <span className="text-sm font-medium">Conducteurs professionnels</span>
            </div>
          </div>

          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Partie droite : Formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
