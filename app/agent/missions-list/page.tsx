'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MissionAgenceList from '@/components/agent-component/mission-list-component/MissionAgenceList';

export default function AgentMissionsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [agenceId, setAgenceId] = useState<number>(0);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen((prev) => !prev);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const storedAgenceId = localStorage.getItem('agenceId');

    if (!role || role !== 'agent') {
      router.push('/auth/login');
      return;
    }

    if (storedAgenceId) {
      setAgenceId(Number(storedAgenceId));
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router]);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
          </div>
          <p className="text-white text-lg font-medium">Chargement</p>
          <p className="text-gray-500 text-sm mt-1">Vérification de votre accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-black">
     

      {/* Contenu principal */}
      <main className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Titre page */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Missions</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Gérez les missions de votre agence
            </p>
          </div>

          {/* Liste missions */}
          <MissionAgenceList
            agenceId={agenceId}
            onAddMission={() => router.push('/agent/demande-mission')}
          />

        </div>
      </main>
    </div>
  );
}