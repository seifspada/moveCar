'use client';

import { useState } from "react";
import ProfileHeader from "./ProfileHeaderPartenaire";
import SidebarPartenaire from "./SideBarPartenaire";

export default function PartenaireLayoutWrapper() {
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
      <SidebarPartenaire
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={() => setIsDesktopMenuOpen(prev => !prev)}
      />
    </>
  );
}