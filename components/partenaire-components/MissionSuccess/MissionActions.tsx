// components/MissionSuccess/MissionActions.tsx

import React from 'react';

interface MissionActionsProps {
  onPrint: () => void;
  onNewMission: () => void;
}

export const MissionActions: React.FC<MissionActionsProps> = ({ onPrint, onNewMission }) => (
  <div className="flex gap-4 justify-center pt-4 border-t-2 border-orange-200 print:hidden">
    <button
      onClick={onPrint}
      className="px-6 py-2.5 border-2 border-orange-600 rounded-xl text-orange-700 font-semibold hover:bg-orange-50 transition-all flex items-center gap-2 text-sm"
    >
      <span className="text-lg">🖨️</span> Imprimer
    </button>
    <button
      onClick={onNewMission}
      className="px-8 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
    >
      <span className="text-lg">➕</span> Nouvelle demande
    </button>
  </div>
);