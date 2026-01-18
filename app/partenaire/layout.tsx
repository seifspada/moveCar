// app/partenaire/layout.tsx
"use client";

import { ReactNode } from "react";
import { useRoleProtection } from "../hooks/userRoleProtection";

export default function PartenaireLayout({ children }: { children: ReactNode }) {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ['partenaire']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  // ✅ Toutes les pages sous /partenaire/* sont automatiquement protégées
  return <>{children}</>;
}
