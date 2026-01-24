// hooks/useRoleProtection.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'adherent' | 'partenaire' | 'admin' | 'manager';

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

      console.log('🔐 Protection - Rôle actuel:', role);
      console.log('🔐 Rôles autorisés:', options.allowedRoles);

      if (!role) {
        console.log('❌ Pas de rôle - Redirection vers /login');
        router.push(options.redirectTo || '/auth/login');
        return;
      }

      if (!options.allowedRoles.includes(role)) {
        console.log('❌ Rôle non autorisé:', role);
        
        // Rediriger vers la page appropriée selon le rôle
        const roleRedirects: Record<UserRole, string> = {
          adherent: '/adherent/mission-page',
          partenaire: '/partenaire/dashboard',
          admin: '/admin/overview',
          manager: '/manager/home',
        };
        
        router.push(roleRedirects[role] || '/auth2');
        return;
      }

      console.log('✅ Accès autorisé');
      setCurrentRole(role);
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, options]);

  return { isAuthorized, isLoading, currentRole };
}
