import React from "react"
import Image from "next/image";

interface AuthFormCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthFormCard({ title, subtitle, children, footer }: AuthFormCardProps) {
  return (
    <>
      {/* Logo */}
      <div className="flex justify-center mb-8 -mt-10">
        <div className="relative inline-block">
          <Image
            src="/images/logo.png"
            alt="Logo TransConvoy"
            width={240}
            height={240}
            className="rounded-lg w-40 h-40"
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-500 rounded"></div>
        </div>
      </div>

      <p className="text-center text-orange-600 mb-6">Transport & Convoyeurs</p>

      {/* Titre */}
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
        {title}
      </h2>

      {/* Sous-titre optionnel */}
      {subtitle && (
        <p className="text-center text-gray-600 mb-8">{subtitle}</p>
      )}

      {/* Contenu du formulaire */}
      <div className="mt-8">
        {children}
      </div>

      {/* Footer optionnel */}
      {footer && (
        <div className="mt-6">
          {footer}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} TransConvoy – Tous droits réservés
      </p>
    </>
  );
}
