// components/partenaire-components/MissionSuccess/index.tsx
'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { MissionData } from '@/app/types/mission';

interface MissionSuccessProps {
  mission: MissionData;
  files: File[];
  onNewMission: () => void;
  onGoToMissions: () => void;
  onClose: () => void;
}

const MissionSuccess: React.FC<MissionSuccessProps> = ({
  mission,
  files,
  onNewMission,
  onGoToMissions,
  onClose,
}) => {
  const formatDateTime = (value?: string) => {
    if (!value) return 'N/A';
    const d = new Date(value);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const safeNumber = (value: any): number => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  };

  const peageRaw =
    mission.calculs?.fraisPeage ??
    (mission.calculs as any)?.fraisPeage ??
    0;

  const kmCost =
    mission.calculs?.distanceKm &&
    mission.calculs?.detailCalcul?.prixParKm
      ? safeNumber(mission.calculs.distanceKm) *
        safeNumber(mission.calculs.detailCalcul.prixParKm)
      : 0;

  const peage = safeNumber(peageRaw);
  const totalFrais = kmCost + peage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 print:bg-white print:static print:block">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl print:max-h-none print:overflow-visible print:shadow-none print:p-0 print:rounded-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-t-xl print:rounded-none print:px-3 print:py-1.5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 print:text-base">
                <CheckCircle2 className="w-5 h-5 print:w-4 print:h-4" />
                Mission créée avec succès
              </h2>
              <p className="text-orange-100 text-xs">
                Réf{' '}
                {mission.id
                  ? mission.id.substring(0, 8).toUpperCase()
                  : 'N/A'}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-right">
                <p className="text-xs text-orange-100">Créée le</p>
                <p className="font-semibold text-xs">
                  {formatDateTime(mission.dateCreation)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition print:hidden"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-4 print:p-2">
          {/* Statut */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 rounded mb-3 print:mb-2 print:p-1.5">
            <p className="text-xs font-semibold text-yellow-800 uppercase">
              Statut
            </p>
            <p className="text-base font-bold text-yellow-700 print:text-sm">
              {mission.statut === 'EN_ATTENTE'
                ? 'En attente'
                : mission.statut || 'Inconnu'}
            </p>
          </div>

          {/* Trajet */}
          <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 mb-3 print:mb-2 print:p-2">
            <h4 className="text-sm font-bold text-orange-700 mb-2 flex items-center gap-1 print:text-xs print:mb-1">
              <span>🧭</span>
              Itinéraire
            </h4>
            <div className="grid grid-cols-2 gap-3 print:gap-2">
              {/* Départ */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 print:w-6 print:h-6 print:text-xs">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-700 uppercase print:text-[10px]">
                    Départ
                  </p>
                  <p className="font-bold text-gray-900 text-sm truncate print:text-xs">
                    {mission.adresseDepart?.villeNom || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-600 truncate print:text-[10px]">
                    {mission.adresseDepart?.adresseComplete || 'N/A'}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full inline-block mt-0.5">
                    {mission.adresseDepart?.typeLieu || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Arrivée */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 print:w-6 print:h-6 print:text-xs">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700 uppercase print:text-[10px]">
                    Arrivée
                  </p>
                  <p className="font-bold text-gray-900 text-sm truncate print:text-xs">
                    {mission.adresseArrivee?.villeNom || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-600 truncate print:text-[10px]">
                    {mission.adresseArrivee?.adresseComplete || 'N/A'}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full inline-block mt-0.5">
                    {mission.adresseArrivee?.typeLieu || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trois colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 print:gap-2 print:mb-2">
            {/* Colonne 1 : stats / frais */}
            <div className="space-y-3 print:space-y-2">
              {/* Statistiques */}
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-2 print:p-1.5">
                <h5 className="font-bold text-orange-800 mb-2 flex items-center gap-1 text-xs print:text-[10px] print:mb-1">
                  <span>📊</span>
                  Trajet
                </h5>
                <div className="space-y-1.5 print:space-y-1">
                  <div className="flex justify-between items-center pb-1 border-b border-orange-200">
                    <span className="text-xs text-gray-700 print:text-[10px]">Distance</span>
                    <span className="text-sm font-bold text-orange-700 print:text-xs">
                      {mission.calculs?.distanceKm
                        ? `${safeNumber(
                            mission.calculs.distanceKm,
                          ).toFixed(1)} km`
                        : '0 km'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-orange-200">
                    <span className="text-xs text-gray-700 print:text-[10px]">Durée</span>
                    <span className="text-sm font-bold text-orange-700 print:text-xs">
                      {mission.calculs?.detailCalcul?.dureeFormatee ||
                        'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-700 font-bold print:text-[10px]">
                      Total
                    </span>
                    <span className="text-base font-bold text-orange-600 print:text-sm">
                      {mission.calculs?.montantTotal
                        ? `${safeNumber(
                            mission.calculs.montantTotal,
                          ).toFixed(2)} €`
                        : '0.00 €'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Frais */}
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 print:p-1.5">
                <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-1 text-xs print:text-[10px] print:mb-1">
                  <span>💶</span>
                  Frais
                </h5>
                <div className="space-y-1">
                  <div className="flex justify-between py-0.5 border-b border-gray-200">
                    <span className="text-xs text-gray-600 print:text-[10px]">Kilométrage</span>
                    <span className="font-semibold text-gray-900 text-xs print:text-[10px]">
                      {kmCost > 0 ? `${kmCost.toFixed(2)} €` : '0.00 €'}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-200">
                    <span className="text-xs text-gray-600 print:text-[10px]">Péage</span>
                    <span className="font-semibold text-gray-900 text-xs print:text-[10px]">
                      {peage.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 bg-orange-50 -mx-1 px-1 py-1 rounded border border-orange-200">
                    <span className="font-bold text-gray-900 text-xs print:text-[10px]">
                      TTC
                    </span>
                    <span className="font-bold text-orange-600 text-sm print:text-xs">
                      {totalFrais.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 : véhicule / dispo */}
            <div className="space-y-3 print:space-y-2">
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-2 print:p-1.5">
                <h5 className="font-bold text-orange-800 mb-2 flex items-center gap-1 text-xs print:text-[10px] print:mb-1">
                  <span>🚗</span>
                  Véhicule
                </h5>
                <div className="space-y-1.5 print:space-y-1">
                  <div>
                    <p className="text-xs text-orange-700 font-semibold uppercase print:text-[10px]">
                      Modèle
                    </p>
                    <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                      {mission.vehicule?.marqueModele || 'N/A'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <p className="text-xs text-orange-700 print:text-[10px]">Immat.</p>
                      <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                        {mission.vehicule?.immatriculation || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700 print:text-[10px]">Type</p>
                      <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                        {mission.vehicule?.typeVehicule || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700 print:text-[10px]">Carburant</p>
                      <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                        {mission.vehicule?.typeCarburant || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700 print:text-[10px]">Places</p>
                      <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                        {mission.vehicule?.nombrePlaces ?? 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-300 rounded-lg p-2 print:p-1.5">
                <h5 className="font-bold text-orange-800 mb-2 flex items-center gap-1 text-xs print:text-[10px] print:mb-1">
                  <span>📅</span>
                  Disponibilité
                </h5>
                <div className="space-y-1.5 print:space-y-1">
                  <div>
                    <p className="text-xs text-orange-700 font-semibold uppercase print:text-[10px]">
                      Départ dès le
                    </p>
                    <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                      {formatDateTime(mission.disponibilite?.dateDebut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-700 font-semibold uppercase print:text-[10px]">
                      Arrivée avant le
                    </p>
                    <p className="font-bold text-gray-900 text-xs print:text-[10px]">
                      {formatDateTime(mission.disponibilite?.dateFin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 3 : notifications / commentaire */}
            <div className="space-y-3 print:space-y-2">
              {mission.notifications &&
                mission.notifications.length > 0 && (
                  <div className="bg-orange-50 border border-orange-300 rounded-lg p-2 print:p-1.5">
                    <h5 className="font-bold text-orange-800 mb-2 flex items-center gap-1 text-xs print:text-[10px] print:mb-1">
                      <span>🔔</span>
                      Notifications
                    </h5>
                    <div className="space-y-1.5 print:space-y-1">
                      {mission.notifications.map(
                        (notif: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-white p-1.5 rounded border border-orange-200 print:p-1"
                          >
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="text-xs print:text-[10px]">
                                {notif.typeNotification === 'DEPART'
                                  ? 'Départ'
                                  : 'Arrivée'}
                              </span>
                              <span
                                className={`px-1 py-0.5 rounded text-[10px] font-semibold ${
                                  notif.actif
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {notif.actif ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate print:text-[10px]">
                              {notif.nomContact || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500 print:text-[10px]">
                              {notif.telephoneContact || 'N/A'}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {mission.commentaire && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-2 rounded print:p-1.5">
                  <p className="text-xs font-semibold text-amber-800 uppercase mb-1 flex items-center gap-1 print:text-[10px]">
                    <span>📝</span> Commentaire
                  </p>
                  <p className="text-gray-700 text-xs italic print:text-[10px]">
                    {mission.commentaire}
                  </p>
                </div>
              )}

              {/* Documents – écran seulement */}
              {files.length > 0 && (
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 print:hidden">
                  <h5 className="font-bold text-gray-800 mb-1.5 flex items-center gap-1 text-xs">
                    <span>📎</span>
                    Documents
                  </h5>
                  <ul className="space-y-1">
                    {files.map((file, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1.5 text-xs bg-white p-1 rounded border border-gray-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="truncate flex-1 text-gray-700">
                          {file.name}
                        </span>
                        <span className="text-gray-500 text-[10px]">
                          {file.size
                            ? `${(file.size / 1024).toFixed(0)} Ko`
                            : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Actions – non imprimées */}
          <div className="flex flex-wrap gap-3 justify-center pt-3 border-t border-orange-200 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-5 py-2 border-2 border-orange-600 rounded-lg text-orange-700 font-semibold hover:bg-orange-50 transition flex items-center gap-2 text-sm"
            >
              <span>🖨️</span> Imprimer
            </button>
            <button
              onClick={onNewMission}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              Nouvelle demande
            </button>
            <button
              onClick={onGoToMissions}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition font-semibold text-sm"
            >
              Voir mes missions
            </button>
          </div>
        </div>
      </div>

      {/* Styles impression A4 */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 8mm 10mm;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MissionSuccess;
