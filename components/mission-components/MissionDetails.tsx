'use client';

import React from "react";
import { MissionDetail } from "@/app/types/mission";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowRight, MapPin, ChevronDown } from "lucide-react";
import { getCarburantConfig, getVehicleConfig } from "@/app/config/mission-icons.config";
import CountdownTimer from "./CountdownTimer";
import { CountdownTimerCompact } from "./CountdownTimerCompact";
import DynamicMissionsMap from "./DynamicMissionsMap";
import { useQuery } from "@apollo/client/react";
import { GET_CONTRACT_TARIFICATION } from "@/lib/graphql/queries/mission-detail";

export default function MissionDetails({
  mission,
  onBack,
  onReserve,
}: {
  mission: MissionDetail;
  onBack: () => void;
  onReserve: () => void;
}) {
  const vehicleConfig = getVehicleConfig(mission.vehicule?.typeVehicule);
  const carburantInfo = getCarburantConfig(mission.vehicule?.typeCarburant);

  // ── Conversion en Int pour correspondre au type GraphQL ──────────────────
  const demandeId = mission.partenaire?.demandeInitiale?.id
    ? Number(mission.partenaire.demandeInitiale.id)
    : undefined;

  // ── Query tarification ──────────────────────────────────────────────────
  const { data: tarificationData } = useQuery<{
    contratTarification: {
      prixParKm:               number | null;
      depassementKilometrage:  number | null;
      retardSansAvertissement: number | null;
      restitutionAutreEndroit: number | null;
    };
  }>(GET_CONTRACT_TARIFICATION, {
    variables: { demandeId },           // ✅ Int, pas String
    skip: demandeId == null || isNaN(demandeId),
  });

  const tarif = tarificationData?.contratTarification;

  // ── Conditions contractuelles ───────────────────────────────────────────
  const conditions = [
    {
      label: "Dépassement de km",
      valeur: tarif?.prixParKm != null
        ? `${tarif.prixParKm} €/km`
        : "Non défini",
    },
    {
      label: "Kilométrage autorisé",
      valeur: tarif?.depassementKilometrage != null
        ? `${tarif.depassementKilometrage} km`
        : "Non défini",
    },
    {
      label: "Retard sans avertissement",
      valeur: tarif?.retardSansAvertissement != null
        ? `${tarif.retardSansAvertissement} €/h`
        : "Non défini",
    },
    {
      label: "Carburant",
      valeur: "Prix selon convention signée",
    },
    {
      label: "Restitution autre endroit",
      valeur: tarif?.restitutionAutreEndroit != null
        ? `${tarif.restitutionAutreEndroit} €/h`
        : "Non défini",
    },
    {
      label: "Annulation",
      valeur: "Selon convention signée",
    },
  ];

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg border border-orange-500 overflow-hidden">

        {/* En-tête avec timer compact */}
        <div className="block lg:hidden bg-black text-white px-8 py-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">Mission de Transport</h1>
              <p className="text-gray-300 mt-1">Détails de la réservation</p>
            </div>
            {mission.disponibilite?.dateDepartMax && (
              <CountdownTimerCompact dateDepartMax={mission.disponibilite.dateDepartMax} />
            )}
          </div>
        </div>

        <div className="p-8 space-y-10">

          {/* Informations générales */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Informations générales
            </h2>
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-orange-500">
              <span className="text-gray-900 font-semibold text-lg">
                {mission.partenaire?.entiteGroupe || "Non spécifié"}
              </span>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Trajet */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Trajet
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-orange-500 text-white p-3 rounded-full mr-5">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Départ</h3>
                    <p className="text-xl font-bold text-gray-900">{mission.adresseDepart.villeNom}</p>
                    <p className="text-sm text-gray-600 mt-1">{mission.adresseDepart.adresseComplete}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <ChevronDown className="text-orange-500" size={40} />
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-orange-500 text-white p-3 rounded-full mr-5">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Arrivée</h3>
                    <p className="text-xl font-bold text-gray-900">{mission.adresseArrivee.villeNom}</p>
                    <p className="text-sm text-gray-600 mt-1">{mission.adresseArrivee.adresseComplete}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Carte interactive */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Itinéraire de la mission
            </h2>
            <DynamicMissionsMap
              mission={mission}
              onDurationCalculated={(duration) => {
                console.log('Durée calculée:', duration, 'minutes');
              }}
            />
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Tarif */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Tarif
            </h2>
            {mission.calculs && (
              <>
                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium text-lg">Montant total</span>
                    <span className="text-3xl font-bold text-orange-600">
                      {mission.calculs.montantTotal.toFixed(2)} €
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 text-right italic">
                    Péages : {mission.calculs.fraisPeage.toFixed(2)} €
                  </p>
                </div>
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Prestations supplémentaires</h3>
                  <p className="text-sm text-gray-600 mb-3 italic">Remboursées par l'entité sur présentation de facture</p>
                  <ul className="space-y-1 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Nettoyage du véhicule int./ext.
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      Carburant
                    </li>
                  </ul>
                </div>
              </>
            )}
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Kilométrage */}
          {mission.calculs && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-orange-500 mr-3"></span>
                Kilométrage
              </h2>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-1">Distance totale</p>
                <p className="text-3xl font-bold text-gray-900">{mission.calculs.distanceKm} km</p>
              </div>
            </section>
          )}

          <div className="border-t border-gray-200"></div>

          {/* Disponibilité */}
          {mission.disponibilite && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-1 h-6 bg-orange-500 mr-3"></span>
                Disponibilité véhicule
              </h2>
              {mission.disponibilite.dateDepartMax && (
                <CountdownTimer
                  dateDepartMax={mission.disponibilite.dateDepartMax}
                  className="mb-6"
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Date de début</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(mission.disponibilite.dateDebut).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Date de fin</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(mission.disponibilite.dateFin).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </section>
          )}

          <div className="border-t border-gray-200"></div>

          {/* Véhicule */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Détails véhicule
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="bg-orange-500 p-4 rounded-full w-24 h-24 flex items-center justify-center">
                      <Image
                        src={vehicleConfig.icon}
                        alt={vehicleConfig.label}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{mission.vehicule.marqueModele}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {vehicleConfig.label} • {mission.vehicule.boiteVitesse || "Automatique"}
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-3 rounded-lg border border-gray-300 shadow min-w-[180px]">
                  <div className="flex justify-center mb-3">
                    <div className={`${carburantInfo.bgColor} p-3 rounded-lg`}>
                      <Image
                        src={carburantInfo.image}
                        alt={carburantInfo.label}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1 text-center">Carburant</p>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Conditions contractuelles */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Conditions contractuelles
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-start mb-4">
                <AlertCircle className="text-orange-500 mr-3 flex-shrink-0 mt-0.5" size={22} />
                <p className="text-sm text-gray-600 italic">Veuillez prendre connaissance des conditions suivantes</p>
              </div>
              <ul className="space-y-4">
                {conditions.map((condition, index) => (
                  <li key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700 font-medium">{condition.label}</span>
                    <span className="font-semibold text-gray-900">{condition.valeur}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8"></div>

          {/* Boutons d'action */}
          <section>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={onBack}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-10 rounded-full border-2 border-gray-300 transition-all duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2" size={22} />
                Retour
              </button>
              <button
                onClick={onReserve}
                className="w-full sm:flex-1 bg-orange-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 flex items-center justify-center group text-lg"
              >
                Réserver cette mission
                <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" size={26} />
              </button>
            </div>
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-orange-100 text-orange-700 px-8 py-4 rounded-full">
                <ArrowRight className="mr-3" size={22} />
                <span className="font-semibold">Cliquez sur "Réserver" pour confirmer votre mission</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}