'use client';
import { useState } from 'react';

import AgenceModal from '@/components/partenaire-components/add-agence-component/AgenceModal';
import AgenceList from '@/components/partenaire-components/add-agence-component/AgenceList';

export default function AgencesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false); // ✅ fermé par défaut
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleMobileMenu  = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen((prev) => !prev);

  const handleAgenceCreated = () => {
    setShowModal(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-900">
  

      <div className="pt-20 md:pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto">

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-1 h-7 rounded-full bg-orange-600" />
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Mes Agences
                </h1>
              </div>
              <p className="text-sm text-zinc-500 ml-3.5">
                Gérez les agences de votre organisation
              </p>
            </div>

            {/* ✅ Bouton unique ici — dans le header de la page */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white
                         px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                         shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30
                         hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle agence
            </button>
          </div>

          {/* ✅ Liste — sans onNewAgence */}
          <AgenceList refreshTrigger={refreshTrigger} />

        </div>
      </div>

      {/* Modal */}
      <AgenceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAgenceCreated}
      />
    </div>
  );
}
