"use client";

import { useState, useCallback, useMemo } from "react";
import { Camera, MapPin, AlertTriangle, X } from "lucide-react";

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
const Input = ({ label, value, onChange, readOnly = false, type = "text", placeholder = "" }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
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
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  // Mémoisation du format GPS pour éviter les recalculs
  const positionFormatted = useMemo(
    () => `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`,
    [position]
  );

  // Toggle des checkboxes optimisé
  const handleCheckboxChange = useCallback((type: TypeIncident) => {
    setTypesIncident(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Géolocalisation optimisée avec gestion d'état
  const handleGetPosition = useCallback(() => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée");
      return;
    }

    setIsLoadingPosition(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setIsLoadingPosition(false);
      },
      () => {
        alert("Impossible d'obtenir la position GPS");
        setIsLoadingPosition(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
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
          reject(new Error("Fichier trop volumineux"));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles)
      .then(results => setPhotos(prev => [...prev, ...results]))
      .catch(() => alert("Erreur lors du chargement des photos"));
  }, []);

  // Suppression de photo optimisée
  const removePhoto = useCallback((index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Validation et envoi
  const handleValider = useCallback(() => {
    // Validation simple
    if (!numeroRC.trim()) {
      alert("Veuillez renseigner le numéro RC");
      return;
    }
    if (typesIncident.length === 0) {
      alert("Veuillez sélectionner au moins un type d'incident");
      return;
    }
    if (position.latitude === 0 && position.longitude === 0) {
      alert("Veuillez localiser la position de l'incident");
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
    alert("L'incident a été signalé et envoyé par mail aux responsables.");
    
    // Reset du formulaire
    setNumeroRC("");
    setTypesIncident([]);
    setPhotos([]);
    setPosition({ latitude: 0, longitude: 0 });
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Signaler un Incident</h1>
          </div>
          <p className="text-white/80 mt-2 text-sm">
            Tout incident doit être signalé conformément au règlement convoyeur et au contrat de convoyage.
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-800 rounded-b-xl p-6 shadow-2xl">
          <div className="space-y-6">
            {/* Informations Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 placeholder-gray-500">
              <Input label="Numéro de mission" value={numeroMission} readOnly />
              <Input 
                label="Numéro RC circulation" 
                value={numeroRC} 
                onChange={(e: any) => setNumeroRC(e.target.value)}
                placeholder="Ex: RC-2024-12345"
              />
            </div>

            {/* Villes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 placeholder-gray-500">
              <Input label="Ville de départ" value={villeDepart} readOnly />
              <Input label="Ville d'arrivée" value={villeArrivee} readOnly />
            </div>

            {/* Heures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 placeholder-gray-500">
              <Input label="Heure d'arrivée prévue" value={heureArriveePrevue} type="time" readOnly />
              <Input 
                label="Heure d'arrivée estimée" 
                value={heureArriveeEstimee} 
                onChange={(e: any) => setHeureArriveeEstimee(e.target.value)}
                type="time"
              />
            </div>

            {/* Position GPS */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position de l'incident (coordonnées GPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={positionFormatted}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  readOnly
                />
                <button
                  onClick={handleGetPosition}
                  disabled={isLoadingPosition}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  {isLoadingPosition ? "..." : "Localiser"}
                </button>
              </div>
            </div>

            {/* Type d'incident */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Objet de l'incident
              </label>
              <div className="space-y-3">
                {Object.entries(INCIDENT_LABELS).map(([type, label]) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={typesIncident.includes(type as TypeIncident)}
                      onChange={() => handleCheckboxChange(type as TypeIncident)}
                      className="w-5 h-5 text-orange-600 bg-gray-600 border-gray-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-white font-medium">{label}</span>
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
                <label className="flex items-center justify-center gap-3 p-6 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <Camera className="w-6 h-6 text-orange-500" />
                  <span className="text-white font-medium">Ajouter des photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                          aria-label="Supprimer la photo"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Avertissement */}
            <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-4">
              <p className="text-orange-200 text-sm">
                ⚠️ Le formulaire sera envoyé par mail à l'application et aux responsables arrivée/départ du donneur d'ordre.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAnnuler}
                className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleValider}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-bold transition-all transform hover:scale-105"
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