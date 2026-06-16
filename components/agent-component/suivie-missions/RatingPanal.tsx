"use client";
import { useState, useCallback } from "react";
import { NOTER_MISSION_CONVOYEUR } from "@/lib/graphql/mutations/mission.mutations";
import { ActiveMission } from "@/app/types/map-agent";
import { useMutation } from "@apollo/client/react";

// ── Types ────────────────────────────────────────────────────

export interface MissionWithEval extends ActiveMission {
  statut?: string;
  noteAgent?: number | null;
  scoreLogistique?: number | null;
  scorePredictedLabel?: string | null;
}

interface RatingPanelProps {
  mission: MissionWithEval;
  onClose: () => void;
}

// ── Étoiles ──────────────────────────────────────────────────

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Insuffisant", "Passable", "Bien", "Très bien", "Excellent"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hovered || value);
          return (
            <button
              key={star}
              disabled={disabled}
              onMouseEnter={() => !disabled && setHovered(star)}
              onMouseLeave={() => !disabled && setHovered(0)}
              onClick={() => !disabled && onChange(star)}
              className={`text-3xl leading-none transition-all duration-150 px-0.5 select-none
                ${disabled ? "cursor-default" : "cursor-pointer hover:scale-110"}
                ${active ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "text-zinc-700"}
              `}
            >
              ★
            </button>
          );
        })}
      </div>
      <span className={`text-xs font-semibold h-4 transition-all ${
        hovered || value ? "text-amber-400 opacity-100" : "opacity-0"
      }`}>
        {labels[hovered || value]}
      </span>
    </div>
  );
}

// ── Barre score IA ───────────────────────────────────────────

function ScoreBar({ score, label }: { score: number; label: string }) {
  const percent = Math.round(score * 100);
  const color =
    percent >= 80 ? { bar: "bg-emerald-500", text: "text-emerald-400", badge: "bg-emerald-950 text-emerald-400 border-emerald-800" }
    : percent >= 50 ? { bar: "bg-orange-500", text: "text-orange-400", badge: "bg-orange-950 text-orange-400 border-orange-800" }
    : { bar: "bg-red-500", text: "text-red-400", badge: "bg-red-950 text-red-400 border-red-800" };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">
          Score IA
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color.badge}`}>
          {label}
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.bar}`}
          style={{ width: `${percent}%`, boxShadow: `0 0 8px currentColor` }}
        />
      </div>
      <div className={`text-right text-xs font-bold ${color.text}`}>{percent}%</div>
    </div>
  );
}

// ── Panneau principal ────────────────────────────────────────

export default function RatingPanel({ mission, onClose }: RatingPanelProps) {
  const [note, setNote] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [noterMission, { loading, error }] = useMutation<
    { noterMissionConvoyeur: boolean },
    { missionId: string; note: number }
  >(NOTER_MISSION_CONVOYEUR);

  const alreadyRated =
    submitted ||
    (mission.noteAgent != null && mission.scoreLogistique != null);

  const displayNote = submitted ? note : (mission.noteAgent ?? 0);

  const handleSubmit = useCallback(async () => {
    if (!note || loading) return;
    try {
      await noterMission({ variables: { missionId: mission.missionId, note } });
      setSubmitted(true);
    } catch (e) {
      console.error("Erreur notation:", e);
    }
  }, [note, loading, mission.missionId, noterMission]);

  return (
    /* Overlay transparent pour fermer en cliquant dehors */
    <div
      className="absolute inset-0 z-[1100]"
      onClick={onClose}
    >
      {/* Panneau flottant — stoppe la propagation du clic */}
      <div
        className="absolute bottom-8 right-4 w-72 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-gradient-to-r from-orange-950/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-base">
              {alreadyRated ? "✅" : "⭐"}
            </span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">
                {alreadyRated ? "Mission évaluée" : "Évaluer le convoyeur"}
              </p>
              <p className="text-[10px] text-zinc-500 leading-tight">
                Mission terminée
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {/* Infos mission */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-zinc-800/60">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base flex-shrink-0">
            🚗
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{mission.vehicleName}</p>
            <p className="text-[11px] text-zinc-400 truncate">{mission.convoyeurName}</p>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {alreadyRated ? (
            /* ── Vue résultat ── */
            <>
              {/* Note affichée */}
              <div className="text-center space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Note de l&apos;agent</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl text-amber-400 tracking-wider">
                    {"★".repeat(displayNote)}
                    <span className="text-zinc-700">{"★".repeat(5 - displayNote)}</span>
                  </span>
                  <span className="text-sm font-bold text-white">{displayNote}/5</span>
                </div>
              </div>

              {/* Score IA si disponible */}
              {mission.scoreLogistique != null && mission.scorePredictedLabel != null && (
                <ScoreBar
                  score={mission.scoreLogistique}
                  label={mission.scorePredictedLabel}
                />
              )}

              {/* Message de confirmation si vient d'être soumis */}
              {submitted && !mission.scoreLogistique && (
                <div className="bg-emerald-950/50 border border-emerald-800/50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-xs text-emerald-400 font-semibold">
                    Évaluation envoyée avec succès
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Le score IA sera disponible prochainement
                  </p>
                </div>
              )}
            </>
          ) : (
            /* ── Vue notation ── */
            <>
              <p className="text-[11px] text-zinc-500 text-center">
                Comment s&apos;est passée la mission ?
              </p>

              <StarRating value={note} onChange={setNote} disabled={loading} />

              {error && (
                <p className="text-[10px] text-red-400 text-center bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2">
                  Erreur : {error.message}
                </p>
              )}

              <button
                disabled={!note || loading}
                onClick={handleSubmit}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2
                  ${note && !loading
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-900/40 hover:from-orange-500 hover:to-orange-400 active:scale-95"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  }`}
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  "Valider l'évaluation"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}