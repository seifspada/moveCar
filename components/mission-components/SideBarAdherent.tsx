"use client";
import React, { useState, useEffect } from 'react';
import { X, Briefcase, Calendar, Heart, User, LogOut, Flag } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

// ============================================
// SIDEBAR COMPONENT — style miroir noir flou
// ============================================
interface SidebarAdherentProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  isDesktopMenuOpen: boolean;
  onDesktopMenuToggle: () => void;
}

export default function SidebarAdherent({
  isMobileMenuOpen,
  onMobileMenuToggle,
  isDesktopMenuOpen,
  onDesktopMenuToggle,
}: SidebarAdherentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const showNavbar = pathname.startsWith('/adherent');

  const menuItems = [
    { key: 'missions',        icon: Briefcase, label: 'Liste des missions',  href: '/adherent/mission-page' },
    { key: 'reservations',    icon: Calendar,  label: 'Réservations',        href: '/adherent/reservations' },
    { key: 'favoris',         icon: Heart,     label: 'Favoris',             href: '/adherent/favoris' },
    { key: 'compte',          icon: User,      label: 'Mon profil',          href: '/adherent/profile-adherent' },
    { key: 'departMission',   icon: Flag,      label: 'Départ Mission',      href: '/adherent/depart-mission/2' },
    { key: 'suivieMission',   icon: Flag,      label: 'Suivi Mission',       href: '/adherent/suivie-mission/1' },
    { key: 'mesReservations', icon: Flag,      label: 'Mes Réservations',    href: '/adherent/mes-reservations' },
  ];

  useEffect(() => {
    const currentItem = menuItems.find((item) => pathname === item.href);
    if (currentItem) {
      setActiveItem(currentItem.key);
    } else {
      const hash = window.location.hash.replace('#', '');
      if (hash && menuItems.find((item) => item.key === hash)) {
        setActiveItem(hash);
      }
    }
  }, [pathname]);

  const handleNavClick = (item: (typeof menuItems)[0]) => {
    setActiveItem(item.key);
    if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(item.href);
    }
  };

  const isItemActive = (item: (typeof menuItems)[0]) =>
    pathname === item.href || activeItem === item.key;

  if (!showNavbar) return null;

  // ── Shared glass styles ──────────────────────────────────────────────────
  const sidebarStyle: React.CSSProperties = {
    background: 'rgba(4, 4, 8, 0.72)',
    backdropFilter: 'blur(28px) saturate(180%) brightness(0.80)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%) brightness(0.80)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    boxShadow:
      '4px 0 40px rgba(0,0,0,0.7), inset -1px 0 0 rgba(255,255,255,0.04)',
  };

  const headerStyle: React.CSSProperties = {
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(255,255,255,0.03)',
  };

  const footerStyle: React.CSSProperties = {
    borderTop: '1px solid rgba(255,255,255,0.07)',
    background: 'rgba(0,0,0,0.3)',
  };

  const activeItemStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
  };

  const inactiveItemStyle: React.CSSProperties = {
    background: 'transparent',
    border: '1px solid transparent',
  };

  const activeIconColor = 'text-white';
  const inactiveIconColor = 'text-gray-400 group-hover:text-white';

  // ── Shared nav list ──────────────────────────────────────────────────────
  const NavList = ({ onClose }: { onClose: () => void }) => (
    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
      {menuItems.map((item) => {
        const active = isItemActive(item);
        return (
          <button
            key={item.key}
            onClick={() => { handleNavClick(item); onClose(); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group transform hover:scale-[1.02] text-white`}
            style={active ? activeItemStyle : inactiveItemStyle}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.border = '1px solid transparent';
              }
            }}
          >
            <item.icon
              className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                active ? activeIconColor : inactiveIconColor
              }`}
            />
            <span
              className="text-sm font-medium"
              style={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}
            >
              {item.label}
            </span>
            {/* Active indicator dot */}
            {active && (
              <span
                className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.7)', boxShadow: '0 0 6px rgba(255,255,255,0.5)' }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );

  // ── Close button ─────────────────────────────────────────────────────────
  const CloseBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-white p-2 rounded-lg transition-all duration-300 hover:scale-110"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <X className="w-5 h-5 text-gray-300" />
    </button>
  );

  // ── Logout button ─────────────────────────────────────────────────────────
  const LogoutBtn = () => (
    <button
      className="w-full flex items-center gap-4 px-4 py-3.5 text-white rounded-xl transition-all duration-300 group"
      style={{ border: '1px solid transparent' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)';
        (e.currentTarget as HTMLElement).style.border = '1px solid rgba(239,68,68,0.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.border = '1px solid transparent';
      }}
    >
      <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
      <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
        Déconnexion
      </span>
    </button>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────────── */}
      <aside
        className={`hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-72 z-[3000] transform transition-all duration-700 ease-out ${
          isDesktopMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={sidebarStyle}
      >
        {/* Top reflection line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.10) 60%, transparent)',
          }}
        />

        {/* Header — no image, just title + close */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={headerStyle}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-base font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em' }}
            >
              Menu
            </span>
          </div>
          <CloseBtn onClick={onDesktopMenuToggle} />
        </div>

        {/* Nav */}
        <NavList onClose={onDesktopMenuToggle} />

        {/* Footer */}
        <div className="p-3" style={footerStyle}>
          <LogoutBtn />
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR ──────────────────────────────────────────────── */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-screen w-80 z-[3000] transform transition-all duration-700 ease-out flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={sidebarStyle}
      >
        {/* Top reflection line */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0.10) 60%, transparent)',
          }}
        />

        {/* Header — no image */}
        <div
          className="flex items-center justify-between px-5 py-5"
          style={headerStyle}
        >
          <span
            className="text-base font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em' }}
          >
            Menu
          </span>
          <CloseBtn onClick={onMobileMenuToggle} />
        </div>

        {/* Nav */}
        <NavList onClose={onMobileMenuToggle} />

        {/* Footer */}
        <div className="p-3 mt-auto" style={footerStyle}>
          <LogoutBtn />
        </div>
      </aside>
    </>
  );
}