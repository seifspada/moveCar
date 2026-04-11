'use client';

import { useState } from "react";
import ProfileHeaderAdmin from "@/components/admin-components/ProfieHeaderAdmin";
import SidebarAdmin from "@/components/admin-components/SideBarAdmin";

export default function AdminLayoutWrapper() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  return (
    <>
      <ProfileHeaderAdmin
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        toggleDesktopMenu={() => setIsDesktopMenuOpen(prev => !prev)}
      />
      <SidebarAdmin
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(prev => !prev)}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={() => setIsDesktopMenuOpen(prev => !prev)}
      />
    </>
  );
}