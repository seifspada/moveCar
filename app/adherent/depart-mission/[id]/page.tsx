"use client";

import { use, useState } from "react";
import SidebarAdherent from "@/app/components/sideBarAdherent";
import { missionsData } from "@/app/data/missions";
import ProfileHeader from "@/components/mission-components/ProfileHeader";
import { notFound } from "next/navigation";
import StepperStartMission from "@/app/components/StepperStartMission";
import MissionStartValidation from "@/components/mission-components/DepartMission/MissionStartValidation";
import InstructionMission from "@/components/mission-components/DepartMission/InstructionMission";
import ReconnaissanceAdherent from "@/components/mission-components/DepartMission/ReconnaissanceAdherent";
import EtatDesLieux from "@/components/mission-components/DepartMission/EtatDesLieux";

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
const [currentStep, setCurrentStep] = useState<
  'validation' | 'instructions' | 'reconnaissance' |'etat'
>('validation');

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleValidate = () => {
    console.log('Mission validée:', mission.id);
    // Passer à l'étape suivante : Instructions
    setCurrentStep('instructions');
  };

const handleInstructionsValidate = () => {
  console.log('Instructions validées pour la mission:', mission.id);
  setCurrentStep('reconnaissance');
};

const handleReconnaissanceValidate = () => {
  console.log('Reconnaissance validée pour la mission:', mission.id);
  setCurrentStep('etat');
};

const handleEtatValidate = () => {
  console.log('État des lieux validé pour la mission:', mission.id);
  // Vous pouvez ajouter une action ici, comme rediriger l'utilisateur ou afficher un message de confirmation
}



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
  <StepperStartMission 
    currentStep={
      currentStep === 'validation' ? 0 : 
      currentStep === 'instructions' ? 1 : 
      currentStep === 'reconnaissance' ? 2 : 
      currentStep === 'etat' ? 3 : 4
    } 
  />
</div>

{/* Affichage conditionnel selon l'étape */}
{currentStep === 'validation' ? (
  <MissionStartValidation 
    mission={mission} 
    onValidate={handleValidate}
  />
) : currentStep === 'instructions' ? (
  <InstructionMission 
    mission={mission}
    onValidate={handleInstructionsValidate}
  />
) : currentStep === 'reconnaissance' ? (
  <ReconnaissanceAdherent 
      mission={mission}
      onValidate={handleReconnaissanceValidate}
  />
) : currentStep === 'etat' ? (
  <EtatDesLieux />
) : null}


    </div>
  );
}