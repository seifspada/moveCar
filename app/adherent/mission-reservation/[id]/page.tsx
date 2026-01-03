'use client';

import { use, useMemo, useState } from 'react'; // ✅ Importer 'use'
import { useRouter } from 'next/navigation';
import { Mission, missionsData } from '@/app/data/missions';
import MissionDetails from '@/components/mission-components/MissionDetails';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
import SidebarAdherent from '@/app/components/sideBarAdherent';

export default function MissionReservationPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // ✅ params est maintenant une Promise
}) {
  const router = useRouter();
  
  // ✅ Unwrap la Promise avec React.use()
  const resolvedParams = use(params);
  const missionId = Number(resolvedParams.id);

  const mission = missionsData.find((m): m is Mission => m.id === missionId);

  const [searchQuery, setSearchQuery] = useState("");
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const filteredMissions = useMemo(() => {
    if (!searchQuery) return missionsData;

    return missionsData.filter(m =>
      m.villeDepart.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.villeArrivee.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (!mission) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        Mission introuvable
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <SidebarAdherent
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />

      <ProfileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        toggleDesktopMenu={toggleDesktopMenu}
      />

      <MissionDetails
        mission={mission}
        onBack={() => router.back()}
        onReserve={() => alert('Réserver')}
      />
    </div>
  );
}