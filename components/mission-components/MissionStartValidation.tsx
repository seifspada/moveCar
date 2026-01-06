import React, { useState } from 'react';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Mission, vehicleIcons, vehiculeCarburantIcons } from '@/app/data/missions';

interface MissionDepartureProps {
  mission: Mission;
  onValidate?: () => void;
}

export default function MissionDeparture({ mission, onValidate }: MissionDepartureProps) {
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const instructions = `1. Vérifier l'état général du véhicule avant le départ (carrosserie, pneus, feux)
2. Contrôler le niveau de carburant et le noter
3. Prendre des photos du véhicule (4 angles + compteur kilométrique)
4. Vérifier la présence de tous les documents (carte grise, assurance, contrôle technique)
5. Signaler immédiatement tout dommage ou anomalie constatée
6. Respecter le code de la route et les limitations de vitesse
7. En cas de problème, contacter le responsable avant toute décision`;

  const handleValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      alert('Mission validée ! Statut changé vers "Mission en cours"');
      setIsValidating(false);
      if (onValidate) {
        onValidate();
      }
    }, 1500);
  };

  const vehicleInfo = vehicleIcons[mission.vehicleType];
  const carburantInfo = vehiculeCarburantIcons[mission.typeCarburant];

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Une seule carte blanche pour tout le contenu */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header avec badge orange */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Départ de la mission</h1>
                <p className="text-orange-100 text-sm mt-1">Validation requise avant le démarrage</p>
              </div>
            </div>
          </div>

          {/* Contenu principal - tout dans le même flux */}
          <div className="p-8 space-y-8">
            
            {/* Alert Banner */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-900 font-medium">Mode départ activé</p>
                <p className="text-sm text-amber-700 mt-1">
                  Cette mission passe automatiquement en mode départ 1 à 2 heures avant l'heure prévue.
                </p>
              </div>
            </div>

            {/* Mission Info Summary */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Informations de la mission
              </h2>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Trajet</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {mission.villeDepart} → {mission.villeArrivee}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Véhicule</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{mission.modeleVehicule}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <img src={vehicleInfo.image} alt={vehicleInfo.label} className="w-5 h-5" />
                      <span className="text-sm font-semibold text-slate-900">{vehicleInfo.label}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Carburant</p>
                    <div className="flex items-center gap-2 mt-1">
                      <img src={carburantInfo.image} alt={carburantInfo.label} className="w-5 h-5" />
                      <span className="text-sm font-semibold text-slate-900">{mission.typeCarburant}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200"></div>

            {/* Mission Details */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Détails de la mission
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-medium mb-2">Lieu de départ</p>
                  <p className="text-sm font-semibold text-slate-900">{mission.lieuDepart || mission.villeDepart}</p>
                  {mission.adresseDepartComplete && (
                    <p className="text-xs text-slate-600 mt-1">{mission.adresseDepartComplete}</p>
                  )}
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-medium mb-2">Lieu d'arrivée</p>
                  <p className="text-sm font-semibold text-slate-900">{mission.lieuArrivee || mission.villeArrivee}</p>
                  {mission.adresseArriveeComplete && (
                    <p className="text-xs text-slate-600 mt-1">{mission.adresseArriveeComplete}</p>
                  )}
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-medium mb-2">Distance autorisée</p>
                  <p className="text-lg font-bold text-orange-600">{mission.kmTotalAutorise} km</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase font-medium mb-2">Type de boîte</p>
                  <p className="text-lg font-bold text-slate-900">{mission.typeBoite}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200"></div>

            {/* Conditions financières */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">Conditions financières</h2>
              </div>
              
              <p className="text-sm text-slate-600 mb-5 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                Selon la convention signée entre les parties - Entité: {mission.entite}
              </p>
              
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Dépassement de kilomètres</span>
                  <span className="text-orange-600 font-bold">{mission.tarifDepassementKm.toFixed(2)} € / km</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Retard sans avertissement</span>
                  <span className="text-orange-600 font-bold">{mission.tarifRetardHeure.toFixed(2)} € / h</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Carburant</span>
                  <span className="text-orange-600 font-bold">{mission.tarifCarburant}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Restitution à un autre endroit</span>
                  <span className="text-orange-600 font-bold">{mission.tarifRestitutionAutreEndroit.toFixed(2)} € / km</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-700 font-medium">Annulation</span>
                  <span className="text-orange-600 font-bold">{mission.conditionsAnnulation}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className={`p-4 rounded-xl border-2 ${mission.carburantInclus ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <p className="text-xs font-medium text-slate-600 mb-1">Carburant</p>
                  <p className={`text-base font-bold ${mission.carburantInclus ? 'text-green-700' : 'text-red-700'}`}>
                    {mission.carburantInclus ? '✓ Inclus' : '✗ Non inclus'}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border-2 ${mission.peagesInclus ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <p className="text-xs font-medium text-slate-600 mb-1">Péages</p>
                  <p className={`text-base font-bold ${mission.peagesInclus ? 'text-green-700' : 'text-red-700'}`}>
                    {mission.peagesInclus ? '✓ Inclus' : '✗ Non inclus'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-900 leading-relaxed">
                  Ces conditions sont définies dans la convention signée et sont applicables pour cette mission. 
                  Toute modification doit faire l'objet d'un accord écrit préalable entre les parties.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200"></div>

            {/* Instructions */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">Instructions de mission</h2>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {instructions}
                </pre>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200"></div>

            {/* Confirmation Toggle */}
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setConditionsAccepted(!conditionsAccepted)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 ${
                    conditionsAccepted ? 'bg-orange-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={conditionsAccepted}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      conditionsAccepted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                
                <div className="flex-1">
                  <label className="text-base font-semibold text-slate-900 cursor-pointer" onClick={() => setConditionsAccepted(!conditionsAccepted)}>
                    J'ai lu et accepté les conditions
                  </label>
                  <p className="text-sm text-slate-600 mt-1">
                    En activant cette option, vous confirmez avoir pris connaissance des conditions financières et des instructions de mission.
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Button */}
            <div>
              <button
                onClick={handleValidation}
                disabled={!conditionsAccepted || isValidating}
                className={`w-full py-5 px-6 rounded-full font-bold text-lg transition-all duration-200 ${
                  conditionsAccepted && !isValidating
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-green-600 hover:to-green-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isValidating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validation en cours...
                  </span>
                ) : (
                  ' Valider le départ'
                )}
              </button>
              
              {!conditionsAccepted && (
                <p className="text-center text-sm text-orange-600 font-medium mt-4">
                  ⚠️ Veuillez accepter les conditions pour continuer
                </p>
              )}
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200">
              Une fois validé, le statut de la mission passera automatiquement à "Mission en cours"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}