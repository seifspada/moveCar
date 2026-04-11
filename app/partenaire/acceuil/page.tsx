// app/partenaire/accueil/page.tsx
'use client';

import { useUser } from '@/app/context/userContext';
import Link from 'next/link';
import { 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PartenaireAccueilPage() {
  const { currentUser } = useUser();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    missionsEnCours: 0,
    missionsTerminees: 0,
    missionsEnAttente: 0,
    gainsMois: 0
  });

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  // ✅ Charger les statistiques depuis l'API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/partenaire/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      }
    };

    if (currentUser?.role === 'partenaire') {
      fetchStats();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
     

      {/* Contenu principal */}
      <div className="pt-20 md:pt-24 px-4 md:px-8 lg:px-12 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Message de bienvenue personnalisé */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Bienvenue, {currentUser?.entite || 'Partenaire'} ! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Voici un aperçu de votre activité
            </p>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Missions en cours */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-200 text-sm font-medium">En cours</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">
                {stats.missionsEnCours}
              </p>
              <p className="text-orange-200 text-sm">Missions actives</p>
            </div>

            {/* Missions en attente */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-200 text-sm font-medium">En attente</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">
                {stats.missionsEnAttente}
              </p>
              <p className="text-blue-200 text-sm">À traiter</p>
            </div>

            {/* Missions terminées */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-200 text-sm font-medium">Terminées</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">
                {stats.missionsTerminees}
              </p>
              <p className="text-green-200 text-sm">Ce mois-ci</p>
            </div>

            {/* Gains du mois */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-200 text-sm font-medium">Revenus</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">
                {stats.gainsMois.toFixed(0)} €
              </p>
              <p className="text-purple-200 text-sm">Ce mois-ci</p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Créer une mission */}
            <Link
              href="/partenaire/demande-mission"
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                    <MapPin className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Nouvelle mission
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Créer une demande de déplacement de véhicule
                  </p>
                  <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                    Créer maintenant
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Voir les missions */}
            <Link
              href="/partenaire/missions"
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                    <Calendar className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Mes missions
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Consulter et gérer toutes vos missions
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    Voir la liste
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Missions récentes */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Missions récentes
              </h2>
              <Link
                href="/partenaire/missions"
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Liste des missions (exemple) */}
            <div className="space-y-4">
              {/* Mission 1 */}
              <div className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Paris → Lyon</p>
                      <p className="text-sm text-gray-500">Peugeot 308 • 465 km</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                    En cours
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Aujourd'hui
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-gray-900">450.00 €</span>
                </div>
              </div>

              {/* Aucune mission */}
              {stats.missionsEnCours === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">Aucune mission récente</p>
                  <Link
                    href="/partenaire/demande-mission"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                  >
                    Créer une mission
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Infos partenaire */}
          <div className="mt-8 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  📧 {currentUser?.email}
                </h3>
                <p className="text-orange-100 text-sm">
                  Votre compte partenaire est actif
                </p>
              </div>
              <Link
                href="/partenaire/profile"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Mon profil
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
