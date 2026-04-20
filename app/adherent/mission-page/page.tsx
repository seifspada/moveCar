// app/adherent/mission-page/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MissionList from "@/components/mission-components/MissionList";
import SearchBar from "@/components/mission-components/RrechercheBar";
import Pagination from "@/components/mission-components/Pagination";
import { SearchFilter } from "@/components/mission-components/SearchFilter";
import { Filter, X, MapPin, Route } from "lucide-react";
import { 
  useSearchMissions, 
  useSearchMissionsByPosition,
  useSearchMissionsByTrajet
} from "@/app/hooks/userSearchMissions";
import { useMissions } from "@/app/hooks/useMissions";
import { MissionDetails } from "@/app/types/mission";

export default function MissionsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [userId, setUserId] = useState<number>(1);

  // Type de recherche active
  const [searchMode, setSearchMode] = useState<"text" | "position" | "trajet">("text");

  // État pour recherche position
  const [positionCity, setPositionCity] = useState<string>("");
  const [positionRadius, setPositionRadius] = useState<number>(0);

  // État pour recherche trajet
  const [trajetDepart, setTrajetDepart] = useState<string>("");
  const [trajetArrivee, setTrajetArrivee] = useState<string>("");
  const [trajetRadius, setTrajetRadius] = useState<number>(0);

  // ✅ Missions par défaut (non réservées / confirmées pour l’adhérent)
  const {
    missions: defaultMissions,
    loading: defaultLoading,
    error: defaultError,
  } = useMissions();

  // Hook pour recherche texte (paginated)
  const { 
    missions: textMissions, 
    loading: textLoading, 
    error: textError, 
    total: textTotal, 
    totalPages: textTotalPages 
  } = useSearchMissions(
    debouncedSearch,
    currentPage,
    20
  );

  // Hook pour recherche position
  const { 
    search: searchByPosition,
    missions: positionMissions, 
    loading: positionLoading, 
    error: positionError,
    total: positionTotal, 
    totalPages: positionTotalPages 
  } = useSearchMissionsByPosition();

  // Hook pour recherche trajet
  const { 
    search: searchByTrajet,
    missions: trajetMissions, 
    loading: trajetLoading, 
    error: trajetError,
    total: trajetTotal, 
    totalPages: trajetTotalPages 
  } = useSearchMissionsByTrajet();

  // ✅ Est-ce qu'une recherche texte est vraiment active ?
  const isTextSearchActive =
    searchMode === "text" && debouncedSearch.trim() !== "";

  // ✅ Choisir quelle source afficher selon le mode
  const missions: MissionDetails[] =
    searchMode === "trajet"
      ? trajetMissions
      : searchMode === "position"
      ? positionMissions
      : isTextSearchActive
      ? textMissions
      : defaultMissions;

  const total =
    searchMode === "trajet"
      ? trajetTotal
      : searchMode === "position"
      ? positionTotal
      : isTextSearchActive
      ? textTotal
      : defaultMissions.length;

  const totalPages =
    searchMode === "trajet"
      ? trajetTotalPages
      : searchMode === "position"
      ? positionTotalPages
      : isTextSearchActive
      ? textTotalPages
      : 1;

  const missionsLoading =
    searchMode === "trajet"
      ? trajetLoading
      : searchMode === "position"
      ? positionLoading
      : isTextSearchActive
      ? textLoading
      : defaultLoading;

  const error =
    searchMode === "trajet"
      ? trajetError
      : searchMode === "position"
      ? positionError
      : isTextSearchActive
      ? textError
      : defaultError;

  // Debounce pour la recherche texte
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
      // Reset autres recherches si on tape du texte
      if (searchQuery && searchMode !== "text") {
        setSearchMode("text");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchMode]);

  // Scroll vers le haut quand on change de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const checkAuth = () => {
      const role = localStorage.getItem("role");

      if (!role) {
        router.push("/auth/login");
        return;
      }

      if (role !== "adherent") {
        const roleRedirects: Record<string, string> = {
          partenaire: "/partenaire/acceuil",
          admin: "/admin/overview",
          manager: "/manager/home",
        };
        router.push(roleRedirects[role] || "/login");
        return;
      }

      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(Number(storedUserId));
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen((prev) => !prev);

  // Handler pour recherche trajet depuis SearchFilter
  const handleFilterSearch = async (data: any) => {
    console.log("🔍 Recherche avec filtres:", data);

    // Si les 2 villes sont présentes, c'est une recherche trajet
    if (data.villeDepart && data.villeArrivee) {
      try {
        await searchByTrajet(
          {
            villeDepartNom: data.villeDepart.name,
            latitudeDepart: data.villeDepart.lat,
            longitudeDepart: data.villeDepart.lon,
            villeArriveeNom: data.villeArrivee.name,
            latitudeArrivee: data.villeArrivee.lat,
            longitudeArrivee: data.villeArrivee.lon,
            rayon: data.rayon,
            dateDepart: data.dateDepart || undefined,
            dateDepartMax: data.dateDepartMax || undefined,
          },
          1,
          20
        );

        // Activer le mode trajet
        setSearchMode("trajet");
        setTrajetDepart(data.villeDepart.name);
        setTrajetArrivee(data.villeArrivee.name);
        setTrajetRadius(data.rayon);
        setCurrentPage(1);
        setSearchQuery(""); // Reset recherche texte
      } catch (error) {
        console.error("❌ Erreur recherche trajet:", error);
      }
    }
  };

  // Handler pour recherche position depuis SearchBar
  const handlePositionSearch = async (data: {
    city: any;
    radius: number;
  }) => {
    console.log("🔍 Lancement recherche position:", data);

    try {
      await searchByPosition(
        data.city.name,
        data.city.lat,
        data.city.lon,
        data.radius,
        1,
        20
      );

      // Activer le mode position
      setSearchMode("position");
      setPositionCity(data.city.name);
      setPositionRadius(data.radius);
      setCurrentPage(1);
      setSearchQuery("");
    } catch (error) {
      console.error("❌ Erreur recherche position:", error);
    }
  };

  // Réinitialiser toutes les recherches
  const clearSearch = () => {
    setSearchMode("text");
    setPositionCity("");
    setPositionRadius(0);
    setTrajetDepart("");
    setTrajetArrivee("");
    setTrajetRadius(0);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-medium">Chargement</p>
          <p className="text-gray-500 text-sm mt-1">
            Vérification de votre accès...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <main className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
              <p className="text-red-400">
                Erreur de chargement : {error.message}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Barre de recherche */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                onSearch={setSearchQuery}
                onPositionSearch={handlePositionSearch}
                userId={userId}
              />
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-shrink-0 p-3 hover:bg-zinc-800 rounded-lg transition-colors -mt-7"
              aria-label="Filtres"
            >
              <Filter className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Badge recherche position active */}
          {searchMode === "position" && positionCity && (
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span className="text-white text-sm">
                Missions près de <strong>{positionCity}</strong> (rayon:{" "}
                {positionRadius} km)
              </span>
              <button
                onClick={clearSearch}
                className="ml-auto p-1 hover:bg-orange-500/20 rounded-full transition-colors"
                aria-label="Effacer le filtre"
              >
                <X className="w-4 h-4 text-orange-500" />
              </button>
            </div>
          )}

          {/* Badge recherche trajet active */}
          {searchMode === "trajet" && trajetDepart && trajetArrivee && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3">
              <Route className="w-5 h-5 text-blue-500" />
              <span className="text-white text-sm">
                Trajet <strong>{trajetDepart}</strong> →{" "}
                <strong>{trajetArrivee}</strong> (rayon: {trajetRadius} km)
              </span>
              <button
                onClick={clearSearch}
                className="ml-auto p-1 hover:bg-blue-500/20 rounded-full transition-colors"
                aria-label="Effacer le filtre"
              >
                <X className="w-4 h-4 text-blue-500" />
              </button>
            </div>
          )}

          {/* Nombre de résultats */}
          {!missionsLoading && (
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                {total} mission{total > 1 ? "s" : ""} trouvée
                {total > 1 ? "s" : ""}
                {debouncedSearch && ` pour "${debouncedSearch}"`}
              </p>
              <p className="text-gray-500 text-sm">
                Page {currentPage} sur {totalPages}
              </p>
            </div>
          )}

          {/* Liste des missions avec skeleton */}
          {missionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-zinc-900 rounded-full border-2 border-zinc-800 overflow-hidden animate-pulse"
                >
                  <div className="flex flex-row items-center h-24 md:h-32 gap-4 p-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-700 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="h-4 bg-zinc-700 rounded w-24"></div>
                        <div className="h-4 bg-zinc-700 rounded w-8"></div>
                        <div className="h-4 bg-zinc-700 rounded w-24"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-3 bg-zinc-700 rounded w-16"></div>
                        <div className="h-3 bg-zinc-700 rounded w-20"></div>
                        <div className="h-3 bg-zinc-700 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="w-24 h-16 bg-zinc-700 rounded-lg flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <MissionList missions={missions} />
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={missionsLoading}
          />
        </div>
      </main>

      <SearchFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onSearch={handleFilterSearch}
        userId={userId}
      />
    </div>
  );
}