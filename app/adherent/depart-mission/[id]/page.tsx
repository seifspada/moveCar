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
import { useRoleProtection } from "@/app/hooks/userRoleProtection";

export default function MissionDeparturePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params);
  const missionId = Number(resolvedParams.id);

  // ✅ Protection du rôle adherent
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ['adherent']
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'validation' | 'instructions' | 'reconnaissance' | 'etat'
  >('validation');

  // ✅ Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // ✅ Ne rien afficher si pas autorisé (redirection en cours)
  if (!isAuthorized) {
    return null;
  }

  // ✅ Vérifier que la mission existe après l'autorisation
  const mission = missionsData.find((m) => m.id === missionId);

  if (!mission) {
    notFound();
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleValidate = () => {
    console.log('Mission validée:', mission.id);
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
    // Redirection ou action finale
  };

  // Convertir currentStep en numéro pour le stepper
  const stepNumber = 
    currentStep === 'validation' ? 1 : 
    currentStep === 'instructions' ? 2 : 
    currentStep === 'reconnaissance' ? 3 : 
    currentStep === 'etat' ? 4 : 1;

  // ✅ Contenu protégé - affiché uniquement si autorisé
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
        <StepperStartMission currentStep={stepNumber} />
      </div>

      {/* Affichage conditionnel selon l'étape */}
      {currentStep === 'validation' && (
        <MissionStartValidation 
          mission={mission} 
          onValidate={handleValidate}
        />
      )}
      
      {currentStep === 'instructions' && (
        <InstructionMission 
          mission={mission}
          onValidate={handleInstructionsValidate}
        />
      )}
      
      {currentStep === 'reconnaissance' && (
        <ReconnaissanceAdherent 
          mission={mission}
          onValidate={handleReconnaissanceValidate}
        />
      )}
      
      {currentStep === 'etat' && (
        <EtatDesLieux 
          mission={mission}
          onValidate={handleEtatValidate}
        />
      )}
    </div>
  );
}
