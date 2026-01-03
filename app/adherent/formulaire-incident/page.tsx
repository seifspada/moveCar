"use client";

import { useState, useCallback, useMemo } from "react";
import { Camera, AlertTriangle, X } from "lucide-react";
import ProfileHeader from "@/components/mission-components/ProfileHeader";
import GPSLocationButton from "@/app/components/GPSLocationButton";
import SidebarAdherent from "@/app/components/sideBarAdherent";

// Types
enum TypeIncident {
  CREVAISON = "CREVAISON",
  PANNE_MOTEUR = "PANNE_MOTEUR",
  ACCIDENT = "ACCIDENT"
}

interface CoordonneesGPS {
  latitude: number;
  longitude: number;
}

// Configuration centralisée des labels d'incidents
const INCIDENT_LABELS: Record<TypeIncident, string> = {
  [TypeIncident.CREVAISON]: "Crevaison",
  [TypeIncident.PANNE_MOTEUR]: "Panne moteur",
  [TypeIncident.ACCIDENT]: "Accident"
};

// Composant Input réutilisable
const Input = ({ 
  label, 
  value, 
  onChange, 
  readOnly = false, 
  type = "text", 
  placeholder = "" 
}: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
    />
  </div>
);

export default function FormulaireIncident() {
  // États groupés logiquement
  const [numeroMission] = useState("M-2024-001");
  const [villeDepart] = useState("Paris");
  const [villeArrivee] = useState("Lyon");
  const [heureArriveePrevue] = useState("14:30");
  const [heureArriveeEstimee, setHeureArriveeEstimee] = useState("15:45");
  const [position, setPosition] = useState<CoordonneesGPS>({ latitude: 0, longitude: 0 });
  const [numeroRC, setNumeroRC] = useState("");
  const [typesIncident, setTypesIncident] = useState<TypeIncident[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  // Toggle des checkboxes optimisé
  const handleCheckboxChange = useCallback((type: TypeIncident) => {
    setTypesIncident(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Upload de photos optimisé avec Promise.all
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const readFiles = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        // Validation taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error("Fichier trop volumineux (max 5MB)"));
          return;
        }

        // Validation type
        if (!file.type.startsWith('image/')) {
          reject(new Error("Format non supporté"));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error("Erreur de lecture"));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles)
      .then(results => setPhotos(prev => [...prev, ...results]))
      .catch((error) => alert(error.message || "Erreur lors du chargement des photos"));
  }, []);

  // Suppression de photo optimisée
  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Validation et envoi
  const handleValider = useCallback(() => {
    // Validation complète
    if (!numeroRC.trim()) {
      alert("⚠️ Veuillez renseigner le numéro RC");
      return;
    }
    if (typesIncident.length === 0) {
      alert("⚠️ Veuillez sélectionner au moins un type d'incident");
      return;
    }
    if (position.latitude === 0 && position.longitude === 0) {
      alert("⚠️ Veuillez localiser la position de l'incident");
      return;
    }

    const incident = {
      numeroMission,
      villeDepart,
      villeArrivee,
      heureArriveePrevue,
      heureArriveeEstimee,
      position,
      numeroRC,
      typesIncident,
      photos,
      dateIncident: new Date().toISOString()
    };

    console.log("Incident signalé:", incident);
    alert("✅ L'incident a été signalé et envoyé par mail aux responsables.");
    
    // Reset du formulaire
    setNumeroRC("");
    setTypesIncident([]);
    setPhotos([]);
    setPosition({ latitude: 0, longitude: 0 });
    setHeureArriveeEstimee("15:45");
  }, [numeroMission, villeDepart, villeArrivee, heureArriveePrevue, heureArriveeEstimee, position, numeroRC, typesIncident, photos]);

  const handleAnnuler = useCallback(() => {
    if (confirm("Voulez-vous vraiment annuler ? Les données ne seront pas sauvegardées.")) {
      setNumeroRC("");
      setTypesIncident([]);
      setPhotos([]);
      setPosition({ latitude: 0, longitude: 0 });
      setHeureArriveeEstimee("15:45");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-6 lg:px-10 lg:py-8">
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
      
      <div className="max-w-4xl mx-auto pt-4 sm:pt-6 md:pt-8 lg:pt-12">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-xl p-4 sm:p-5 md:p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Signaler un Incident</h1>
          </div>
          <p className="text-white/80 mt-2 text-xs sm:text-sm">
            Tout incident doit être signalé conformément au règlement convoyeur et au contrat de convoyage.
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-800 rounded-b-xl p-4 sm:p-5 md:p-6 shadow-2xl">
          <div className="space-y-5 sm:space-y-6">
            {/* Informations Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Input label="Numéro de mission" value={numeroMission} readOnly />
              <Input 
                label="Numéro RC circulation" 
                value={numeroRC}  readOnly
              
              />
            </div>

            {/* Villes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Input label="Ville de départ" value={villeDepart} readOnly />
              <Input label="Ville d'arrivée" value={villeArrivee} readOnly />
            </div>

            {/* Heures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <Input label="Heure d'arrivée prévue" value={heureArriveePrevue} type="time" readOnly />
              <Input 
                label="Heure d'arrivée estimée" 
                value={heureArriveeEstimee} 
                onChange={(e: any) => setHeureArriveeEstimee(e.target.value)}
                type="time"
              />
            </div>

            {/* Composant GPS Indépendant */}
            <GPSLocationButton 
              position={position}
              onPositionChange={setPosition}
            />

            {/* Type d'incident */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Objet de l'incident
              </label>
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(INCIDENT_LABELS).map(([type, label]) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={typesIncident.includes(type as TypeIncident)}
                      onChange={() => handleCheckboxChange(type as TypeIncident)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 bg-gray-600 border-gray-500 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-white font-medium text-sm sm:text-base">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prendre une photo
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-center gap-3 p-5 sm:p-6 bg-gray-700 border-2 border-dashed border-gray-600 rounded-full cursor-pointer hover:bg-gray-600 transition-colors">
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <span className="text-white font-medium text-sm sm:text-base">Ajouter des photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-28 sm:h-32 object-cover rounded-full"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors opacity-90 group-hover:opacity-100"
                          aria-label="Supprimer la photo"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Avertissement */}
            <div className="bg-orange-900/30 border border-orange-600 rounded-full p-3 sm:p-4">
              <p className="text-orange-200 text-xs sm:text-sm">
                ⚠️ Le formulaire sera envoyé par mail à l'application et aux responsables arrivée/départ du donneur d'ordre.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
              <button
                onClick={handleAnnuler}
                className="flex-1 px-5 py-3 sm:px-6 sm:py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-colors text-sm sm:text-base"
              >
                Annuler
              </button>
              <button
                onClick={handleValider}
                className="flex-1 px-5 py-3 sm:px-6 sm:py-4 bg-orange-600 hover:bg-green-600 text-white rounded-full font-bold transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                Valider et Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}