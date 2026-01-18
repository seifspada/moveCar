// app/adherent/mission-reservation/[id]/page.tsx
'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mission, missionsData } from '@/app/data/missions';
import MissionDetails from '@/components/mission-components/MissionDetails';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
import SidebarAdherent from '@/app/components/sideBarAdherent';
import DynamicMissionsMap from '@/components/mission-components/DynamicMissionsMap';
import ReservationModal, { ReservationData } from '@/components/mission-components/ReservationModal';
import { CheckCircle } from 'lucide-react';
import { useRoleProtection } from '@/app/hooks/userRoleProtection';

export default function MissionReservationPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  
  // ✅ Protection du rôle adherent
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ['adherent']
  });
  
  const resolvedParams = use(params);
  const missionId = Number(resolvedParams.id);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleReserve = () => {
    setIsReservationModalOpen(true);
  };

  const handleConfirmReservation = (reservationData: ReservationData) => {
    console.log('Réservation confirmée:', reservationData);
    
    // Ici vous pouvez envoyer les données au backend
    // Par exemple: await fetch('/api/reservations', { method: 'POST', body: JSON.stringify(reservationData) })
    
    // Afficher un message de succès
    setShowSuccessMessage(true);
    
    // Rediriger après 3 secondes
    setTimeout(() => {
      router.push('/adherent/mission-page');
    }, 3000);
  };

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
  const mission = missionsData.find((m): m is Mission => m.id === missionId);

  if (!mission) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Mission introuvable</h1>
          <p className="text-gray-400 mb-4">La mission demandée n'existe pas.</p>
          <button
            onClick={() => router.push('/adherent/mission-page')}
            className="px-6 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retour aux missions
          </button>
        </div>
      </div>
    );
  }

  // ✅ Contenu protégé - affiché uniquement si autorisé
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

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-24 right-4 z-[9999] animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">Réservation confirmée !</p>
              <p className="text-sm">Vous allez être redirigé...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-20">
        {/* Map Section */}
        
        {/* Mission Details */}
        <MissionDetails
          mission={mission}
          onBack={() => router.back()}
          onReserve={handleReserve}
        />
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        mission={mission}
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onConfirm={handleConfirmReservation}
        estimatedDuration={estimatedDuration}
      />

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
