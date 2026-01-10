'use client'

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarAdherent from '@/app/components/sideBarAdherent';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
import { missionsData } from '@/app/data/missions';
import RouteTracker from '@/components/mission-components/MissionTruck/RouteTracker';

export default function SuivieMissionPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = Number(params.id);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  
  const mission = missionsData.find(m => m.id === missionId);

  useEffect(() => {
    if (!missionId || !mission) {
      router.push('/adherent/missions');
      return;
    }
    
    if (mission.etatMission !== 'en_cours') {
      router.push(`/adherent/missions?id=${missionId}`);
    }
  }, [mission, missionId, router]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleMissionComplete = (missionId: number, tempsTotal: number) => {
    console.log(`Mission ${missionId} terminée en ${tempsTotal} secondes`);
    router.push(`/adherent/missions?id=${missionId}&completed=true`);
  };

  if (!mission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Chargement de la mission...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarAdherent
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />
      
      <div className={`transition-all duration-300 ${
        isDesktopMenuOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        <ProfileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          isDesktopMenuOpen={isDesktopMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          toggleDesktopMenu={toggleDesktopMenu}
        />
        
        <main className="p-4 md:p-8">
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <button 
                onClick={() => router.push('/adherent/missions')}
                className="hover:text-blue-600 transition-colors"
              >
                Mes missions
              </button>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Suivi en temps réel</span>
            </nav>
          </div>

          <RouteTracker
            mission={mission}
            onMissionComplete={handleMissionComplete}
            className="max-w-4xl mx-auto"
          />
        </main>
      </div>
    </div>
  );
}