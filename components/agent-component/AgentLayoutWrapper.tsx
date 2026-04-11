// app/components/agent-component/AgentLayoutWrapper.tsx
'use client';

import { useState } from "react";
import ProfileHeaderAgent from "@/components/agent-component/ProfieHeaderAgent";
import SideBarAgent from "@/components/agent-component/SideBarAgent";

export default function AgentLayoutWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  return (
    <>
      <ProfileHeaderAgent
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        toggleDesktopMenu={() => setIsDesktopMenuOpen(prev => !prev)}
      />
      <SideBarAgent
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={() => setIsDesktopMenuOpen(prev => !prev)}
      />
    </>
  );
}
