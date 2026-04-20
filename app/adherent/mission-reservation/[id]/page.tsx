

// app/adherent/mission-reservation/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MissionDetails from '@/components/mission-components/MissionDetails';
import ProfileHeader from '@/components/mission-components/ProfileHeaderAdherent';
import SidebarAdherent from '@/components/mission-components/SideBarAdherent';
import ReservationModal, { ReservationData } from '@/components/mission-components/ReservationModal';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useMissionDetails } from '@/app/hooks/useMissionDetails';
import { toast } from 'sonner'; // ✅ AJOUT

export default function MissionReservationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();
  
  const { mission, loading, error } = useMissionDetails();

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
    
    // ✅ AJOUT : Toast de succès
    toast.success('Demande de réservation envoyée !', {
      description: 'Vous recevrez une notification dès validation',
      duration: 5000,
    });
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-500" />
          <p>Chargement de la mission...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Erreur de chargement</h1>
          <p className="text-gray-400 mb-4">{error.message}</p>
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

  if (!mission) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <h1 className="text-2xl font-bold mb-2">Mission introuvable</h1>
          <p className="text-gray-400 mb-4">La mission demandée n'existe pas ou a été supprimée.</p>
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

  return (
    <div className="min-h-screen bg-black">
     

    
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 mt-20">
        <MissionDetails
          mission={mission}
          onBack={() => router.back()}
          onReserve={handleReserve}
        />
      </div>

      <ReservationModal
        mission={mission}
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onConfirm={handleConfirmReservation}
        estimatedDuration={estimatedDuration}
      />
    </div>
  );
}