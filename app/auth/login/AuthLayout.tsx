"use client";

import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Colonne gauche : image / illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-50 items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="m-auto flex items-center justify-center">
            <Image
              src="/images/auth-illustration.png"
              alt="Illustration"
              width={480}
              height={480}
              className="max-h-[70vh] w-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Colonne droite : formulaire (email / mot de passe / etc.) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-12 sm:px-6 lg:px-12 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}