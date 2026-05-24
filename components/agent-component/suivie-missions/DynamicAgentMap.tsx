// components/mission-components/DynamicAgentMap.tsx
"use client";

import dynamic from "next/dynamic";

const DynamicAgentMap = dynamic(
  () => import("@/components/agent-component/suivie-missions/AgentMapView"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-zinc-500">Chargement de la carte...</p>
        </div>
      </div>
    ),
  }
);

export default DynamicAgentMap;