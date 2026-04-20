'use client';

import React, { useRef, useCallback } from 'react';
import { CheckCircle2, X, Printer } from 'lucide-react';
import { MissionData } from '@/app/types/mission';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface MissionSuccessProps {
  mission: MissionData;
  files: File[];
  onNewMission: () => void;
  onGoToMissions: () => void;
  onClose: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatDateTime = (value?: string): string => {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const safeNum = (v: unknown): number => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

const fmt = (v: unknown, digits = 2) => safeNum(v).toFixed(digits);

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionCard = ({
  title, icon, gray = false, children,
}: {
  title: string; icon: string; gray?: boolean; children: React.ReactNode;
}) => (
  <div className={`border rounded-lg p-2 print:p-1.5 ${
    gray ? 'bg-gray-50 border-gray-300' : 'bg-orange-50 border-orange-300'
  }`}>
    <h5 className={`font-bold text-xs mb-2 flex items-center gap-1 print:text-[10px] print:mb-1 ${
      gray ? 'text-gray-800' : 'text-orange-800'
    }`}>
      <span>{icon}</span>{title}
    </h5>
    {children}
  </div>
);

const DataRow = ({
  label, value, bold = false, accent = false,
}: {
  label: string; value: React.ReactNode; bold?: boolean; accent?: boolean;
}) => (
  <div className="flex justify-between items-center py-0.5 border-b border-orange-200 last:border-0 print:py-px">
    <span className={`text-xs text-gray-700 print:text-[10px] ${bold ? 'font-bold' : ''}`}>
      {label}
    </span>
    <span className={`text-xs font-bold print:text-[10px] ${
      accent ? 'text-orange-600 text-sm print:text-xs' : 'text-orange-700'
    }`}>
      {value}
    </span>
  </div>
);

const LabelValue = ({
  label, value, orange = true,
}: {
  label: string; value: React.ReactNode; orange?: boolean;
}) => (
  <div>
    <p className={`text-[10px] font-semibold uppercase print:text-[9px] ${
      orange ? 'text-orange-700' : 'text-gray-500'
    }`}>
      {label}
    </p>
    <p className="font-bold text-gray-900 text-xs print:text-[10px]">{value}</p>
  </div>
);

// ─── Composant principal ───────────────────────────────────────────────────────

const MissionSuccess: React.FC<MissionSuccessProps> = ({
  mission, files, onNewMission, onGoToMissions, onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const peage      = safeNum(mission.calculs?.fraisPeage ?? 0);
  const kmCost     = mission.calculs?.distanceKm && mission.calculs?.detailCalcul?.prixParKm
    ? safeNum(mission.calculs.distanceKm) * safeNum(mission.calculs.detailCalcul.prixParKm)
    : 0;
  const totalFrais = kmCost + peage;

  // ✅ Impression propre — clone le contenu, masque le reste
  const handlePrint = useCallback(() => {
    if (!printRef.current) return;

    const style = document.createElement('style');
    style.id = '__print_override__';
    style.innerHTML = `
      @media print {
        @page { size: A4; margin: 8mm 10mm; }
        body > *                             { display: none !important; }
        body > #__print_root__               { display: block !important; }
        #__next > *:not(#__print_root__)     { display: none !important; }
      }
    `;

    const root = document.createElement('div');
    root.id = '__print_root__';
    root.innerHTML = printRef.current.innerHTML;

    document.head.appendChild(style);
    document.body.appendChild(root);

    window.print();

    document.head.removeChild(style);
    document.body.removeChild(root);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={printRef}
        className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-3 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Mission créée avec succès
              </h2>
              <p className="text-orange-100 text-xs">
                Réf {mission.id?.substring(0, 8).toUpperCase() ?? 'N/A'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-right">
                <p className="text-xs text-orange-100">Créée le</p>
                <p className="font-semibold text-xs">{formatDateTime(mission.dateCreation)}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">

          {/* Statut */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 rounded mb-3">
            <p className="text-xs font-semibold text-yellow-800 uppercase">Statut</p>
            <p className="text-base font-bold text-yellow-700">
              {mission.statut === 'EN_ATTENTE' ? 'En attente' : mission.statut ?? 'Inconnu'}
            </p>
          </div>

          {/* Itinéraire */}
          <SectionCard title="Itinéraire" icon="🧭">
            <div className="grid grid-cols-2 gap-3">
              {([
                { letter: 'A', label: 'Départ',  color: 'green', addr: mission.adresseDepart  },
                { letter: 'B', label: 'Arrivée', color: 'red',   addr: mission.adresseArrivee },
              ] as const).map(({ letter, label, color, addr }) => (
                <div key={letter} className="flex gap-2">
                  <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
                    color === 'green' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {letter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold uppercase ${
                      color === 'green' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {label}
                    </p>
                    <p className="font-bold text-gray-900 text-sm truncate">{addr?.villeNom ?? 'N/A'}</p>
                    <p className="text-xs text-gray-600 truncate">{addr?.adresseComplete ?? 'N/A'}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                      color === 'green' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {addr?.typeLieu ?? 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* 3 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">

            {/* Col 1 — Trajet + Frais */}
            <div className="space-y-3">
              <SectionCard title="Trajet" icon="📊">
                <DataRow
                  label="Distance"
                  value={mission.calculs?.distanceKm
                    ? `${fmt(mission.calculs.distanceKm, 1)} km`
                    : '0 km'}
                />
                <DataRow
                  label="Durée"
                  value={mission.calculs?.detailCalcul?.dureeFormatee ?? 'N/A'}
                />
                <DataRow
                  label="Total" bold
                  value={`${fmt(mission.calculs?.montantTotal ?? 0)} €`}
                  accent
                />
              </SectionCard>

              <SectionCard title="Frais" icon="💶" gray>
                <div className="space-y-1">
                  <div className="flex justify-between py-0.5 border-b border-gray-200">
                    <span className="text-xs text-gray-600">Kilométrage</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      {kmCost > 0 ? `${fmt(kmCost)} €` : '0.00 €'}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-gray-200">
                    <span className="text-xs text-gray-600">Péage</span>
                    <span className="font-semibold text-gray-900 text-xs">{fmt(peage)} €</span>
                  </div>
                  <div className="flex justify-between bg-orange-50 -mx-1 px-1 py-1 rounded border border-orange-200 mt-1">
                    <span className="font-bold text-gray-900 text-xs">TTC</span>
                    <span className="font-bold text-orange-600 text-sm">{fmt(totalFrais)} €</span>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Col 2 — Véhicule + Disponibilité */}
            <div className="space-y-3">
              <SectionCard title="Véhicule" icon="🚗">
                <LabelValue label="Modèle" value={mission.vehicule?.marqueModele ?? 'N/A'} />
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  {([
                    { label: 'Immat.',    value: mission.vehicule?.immatriculation },
                    { label: 'Type',      value: mission.vehicule?.typeVehicule    },
                    { label: 'Carburant', value: mission.vehicule?.typeCarburant   },
                    { label: 'Places',    value: mission.vehicule?.nombrePlaces    },
                  ] as const).map(({ label, value }) => (
                    <LabelValue key={label} label={label} value={value ?? 'N/A'} />
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Disponibilité" icon="📅">
                <div className="space-y-1.5">
                  <LabelValue
                    label="Départ dès le"
                    value={formatDateTime(mission.disponibilite?.dateDebut)}
                  />
                  <LabelValue
                    label="Arrivée avant le"
                    value={formatDateTime(mission.disponibilite?.dateFin)}
                  />
                </div>
              </SectionCard>
            </div>

            {/* Col 3 — Notifications + Commentaire + Documents */}
            <div className="space-y-3">
              {!!mission.notifications?.length && (
                <SectionCard title="Notifications" icon="🔔">
                  <div className="space-y-1.5">
                    {mission.notifications.map((n: any, i: number) => (
                      <div key={i} className="bg-white p-1.5 rounded border border-orange-200">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-xs">
                            {n.typeNotification === 'DEPART' ? 'Départ' : 'Arrivée'}
                          </span>
                          <span className={`px-1 py-0.5 rounded text-[10px] font-semibold ${
                            n.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {n.actif ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{n.nomContact ?? 'N/A'}</p>
                        <p className="text-xs text-gray-500">{n.telephoneContact ?? 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {mission.commentaire && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-2 rounded">
                  <p className="text-xs font-semibold text-amber-800 uppercase mb-1 flex items-center gap-1">
                    <span>📝</span> Commentaire
                  </p>
                  <p className="text-gray-700 text-xs italic">{mission.commentaire}</p>
                </div>
              )}

              {!!files.length && (
                <SectionCard title="Documents" icon="📎" gray>
                  <ul className="space-y-1">
                    {files.map((file, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs bg-white p-1 rounded border border-gray-200">
                        <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="truncate flex-1 text-gray-700">{file.name}</span>
                        <span className="text-gray-500 text-[10px]">
                          {file.size ? `${(file.size / 1024).toFixed(0)} Ko` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              )}
            </div>

          </div>

          {/* ✅ Actions — visibles à l'écran, cachées à l'impression */}
          <div className="flex flex-wrap gap-3 justify-center pt-3 border-t border-orange-200 mt-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-5 py-2 border-2 border-orange-600 rounded-lg text-orange-700 font-semibold hover:bg-orange-50 transition flex items-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" /> Imprimer
            </button>
            <button
              onClick={onNewMission}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition shadow-lg text-sm"
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
    </div>
  );
};

export default MissionSuccess;