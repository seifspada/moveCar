// hooks/useRoleProtection.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

const log = (...args: any[]) => {
  if (DEBUG_MODE) {
    console.log(...args);
  }
};

// ✅ Ajout de 'admin' et 'agent'
type UserRole = 'adherent' | 'partenaire' | 'admin' | 'agent';

interface UseRoleProtectionOptions {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export function useRoleProtection(options: UseRoleProtectionOptions) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem('role') as UserRole | null;

      log('🔐 Protection - Rôle actuel:', role);
      log('🔐 Rôles autorisés:', options.allowedRoles);

      if (!role) {
        log('❌ Pas de rôle - Redirection vers /login');
        router.push(options.redirectTo || '/auth/login');
        return;
      }

      if (!options.allowedRoles.includes(role)) {
        log('❌ Rôle non autorisé:', role);

        // ✅ Ajout des redirections pour admin et agent
        const roleRedirects: Record<UserRole, string> = {
          adherent: '/adherent/mission-page',
          partenaire: '/partenaire/acceuil',
          admin: '/admin/overview',
          agent: '/agent/acceuil',
        };

        router.push(roleRedirects[role] || '/auth/login');
        return;
      }

      log('✅ Accès autorisé');
      setCurrentRole(role);
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, options]);

  return { isAuthorized, isLoading, currentRole };
}
