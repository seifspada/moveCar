'use client';

import { useState } from "react";
import ProfileHeader from "./ProfileHeaderAdherent";
import SidebarAdherent from "./SideBarAdherent";

export default function AdherentLayoutWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  return (
    <>
      <ProfileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        toggleDesktopMenu={() => setIsDesktopMenuOpen(prev => !prev)}
      />
      <SidebarAdherent
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={() => setIsDesktopMenuOpen(prev => !prev)}
      />
    </>
  );
}