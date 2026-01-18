'use client'

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarAdherent from '@/app/components/sideBarAdherent';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
import { missionsData } from '@/app/data/missions';
import { departsEnCours, DepartMission, departHelpers } from '@/app/data/departMission';
import RouteTracker from '@/components/mission-components/MissionTruck/RouteTracker';
import { useRoleProtection } from '@/app/hooks/userRoleProtection';

export default function SuivieMissionPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = Number(params.id);

  // ✅ Protection du rôle adherent
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ['adherent']
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  // ✅ Afficher un loader pendant la vérification d'autorisation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-slate-700">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // ✅ Ne rien afficher si pas autorisé (redirection en cours)
  if (!isAuthorized) {
    return null;
  }

  // ✅ Après autorisation, récupérer les données de la mission
  const mission = missionsData.find(m => m.id === missionId);
  const departMission = departHelpers.getByMission(missionId);

  // 🔍 DEBUG - Afficher dans la console
  useEffect(() => {
    console.log('==========================================');
    console.log('📊 ÉTAT ACTUEL SUIVIE MISSION:');
    console.log('missionId:', missionId);
    console.log('mission trouvée:', mission ? 'OUI' : 'NON');
    console.log('mission?.etatMission:', mission?.etatMission);
    console.log('departMission trouvé:', departMission ? 'OUI' : 'NON');
    console.log('departMission?.id:', departMission?.id);
    console.log('departMission?.toutComplet:', departMission?.toutComplet);
    console.log('departMission?.pourcentageProgression:', departMission?.pourcentageProgression);
    console.log('==========================================');
  }, [missionId, mission, departMission]);

  // Vérifications et redirections
  useEffect(() => {
    console.log('🔍 Vérification des conditions...');

    // 1. Vérifier si la mission existe
    if (!mission) {
      console.log('❌ Mission introuvable, redirection...');
      router.push('/adherent/mission-page');
      return;
    }

    // 2. Vérifier si la mission est en cours
    if (mission.etatMission !== 'en_cours') {
      console.log('⚠️ Mission pas en cours:', mission.etatMission);
      console.log('Redirection vers liste missions...');
      router.push(`/adherent/mission-page?id=${missionId}`);
      return;
    }

    // 3. Vérifier si le départ existe
    if (!departMission) {
      console.log('❌ Pas de DepartMission trouvé');
      console.log('Redirection vers page de départ...');
      router.push(`/adherent/depart-mission/${missionId}`);
      return;
    }

    // 4. Vérifier si le départ est complet
    if (!departMission.toutComplet) {
      console.log('⚠️ Départ non complet');
      console.log('Progression:', departMission.pourcentageProgression + '%');
      console.log('Étape 1:', departMission.etape1Complete);
      console.log('Étape 2:', departMission.etape2Complete);
      console.log('Étape 3:', departMission.etape3Complete);
      console.log('Étape 4:', departMission.etape4Complete);
      console.log('Redirection vers page de départ...');
      router.push(`/adherent/depart-mission/${missionId}`);
      return;
    }

    console.log('✅ Toutes les conditions remplies !');
    console.log('→ Affichage du tracker de mission');
  }, [mission, departMission, missionId, router]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleMissionComplete = (missionId: number, tempsTotal: number) => {
    console.log(`✅ Mission ${missionId} terminée en ${tempsTotal} secondes`);

    // Ici vous pouvez mettre à jour le statut dans departsEnCours
    // Pour l'instant, on redirige simplement
    router.push(`/adherent/mission-page?id=${missionId}&completed=true`);
  };

  // Si pas de mission
  if (!mission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <p className="text-lg text-slate-600 mb-4">Mission introuvable (ID: {missionId})</p>
          <button
            onClick={() => router.push('/adherent/mission-page')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour aux missions
          </button>
        </div>
      </div>
    );
  }

  // ✅ Contenu protégé - affiché uniquement si autorisé
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bandeau DEBUG */}
      <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-b-2 border-yellow-400 p-3 text-xs font-mono shadow-sm">
        <div className="container mx-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-yellow-800">🔍 DEBUG:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-700">Mission:</span>
            <span className="font-semibold text-yellow-900">#{missionId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-700">État:</span>
            <span className={`font-semibold px-2 py-1 rounded ${
              mission.etatMission === 'en_cours' 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {mission.etatMission}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-700">DepartMission:</span>
            <span className={`font-semibold px-2 py-1 rounded ${
              departMission 
                ? 'bg-green-200 text-green-800' 
                : 'bg-red-200 text-red-800'
            }`}>
              {departMission ? `ID ${departMission.id}` : 'NON TROUVÉ'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-700">Complet:</span>
            <span className={`font-semibold px-2 py-1 rounded ${
              departMission?.toutComplet 
                ? 'bg-green-200 text-green-800' 
                : 'bg-orange-200 text-orange-800'
            }`}>
              {departMission?.toutComplet ? 'OUI ✓' : 'NON ✗'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-700">Progression:</span>
            <span className="font-semibold text-yellow-900">
              {departMission?.pourcentageProgression || 0}%
            </span>
          </div>
        </div>
      </div>

      <SidebarAdherent
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />

      <div className={`transition-all duration-300 ${
        isDesktopMenuOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        <ProfileHeader
          isMobileMenuOpen={isMobileMenuOpen}
          isDesktopMenuOpen={isDesktopMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          toggleDesktopMenu={toggleDesktopMenu}
        />

        <main className="p-4 md:p-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <button 
                onClick={() => router.push('/adherent/mission-page')}
                className="hover:text-blue-600 transition-colors"
              >
                Mes missions
              </button>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Suivi en temps réel</span>
            </nav>
          </div>

          {/* En-tête mission */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Mission #{mission.id}
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    {mission.villeDepart} → {mission.villeArrivee}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    En cours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RouteTracker */}
          <RouteTracker
            mission={mission}
            departMission={departMission || null}
            onMissionComplete={handleMissionComplete}
            className="max-w-4xl mx-auto"
          />
        </main>
      </div>
    </div>
  );
}
