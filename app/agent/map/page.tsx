'use client';

import DynamicAgentMap from "@/components/agent-component/suivie-missions/DynamicAgentMap";

export default function AgentMapPage() {
  return (
    <div className="h-screen w-full bg-zinc-950 overflow-hidden">
      <DynamicAgentMap />
    </div>
  );
}