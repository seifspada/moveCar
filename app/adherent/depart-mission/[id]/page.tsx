"use client";

import { use, useState } from "react";
import SidebarAdherent from "@/app/components/sideBarAdherent";
import { missionsData } from "@/app/data/missions";
import ProfileHeader from "@/components/mission-components/ProfileHeader";
import { notFound } from "next/navigation";
import StepperStartMission from "@/app/components/StepperStartMission";
import MissionStartValidation from "@/components/mission-components/DepartMission/MissionStartValidation";
import InstructionMission from "@/components/mission-components/DepartMission/InstructionMission";

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
  const [currentStep, setCurrentStep] = useState<'validation' | 'instructions'>('validation');

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleValidate = () => {
    console.log('Mission validée:', mission.id);
    // Passer à l'étape suivante : Instructions
    setCurrentStep('instructions');
  };

  const handleInstructionsValidate = () => {
    console.log('Instructions validées pour la mission:', mission.id);
    // TODO: Rediriger vers la page "Mission en cours" ou mettre à jour le statut
    // router.push('/missions/en-cours/' + mission.id);
  };

  return (
    <div className="min-h-screen">
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
        <StepperStartMission currentStep={currentStep === 'validation' ? 0 : 1} />
      </div>

      {/* Affichage conditionnel selon l'étape */}
      {currentStep === 'validation' ? (
        <MissionStartValidation 
          mission={mission} 
          onValidate={handleValidate}
        />
      ) : (
        <InstructionMission 
          mission={mission}
          onValidate={handleInstructionsValidate}
        />
      )}
    </div>
  );
}