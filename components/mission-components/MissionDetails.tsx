import React, { useState, useEffect } from "react";
import { Mission } from "@/app/type/mission";
import Image from "next/image";
import { AlertCircle, ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react";
import { Car, ArrowBigRightDash, Fuel } from "lucide-react";
import { missionsData, vehicleIcons, VehicleType, VehiculeCarburant, vehiculeCarburantIcons } from "@/app/data/missions";
import { useParams } from "next/navigation";
import DynamicMissionsMap from "./DynamicMissionsMap";

export default function MissionDetails({
  mission: missionProp,
  onBack,
  onReserve,
}: {
  mission?: Mission;
  onBack: () => void;
  onReserve: () => void;
}) {
  const params = useParams<{ id: string }>();
  const missionId = params?.id ? parseInt(params.id, 10) : null;

  const mission =
    missionProp ||
    (missionId !== null ? missionsData.find((m) => m.id === missionId) : null);

  if (!mission) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
          <p className="text-2xl font-semibold">Mission non trouvée</p>
          <p className="text-gray-400 mt-2">
            L'identifiant fourni est invalide ou la mission n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  });

  const fuelInfo =
    vehiculeCarburantIcons[mission.typeCarburant as VehiculeCarburant] ||
    vehiculeCarburantIcons.Essence;

  const vehicleConfig =
    vehicleIcons[mission.vehicleType as VehicleType] || vehicleIcons.berline;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const conditions = [
    {
      label: "Dépassement de km",
      valeur: `${mission.tarifDepassementKm || 0.5} €/km`,
    },
    {
      label: "Retard sans avertissement",
      valeur: `${mission.tarifRetardHeure || 25} €/h`,
    },
    {
      label: "Carburant",
      valeur: mission.tarifCarburant || "Prix selon convention signée",
    },
    {
      label: "Restitution autre endroit",
      valeur: `${mission.tarifRestitutionAutreEndroit || 1.2} €/km`,
    },
    {
      label: "Annulation",
      valeur: mission.conditionsAnnulation || "Selon convention signée",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg border border-orange-500 overflow-hidden">

        {/* En-tête */}
        <div className="bg-black text-white px-8 py-6">
          <h1 className="text-2xl font-bold">Mission de Transport</h1>
          <p className="text-gray-300 mt-1">Détails de la réservation</p>
        </div>

        <div className="p-4 space-y-2">

          {/* Informations générales */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Informations générales
            </h2>
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-orange-500">
              <span className="text-gray-900 font-semibold text-lg">{mission.entite || "Non spécifié"}</span>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Trajet - Villes seulement */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Trajet
            </h2>

            <div className="flex flex-row space-y-4 justify-between items-center">
              <div className="bg-gray-200 p-6 w-100 rounded-full border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-orange-500 text-white p-3 rounded-full mr-5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Départ</h3>
                    <p className="text-xl font-bold text-gray-900">{mission.villeDepart}</p>
                    {mission.adresseDepartComplete && (
                      <p className="text-sm text-gray-600 mt-1">{mission.adresseDepartComplete}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowBigRightDash className="text-orange-500" size={40} />
              </div>

              <div className="bg-gray-200 p-6 w-100 rounded-full border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-orange-500 text-white p-3 rounded-full mr-5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Arrivée</h3>
                    <p className="text-xl font-bold text-gray-900">{mission.villeArrivee}</p>
                    {mission.adresseArriveeComplete && (
                      <p className="text-sm text-gray-600 mt-1">{mission.adresseArriveeComplete}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Carte interactive */}
        {/* Carte interactive */}
<section>
  <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
    <span className="w-1 h-6 bg-orange-500 mr-3"></span>
    Itinéraire de la mission
  </h2>

  <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-2xl border border-gray-300">
    {mission ? (
      <DynamicMissionsMap mission={mission} />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Impossible de charger la carte</p>
      </div>
    )}
  </div>
</section>

          <div className="border-t border-gray-200"></div>

          {/* Tarif */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Tarif
            </h2>

            <div className="bg-orange-50 p-6 rounded-full border-2 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium text-lg">Montant total</span>
                <span className="text-3xl font-bold text-orange-600">{mission.montant.toFixed(2)} €</span>
              </div>
              <p className="text-sm text-gray-600 text-right italic">
                {mission.peagesInclus ? 'Péages inclus' : `Péages : ${mission.fraisPeage}`}
                {mission.carburantInclus ? ' • Carburant inclus' : ''}
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
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Kilométrage */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Kilométrage
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-200 p-5 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-1">Nombre de KM</p>
                <p className="text-3xl font-bold text-gray-900">{mission.nbKm} km</p>
              </div>
              <div className="bg-gray-200 p-5 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-1">KM total autorisé</p>
                <p className="text-3xl font-bold text-gray-900">{mission.kmTotalAutorise || mission.nbKm} km</p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Disponibilité */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Disponibilité véhicule
            </h2>

            <div className="bg-red-50 border-2 border-red-500 p-4 rounded-full mb-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Clock className="text-red-600 mr-2" size={28} />
                <span className="text-lg font-medium text-red-800">Temps restant pour réservation</span>
              </div>
              <div className="text-5xl font-bold text-red-600 font-mono">
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-200 text-center p-4 rounded-full border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Date de départ Min</p>
                <p className="font-semibold text-gray-900">{mission.dateDebutMin || mission.dateDisposition}</p>
              </div>
              <div className="bg-gray-200 text-center p-4 rounded-full border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Date de départ Max</p>
                <p className="font-semibold text-gray-900">{mission.dateDebutMax || mission.dateDisposition}</p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Véhicule */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Détails véhicule
            </h2>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="bg-orange-500 p-4 rounded-full">
                    <Image
                      src={vehicleConfig.image}
                      alt={vehicleConfig.label}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{vehicleConfig.label}</p>
                    <p className="text-gray-600">{mission.typeBoite || "Automatique"}</p>
                  </div>
                </div>

                <div className="bg-white px-5 py-3 rounded-lg border border-gray-300 shadow">
                  <Image
                    src={fuelInfo.image}
                    alt={fuelInfo.label}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Conditions */}
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
            <div className="flex justify-center gap-4 pt-8">
              <button
                onClick={onBack}
                className="flex flex-row px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:bg-black hover:from-black hover:to-black transition-colors"
              >
                <ArrowLeft className="mr-2" size={26} />
                Retour
              </button>

              <button
                onClick={onReserve}
                className="flex flex-row px-10 py-2 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:bg-green-800 hover:from-green-800 hover:to-green-800 transition-colors"
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