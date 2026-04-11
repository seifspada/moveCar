// app/adherent/compte/page.tsx
"use client";

import { useState } from 'react';
import ProfileHeader from '@/components/mission-components/ProfileHeaderAdherent';
import SidebarAdherent from '@/components/mission-components/SideBarAdherent';
import QuickActions from '@/components/compte-adherent.ts/QuickActions';
import DocumentsSection from '@/components/compte-adherent.ts/DocumentsSection';
import AccountSettings from '@/components/compte-adherent.ts/AccountSettings';
import PasswordChangeForm from '@/components/compte-adherent.ts/forms/PasswordChangeForm';
import Modal from '@/components/compte-adherent.ts/Modal';
import LegalDocuments from '@/components/compte-adherent.ts/LegalDocuments';
import { UserProfile,AdherentDocument } from '@/app/types/compte';
import AdresseForm from '@/components/compte-adherent.ts/forms/AdresseForm';
import TelephoneForm from '@/components/compte-adherent.ts/forms/TelephoneForm';
import RibForm from '@/components/compte-adherent.ts/forms/RibForm';
export default function CompteAdherent() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRibModal, setShowRibModal] = useState(false);
  const [showAdresseModal, setShowAdresseModal] = useState(false);
  const [showTelephoneModal, setShowTelephoneModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    photo: '/placeholder-avatar.jpg',
    nom: 'DUPONT',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    adresse: '12 rue des Lilas, 75001 Paris',
    rib: 'FR76 1234 5678 9012 3456 7890 123'
  });

const [documents] = useState<AdherentDocument[]>([  // ✅
  { nom: 'KBIS', dateExpiration: new Date('2026-06-15'), statut: 'valide' },
  { nom: 'Assurance RC Pro', dateExpiration: new Date('2025-02-10'), statut: 'bientot_expire' },
  { nom: 'Assurance Circulation', dateExpiration: new Date('2026-01-15'), statut: 'expire' }
]);

  return (
    <div className="min-h-screen bg-black min-w-full pb-20">
     
      <div className="max-w-6xl mx-auto space-y-6 pt-10">
        <QuickActions />
        
        <DocumentsSection documents={documents} />

        <div className="grid md:grid-cols-2 gap-6">
          <LegalDocuments />
          
          <AccountSettings
            onPasswordClick={() => setShowPasswordModal(true)}
            onRibClick={() => setShowRibModal(true)}
            onAdresseClick={() => setShowAdresseModal(true)}
            onTelephoneClick={() => setShowTelephoneModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)} title="Changer mot de passe">
          <PasswordChangeForm onClose={() => setShowPasswordModal(false)} />
        </Modal>
      )}

      {showRibModal && (
        <Modal onClose={() => setShowRibModal(false)} title="Modifier RIB">
          <RibForm currentRib={userProfile.rib} onClose={() => setShowRibModal(false)} />
        </Modal>
      )}

      {showAdresseModal && (
        <Modal onClose={() => setShowAdresseModal(false)} title="Modifier adresse postale">
          <AdresseForm currentAdresse={userProfile.adresse} onClose={() => setShowAdresseModal(false)} />
        </Modal>
      )}

      {showTelephoneModal && (
        <Modal onClose={() => setShowTelephoneModal(false)} title="Modifier téléphone">
          <TelephoneForm currentTelephone={userProfile.telephone} onClose={() => setShowTelephoneModal(false)} />
        </Modal>
      )}
    </div>
  );
}
