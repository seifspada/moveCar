
'use client'

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, StopCircle, CheckCircle } from 'lucide-react';
import ArretMissionModal from './ArretMissionModal';
import { Mission, EtatMission } from '@/app/data/missions';
import { DepartMission } from '@/app/data/departMission';

interface RouteTrackerProps {
  mission?: Mission;
  departMission?: DepartMission | null;  // 🔹 FIX: Ajouter "| null"
  onMissionComplete: (missionId: number, tempsTotal: number) => void;
  className?: string;
}

const RouteTracker: React.FC<RouteTrackerProps> = ({ 
  mission, 
  departMission,
  onMissionComplete,
  className = ""
}) => {
  const [tempsEcoule, setTempsEcoule] = useState(0);
  const [showArretModal, setShowArretModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculer km parcourus basé sur le temps écoulé (vitesse moyenne 80 km/h)
  const kmParcourus = departMission 
    ? Math.round((tempsEcoule / 3600) * 80)
    : 0;

  const kmRestants = mission ? Math.max(0, mission.nbKm - kmParcourus) : 0;

  // Vérifier si mission existe
  if (!mission) {
    return (
      <div className={`bg-white rounded-2xl p-12 shadow-lg text-center ${className}`}>
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune mission en cours</h3>
        <p className="text-slate-600">Sélectionnez une mission pour commencer le suivi</p>
      </div>
    );
  }

  // Vérifier que toutes les étapes de départ sont complètes
  if (departMission && !departMission.toutComplet) {
    return (
      <div className={`bg-white rounded-2xl p-12 shadow-lg text-center border-2 border-orange-200 ${className}`}>
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-10 h-10 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          Mission en préparation
        </h3>
        <p className="text-slate-600 mb-6">
          Veuillez compléter toutes les étapes de départ avant de démarrer la mission
        </p>
        <div className="max-w-xs mx-auto mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progression</span>
            <span className="font-bold text-orange-600">{departMission.pourcentageProgression}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${departMission.pourcentageProgression}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-slate-500 space-y-1">
          <p className={departMission.etape1Complete ? "text-green-600 font-semibold" : ""}>
            {departMission.etape1Complete ? "✓" : "○"} Étape 1: Instructions
          </p>
          <p className={departMission.etape2Complete ? "text-green-600 font-semibold" : ""}>
            {departMission.etape2Complete ? "✓" : "○"} Étape 2: Reconnaissance adhérent
          </p>
          <p className={departMission.etape3Complete ? "text-green-600 font-semibold" : ""}>
            {departMission.etape3Complete ? "✓" : "○"} Étape 3: État des lieux
          </p>
          <p className={departMission.etape4Complete ? "text-green-600 font-semibold" : ""}>
            {departMission.etape4Complete ? "✓" : "○"} Étape 4: Signatures
          </p>
        </div>
      </div>
    );
  }

  // Calculer le temps estimé (basé sur 80 km/h)
  const tempsEstime = Math.round((mission.nbKm / 80) * 3600);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const tempsRestant = Math.max(tempsEstime - tempsEcoule, 0);
  const progression = Math.min((tempsEcoule / tempsEstime) * 100, 100);

  // Décompteur automatique
  useEffect(() => {
    if (mission.etatMission !== "en_cours" || isCompleted) return;

    const interval = setInterval(() => {
      setTempsEcoule(prev => {
        const newTime = prev + 1;

        if (newTime >= tempsEstime) {
          setIsCompleted(true);
          return tempsEstime;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mission.etatMission, tempsEstime, isCompleted]);

  const handleArretConfirm = async () => {
    setIsCompleted(true);
    setShowArretModal(false);

    if (departMission) {
      const kmFinal = departMission.etape3_kilometrage + mission.nbKm;

      try {
        await fetch('/api/mission-arret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            departMissionId: departMission.id,
            missionId: mission.id,
            kmFinal: kmFinal,
            kmParcourus: mission.nbKm,
            tempsTotal: tempsEcoule,
            dateHeureFin: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Erreur sauvegarde arrêt mission:', error);
      }
    }

    onMissionComplete(mission.id, tempsEcoule);
  };

  if (isCompleted) {
    return (
      <div className={`bg-white rounded-2xl p-8 shadow-lg border-2 border-green-200 ${className}`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Mission terminée !</h2>
          <p className="text-lg text-slate-600 mb-8">
            Trajet {mission.villeDepart} → {mission.villeArrivee} complété avec succès
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">Distance parcourue</p>
              <p className="text-4xl font-bold text-blue-900">{mission.nbKm}</p>
              <p className="text-sm text-blue-700 mt-1">kilomètres</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-green-700 mb-2">Temps total</p>
              <p className="text-4xl font-bold text-green-900">{formatDuration(tempsEcoule)}</p>
              <p className="text-sm text-green-700 mt-1">durée réelle</p>
            </div>
          </div>

          {departMission && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-lg mx-auto">
              <p className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Résumé du trajet
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Kilométrage départ</p>
                  <p className="text-lg font-bold text-slate-900">{departMission.etape3_kilometrage} km</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Kilométrage arrivée</p>
                  <p className="text-lg font-bold text-slate-900">
                    {departMission.etape3_kilometrage + mission.nbKm} km
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Carburant départ</p>
                  <p className="text-lg font-bold text-blue-600">{departMission.etape3_niveauCarburant}%</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Vitesse moyenne</p>
                  <p className="text-lg font-bold text-orange-600">
                    {Math.round((mission.nbKm / tempsEcoule) * 3600)} km/h
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 ${className}`}>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
          Suivi de mission en cours
        </h2>

        {departMission && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              DONNÉES EN TEMPS RÉEL
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white bg-opacity-70 rounded-lg p-3">
                <p className="text-xs text-blue-700 mb-1 font-semibold">Km départ</p>
                <p className="text-xl font-bold text-blue-900">{departMission.etape3_kilometrage}</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-lg p-3">
                <p className="text-xs text-blue-700 mb-1 font-semibold">Carburant départ</p>
                <p className="text-xl font-bold text-blue-900">{departMission.etape3_niveauCarburant}%</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-lg p-3">
                <p className="text-xs text-green-700 mb-1 font-semibold">Km parcourus</p>
                <p className="text-xl font-bold text-green-600">{kmParcourus} km</p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-lg p-3">
                <p className="text-xs text-orange-700 mb-1 font-semibold">Km restants</p>
                <p className="text-xl font-bold text-orange-600">{kmRestants} km</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Départ</p>
              <p className="text-xl font-bold text-slate-900">{mission.villeDepart}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">{mission.nbKm} km</span>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-slate-500 text-right">Arrivée</p>
              <p className="text-xl font-bold text-slate-900 text-right">{mission.villeArrivee}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Navigation className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-900">
            💡 <strong>Durée estimée :</strong> {formatDuration(tempsEstime)} (basée sur 80 km/h en moyenne)
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progression</span>
            <span className="font-semibold">{progression.toFixed(1)}%</span>
          </div>
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progression}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Temps écoulé</span>
            </div>
            <p className="text-4xl font-bold text-blue-600 font-mono">{formatTime(tempsEcoule)}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Temps restant</span>
            </div>
            <p className="text-4xl font-bold text-orange-600 font-mono">{formatTime(tempsRestant)}</p>
          </div>
        </div>

        <button
          onClick={() => setShowArretModal(true)}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <StopCircle className="w-6 h-6" />
          Arrêter la mission
        </button>

        <div className="mt-4 text-center">
          <p className="text-blue-600 font-semibold flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Mission en cours...
          </p>
        </div>
      </div>

      <ArretMissionModal
        isOpen={showArretModal}
        onClose={() => setShowArretModal(false)}
        onConfirm={handleArretConfirm}
        villeDepart={mission.villeDepart}
        villeArrivee={mission.villeArrivee}
        tempsEcoule={tempsEcoule}
      />
    </>
  );
};

export default RouteTracker;