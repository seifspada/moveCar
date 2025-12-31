'use client';

import { useRouter, useParams } from 'next/navigation';
import { Mission, missionsData } from '@/app/data/missions';
import MissionDetails from '@/components/mission-components/MissionDetails';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
import { useMemo, useState } from 'react';
export default function Page() {
  const router = useRouter();
  const params = useParams();          // 👈 correct
  const missionId = Number(params.id); // 👈 correct

  const mission = missionsData.find(m => m.id === missionId);


  const [searchQuery, setSearchQuery] = useState("");
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const filteredMissions = useMemo(() => {
    if (!searchQuery) return missionsData;

    return missionsData.filter(
      (m: Mission) =>
        m.villeDepart.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.villeArrivee.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handlePositionSearch = (data: any) => {
    console.log("Recherche position:", data);
    // Logique de filtrage par position
  };

  const handleFilterSearch = (data: any) => {
    console.log("Recherche avec filtres:", data);
    // Logique de filtrage avancé
  };
  if (!mission) return <p>Mission introuvable</p>;

  return (
    <div className="min-h-screen bg-black">
      {/* Header en plein largeur - reste en haut */}
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
