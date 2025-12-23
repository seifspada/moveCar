// SidebarAdherant.tsx
import { Briefcase, Calendar, Heart, User, LogOut, X } from 'lucide-react';
import Image from 'next/image';

interface SidebarAdherantProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  isDesktopMenuOpen: boolean;
  onDesktopMenuToggle: () => void;
}

export default function SidebarAdherant({ 
  isMobileMenuOpen, 
  onMobileMenuToggle,
  isDesktopMenuOpen,
  onDesktopMenuToggle
}: SidebarAdherantProps) {
  
  const menuItems = [
    { icon: Briefcase, label: 'Liste des missions', href: '#missions' },
    { icon: Calendar, label: 'Réservations', href: '#reservations' },
    { icon: Heart, label: 'Favoris', href: '#favoris' },
    { icon: User, label: 'Compte', href: '#compte' },
  ];

  return (
    <>
      {/* ========================================
          DESKTOP SIDEBAR DRAWER
      ======================================== */}
      {isDesktopMenuOpen && (
        <>
          {/* Overlay Desktop */}
          <div 
            className="hidden md:block fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onDesktopMenuToggle}
          />
          
          {/* Sidebar Desktop Drawer */}
          <aside className="hidden md:flex md:flex-col fixed left-0 top-0 h-screen w-64 bg-black border-r border-orange-500 z-50 transform transition-transform duration-300">
            {/* Header avec logo et bouton fermer */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-orange-500">
              <div className="w-16 h-16  to-orange-600 rounded-lg flex items-center justify-center relative">
  <Image
    src="/images/R.jpeg"
    alt="Logo"
    fill
    className="object-contain"
  />
</div>

              <button 
                onClick={onDesktopMenuToggle} 
                className="text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={onDesktopMenuToggle}
                  className="flex items-center gap-4 px-4 py-3 text-white hover:bg-orange-500 rounded-lg transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-orange-500 group-hover:text-white" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Déconnexion */}
            <div className="p-4 border-t border-orange-500">
              <button className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-orange-500 rounded-lg transition-colors group">
                <LogOut className="w-6 h-6 text-orange-500 group-hover:text-white" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ========================================
          MOBILE SIDEBAR DRAWER
      ======================================== */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay Mobile */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onMobileMenuToggle}
          />
          
          {/* Sidebar Mobile Drawer */}
          <aside className="md:hidden fixed left-0 top-0 h-screen w-64 bg-black border-r border-orange-500 z-50 transform transition-transform duration-300">
            {/* Header avec logo et bouton fermer */}
            <div className="h-20 flex items-center justify-between px-4 border-b border-orange-500">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <button 
                onClick={onMobileMenuToggle} 
                className="text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-4 py-8 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={onMobileMenuToggle}
                  className="flex items-center gap-4 px-4 py-3 text-white hover:bg-orange-500 rounded-lg transition-colors group"
                >
                  <item.icon className="w-6 h-6 text-orange-500 group-hover:text-white" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Déconnexion */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-orange-500">
              <button className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-orange-500 rounded-lg transition-colors group">
                <LogOut className="w-6 h-6 text-orange-500 group-hover:text-white" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}