// app/adherent/mission-page/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SidebarAdherent from "@/app/components/sideBarAdherent";
import { missionsData } from "@/app/data/missions";
import { Mission } from "@/app/data/missions";
import MissionList from "@/components/mission-components/MissionList";
import ProfileHeader from "@/components/mission-components/ProfileHeader";
import SearchBar from "@/components/mission-components/RrechercheBar";
import { SearchFilter } from "@/components/mission-components/SearchFilter";
import { Filter } from "lucide-react";
import { useMemo } from "react";

export default function MissionsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

// app/adherent/mission-page/page.tsx

useEffect(() => {
  const checkAuth = () => {
    // ✅ LIRE LE RÔLE DEPUIS LOCALSTORAGE
    const role = localStorage.getItem('role');
    
    console.log("🔐 Page - Vérification auth - Rôle:", role);

    if (!role) {
      console.log("❌ Pas de rôle - Redirection vers /login");
      router.push('/auth/login');
      return;
    }

    if (role !== 'adherent') {
      console.log("❌ Rôle non autorisé:", role);
      const roleRedirects: Record<string, string> = {
        partenaire: '/partenaire/dashboard',
        admin: '/admin/overview',
        manager: '/manager/home',
      };
      router.push(roleRedirects[role] || '/login');
      return;
    }

    console.log("✅ Accès autorisé - Affichage du contenu");
    setIsAuthorized(true);
    setIsLoading(false);
  };

  checkAuth();
}, [router]);

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
  };

  const handleFilterSearch = (data: any) => {
    console.log("Recherche avec filtres:", data);
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

  // ✅ Si pas autorisé, ne rien afficher (redirection en cours)
 
  if (!isAuthorized) {
    return null;
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

      <main className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-shrink-0 p-3 hover:bg-zinc-800 rounded-lg transition-colors -mt-7"
              aria-label="Filtres"
            >
              <Filter className="w-7 h-7 text-white" />
            </button>
          </div>
          
          <MissionList missions={filteredMissions} />
        </div>
      </main>

      <SearchFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSearch={handleFilterSearch}
      />
    </div>
  );
}
