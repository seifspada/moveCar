"use client";

import { use } from "react"; // ✅ Import de React.use()
import SidebarAdherent from "@/app/components/sideBarAdherent";
import { missionsData, Mission } from "@/app/data/missions";
import MissionDeparture from "@/components/mission-components/MissionStartValidation";
import ProfileHeader from "@/components/mission-components/ProfileHeader";
import { useState } from "react";
import { notFound } from "next/navigation";
import StepperStartMission from "@/app/components/StepperStartMission";
export default function MissionDeparturePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const missionId = Number(resolvedParams.id);

  const mission = missionsData.find((m) => m.id === missionId);

  if (!mission) {
    notFound();
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleValidate = () => {
    console.log('Mission validée:', mission.id);
    // TODO: Rediriger vers la page "Mission en cours" ou mettre à jour le statut
    // router.push('/missions/en-cours/' + mission.id);
  };

  return (
<div className=" min-h-screen">

      {/* Sidebar Component */}
      <SidebarAdherent
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />


      {/* Profile Header */}
      <ProfileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        toggleDesktopMenu={toggleDesktopMenu}
      />
<div className="bg-black">
      <StepperStartMission currentStep={0} />

</div>
      {/* Mission Departure Component */}
      <MissionDeparture 
        mission={mission} 
        onValidate={handleValidate}
      />
    </div>
  );
}