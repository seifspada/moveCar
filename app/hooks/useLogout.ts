// hooks/useLogout.ts
'use client';

import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    // ✅ Nettoyer tout le localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // Rediriger vers login
    router.push('/signin');
  };

  return { logout };
}
