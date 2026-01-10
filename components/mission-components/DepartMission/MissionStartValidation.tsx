import React, { useState } from 'react';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Mission, vehicleIcons, vehiculeCarburantIcons } from '@/app/data/missions';
import ValidationButtons from './ValidationButtom';
import ToggleCondition from './ToggleCondition';

interface MissionDepartureProps {
  mission: Mission;
  onValidate?: () => void;
}

export default function MissionStartValidation({ mission, onValidate }: MissionDepartureProps) {
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
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
          <div className=" block md:hidden  bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-6">
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


            {/* Conditions financières */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">Conditions financières</h2>
              </div>

              <p className="text-sm text-slate-600 mb-5 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                Selon la convention signée entre les parties - Entité: {mission.entite}
              </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-5">

  <div className="flex justify-between items-center py-3 border-b border-slate-200">
    <span className="text-slate-700 font-medium">
      Dépassement de kilomètres
    </span>
    <span className="text-orange-600 font-bold">
      {mission.tarifDepassementKm.toFixed(2)} € / km
    </span>
  </div>

  <div className="flex justify-between items-center py-3 border-b border-slate-200">
    <span className="text-slate-700 font-medium">
      Retard sans avertissement
    </span>
    <span className="text-orange-600 font-bold">
      {mission.tarifRetardHeure.toFixed(2)} € / h
    </span>
  </div>

  <div className="flex justify-between items-center py-3 border-b border-slate-200">
    <span className="text-slate-700 font-medium">
      Carburant
    </span>
    <span className="text-orange-600 font-bold">
      {mission.tarifCarburant}
    </span>
  </div>

  <div className="flex justify-between items-center py-3 border-b border-slate-200">
    <span className="text-slate-700 font-medium">
      Restitution à un autre endroit
    </span>
    <span className="text-orange-600 font-bold">
      {mission.tarifRestitutionAutreEndroit.toFixed(2)} € / km
    </span>
  </div>

</div>


              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="p-4 rounded-full border-2 bg-green-50 border-green-300 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Carburant</p>
                  <p className="text-base font-bold text-green-700">
                    ✓ Inclus
                  </p>
                </div>
                <div className="p-4 rounded-full border-2 bg-green-50 border-green-300  flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-medium text-slate-600 mb-1">Péages</p>
                  <p className="text-base font-bold text-green-700">
                    ✓ Inclus
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-full border border-blue-200">
                <p className="text-xs text-blue-900 leading-relaxed">
                  Ces conditions sont définies dans la convention signée et sont applicables pour cette mission.
                  Toute modification doit faire l'objet d'un accord écrit préalable entre les parties.
                </p>
              </div>
            </div>

            {/* Mission Info Summary */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Informations de la mission
              </h2>
          <div className="bg-slate-50 rounded-full p-5 border border-slate-200">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">

    {/* Trajet */}
    <div>
      <p className="text-xs text-slate-500 uppercase font-medium">
        Trajet
      </p>
      <p className="text-sm font-semibold text-slate-900 mt-1">
        {mission.villeDepart} → {mission.villeArrivee}
      </p>
    </div>

    {/* Véhicule */}
    <div>
      <p className="text-xs text-slate-500 uppercase font-medium">
        Véhicule
      </p>
      <p className="text-sm font-semibold text-slate-900 mt-1">
        {mission.modeleVehicule}
      </p>
    </div>

    {/* Type */}
    <div>
      <p className="text-xs text-slate-500 uppercase font-medium">
        Type
      </p>
      <div className="flex items-center justify-center gap-2 mt-1">
        <img
          src={vehicleInfo.image}
          alt={vehicleInfo.label}
          className="w-7 h-5"
        />
        <span className="text-sm font-semibold text-slate-900">
          {vehicleInfo.label}
        </span>
      </div>
    </div>

    {/* Carburant */}
    <div>
      <p className="text-xs text-slate-500 uppercase font-medium">
        Carburant
      </p>
      <div className="flex items-center justify-center gap-2 mt-1">
        <img
          src={carburantInfo.image}
          alt={carburantInfo.label}
          className="w-7 h-5"
        />
        <span className="text-sm font-semibold text-slate-900">
          {mission.typeCarburant}
        </span>
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
          <div>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">

    {/* Lieu de départ */}
    <div className="bg-slate-50 rounded-full p-4 border border-slate-200">
      <p className="text-xs text-slate-500 uppercase font-medium mb-2">
        Lieu de départ
      </p>
      <p className="text-sm font-semibold text-slate-900">
        {mission.lieuDepart || mission.villeDepart}
      </p>
      {mission.adresseDepartComplete && (
        <p className="text-xs text-slate-600 mt-1">
          {mission.adresseDepartComplete}
        </p>
      )}
    </div>

    {/* Lieu d'arrivée */}
    <div className="bg-slate-50 rounded-full p-4 border border-slate-200">
      <p className="text-xs text-slate-500 uppercase font-medium mb-2">
        Lieu d'arrivée
      </p>
      <p className="text-sm font-semibold text-slate-900">
        {mission.lieuArrivee || mission.villeArrivee}
      </p>
      {mission.adresseArriveeComplete && (
        <p className="text-xs text-slate-600 mt-1">
          {mission.adresseArriveeComplete}
        </p>
      )}
    </div>

    {/* Distance */}
    <div className="bg-slate-50 rounded-full p-4 border border-slate-200">
      <p className="text-xs text-slate-500 uppercase font-medium mb-2">
        Distance autorisée
      </p>
      <p className="text-lg font-bold text-orange-600">
        {mission.kmTotalAutorise} km
      </p>
    </div>

    {/* Type de boîte */}
    <div className="bg-slate-50 rounded-full p-4 border border-slate-200">
      <p className="text-xs text-slate-500 uppercase font-medium mb-2">
        Type de boîte
      </p>
      <p className="text-lg font-bold text-slate-900">
        {mission.typeBoite}
      </p>
    </div>

  </div>
</div>

            </div>






            {/* Divider */}
            <div className="border-t border-slate-200"></div>

            {/* Confirmation Toggle */}
            <ToggleCondition
              accepted={conditionsAccepted}
              onToggle={setConditionsAccepted}
              title="J'ai lu et accepté les conditions"
              description="En activant cette option, vous confirmez avoir pris connaissance des conditions financières et des instructions de mission."
            />

            <ValidationButtons
              conditionsAccepted={conditionsAccepted}
              isValidating={isValidating}
              onValidate={handleValidation}
              validationText="Suivant"  // optionnel
              warningText="⚠️ Veuillez accepter les conditions pour continuer"  // optionnel
            />



          </div>
        </div>
      </div>
    </div>
  );
}