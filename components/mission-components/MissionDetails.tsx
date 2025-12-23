
import React, { useState, useEffect } from "react";
import { Mission } from "@/app/type/mission";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Car, ChevronDown, Clock, Fuel, MapPin } from "lucide-react";

// Composant Détails de Mission
 export default function MissionDetails({ mission, onBack, onReserve }: { mission: Mission; onBack: () => void; onReserve: () => void }) {
  const [timeRemaining, setTimeRemaining] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) { minutes--; seconds = 59; }
        else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const conditions = [
    { label: "Dépassement de km", valeur: `${mission.tarifDepassementKm || 0.50} €/km` },
    { label: "Retard sans avertissement", valeur: `${mission.tarifRetardHeure || 25.00} €/h` },
    { label: "Carburant", valeur: mission.tarifCarburant || "Prix selon convention signée" },
    { label: "Restitution autre endroit", valeur: `${mission.tarifRestitutionAutreEndroit || 1.20} €/km` },
    { label: "Annulation", valeur: mission.conditionsAnnulation || "Selon convention signée" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        
        <div className="bg-black text-white px-8 py-6">
          <h1 className="text-2xl font-bold">Mission de Transport</h1>
          <p className="text-gray-300 mt-1">Détails de la réservation</p>
        </div>

        <div className="p-8 space-y-8">
          
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Informations générales
            </h2>
            <div className="bg-gray-50 p-4 rounded border-l-4 border-orange-500">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Entité</span>
                <span className="text-gray-900 font-semibold text-lg">{mission.entite || "Non spécifié"}</span>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Trajet
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-orange-500 text-white p-2 rounded-full mr-4 mt-1">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Départ</h3>
                    <p className="text-gray-900 font-medium">{mission.lieuDepart || mission.villeDepart}</p>
                    <p className="text-gray-600">{mission.adresseDepartComplete || ""}</p>
                    <p className="text-gray-600">{mission.villeDepart}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <ChevronDown className="text-orange-500" size={32} />
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-orange-500 text-white p-2 rounded-full mr-4 mt-1">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Arrivée</h3>
                    <p className="text-gray-900 font-medium">{mission.lieuArrivee || mission.villeArrivee}</p>
                    <p className="text-gray-600">{mission.adresseArriveeComplete || ""}</p>
                    <p className="text-gray-600">{mission.villeArrivee}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Tarif
            </h2>
            
            <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium text-lg">Montant total</span>
                <span className="text-3xl font-bold text-orange-600">{mission.montant.toFixed(2)} €</span>
              </div>
              <p className="text-sm text-gray-600 text-right italic">
                {mission.peagesInclus ? 'péages inclus' : `péages: ${mission.fraisPeage}`} 
                {mission.carburantInclus ? ' et carburant inclus' : ''}
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

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Kilométrage
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-1">Nombre de KM</p>
                <p className="text-2xl font-bold text-gray-900">{mission.nbKm} km</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-1">KM total permis</p>
                <p className="text-2xl font-bold text-gray-900">{mission.kmTotalAutorise || mission.nbKm} km</p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Disponibilité véhicule
            </h2>
            
            <div className="bg-red-50 border-2 border-red-500 p-5 rounded-lg mb-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-red-600 mr-2" size={24} />
                <span className="text-sm font-medium text-red-800">Temps de prise en charge restant</span>
              </div>
              <div className="text-center">
                <span className="text-4xl font-bold text-red-600">
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Date de départ Min</p>
                <p className="font-semibold text-gray-900">{mission.dateDebutMin || mission.dateDisposition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Date de départ Max</p>
                <p className="font-semibold text-gray-900">{mission.dateDebutMax || mission.dateDisposition}</p>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Détails véhicule
            </h2>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-500 text-white p-3 rounded-full">
                    <Car size={28} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{mission.modeleVehicule || mission.vehicleType || "Véhicule"}</p>
                    <p className="text-gray-600">{mission.typeBoite || "Automatique"}</p>
                  </div>
                </div>
                <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300">
                  <Fuel className="text-gray-600 mr-2" size={20} />
                  <span className="text-gray-700 font-medium">{mission.typeCarburant || "Diesel"}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-1 h-6 bg-orange-500 mr-3"></span>
              Conditions contractuelles
            </h2>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-start mb-3">
                <AlertCircle className="text-orange-500 mr-2 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-gray-600 italic">Veuillez prendre connaissance des conditions suivantes</p>
              </div>
              <ul className="space-y-3">
                {conditions.map((condition, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700">{condition.label}</span>
                    <span className="font-semibold text-gray-900">{condition.valeur}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          <section className="pt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button 
                onClick={onReserve}
                className="w-full sm:flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center group"
              >
                <span className="text-lg">Réserver cette mission</span>
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
              </button>
              
              <button 
                onClick={onBack}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-lg border-2 border-gray-300 transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="mr-2" size={20} />
                Retour
              </button>
            </div>
            
            <div className="mt-6 flex justify-center">
              <div className="bg-orange-100 text-orange-800 px-6 py-3 rounded-full flex items-center">
                <ArrowRight className="mr-2" size={20} />
                <span className="text-sm font-medium">Cliquez sur "Réserver" pour confirmer votre mission</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}