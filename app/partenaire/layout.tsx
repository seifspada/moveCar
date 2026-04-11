"use client";

import { ReactNode } from "react";
import { useRoleProtection } from "../hooks/userRoleProtection";
import PartenaireLayoutWrapper from "@/components/partenaire-components/PartenaireLayoutWrapper";

export default function PartenaireLayout({ children }: { children: ReactNode }) {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ['partenaire']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-700">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <>
      <PartenaireLayoutWrapper />
      {children}
    </>
  );
}
