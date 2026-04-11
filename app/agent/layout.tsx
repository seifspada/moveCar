// app/agent/layout.tsx

import AgentLayoutWrapper from "@/components/agent-component/AgentLayoutWrapper";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgentLayoutWrapper />
      {children}
    </>
  );
}