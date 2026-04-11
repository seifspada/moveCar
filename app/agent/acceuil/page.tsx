// app/agent/dashboard/page.tsx
"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useRoleProtection } from "@/app/hooks/userRoleProtection";
import SideBarAgent from "@/components/agent-component/SideBarAgent";
import ProfileHeaderAgent from "@/components/agent-component/ProfieHeaderAgent";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AgentDashboard() {
  // Protection du rôle agent
  useRoleProtection({ allowedRoles: ["agent"] });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen((prev) => !prev);

  // Données mockées (remplace par tes vraies données API)
  const [stats] = useState({
    totalMissions: 45,
    completedMissions: 32,
    todayEarnings: 850,
  });

  const [dailyEarnings] = useState({
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Gains (€)",
        data: [120, 190, 300, 500, 200, 300, 450],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderRadius: 8,
      },
    ],
  });

  const [missionStatus] = useState({
    labels: ["Complétées", "En cours", "Annulées"],
    datasets: [
      {
        data: [32, 10, 3],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(251, 191, 36, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  });

  const recentMissions = [
    { id: "#AG001", departure: "Tunis", arrival: "Sfax", date: "05/03/26", status: "completed", price: 250 },
    { id: "#AG002", departure: "Sousse", arrival: "Gabès", date: "05/03/26", status: "pending", price: 180 },
    { id: "#AG003", departure: "Bizerte", arrival: "Kairouan", date: "04/03/26", status: "completed", price: 320 },
    { id: "#AG004", departure: "Ariana", arrival: "Monastir", date: "04/03/26", status: "completed", price: 210 },
    { id: "#AG005", departure: "Sfax", arrival: "Gafsa", date: "03/03/26", status: "cancelled", price: 150 },
  ];

  const completionRate = ((stats.completedMissions / stats.totalMissions) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-black">
      

      {/* Contenu dashboard */}
      <main className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tableau de bord Agent
            </h1>
            <p className="text-gray-600 mt-2">Gestion de vos missions de convoyage</p>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Missions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalMissions}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Complétées</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.completedMissions}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Taux de complétion</p>
                  <p className="text-3xl font-bold text-purple-600">{completionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Gains du jour</p>
                  <p className="text-3xl font-bold text-amber-600">€{stats.todayEarnings}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Progression + villes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                Progression Missions
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {stats.completedMissions}/{stats.totalMissions}
                </span>
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">{completionRate}% complété</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Villes Populaires</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">🚗 Départ: Tunis</span>
                  <span className="text-emerald-600 font-semibold">12 missions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">🚗 Départ: Sfax</span>
                  <span className="text-emerald-600 font-semibold">8 missions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">🏁 Arrivée: Sousse</span>
                  <span className="text-emerald-600 font-semibold">10 missions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-medium">🏁 Arrivée: Gabès</span>
                  <span className="text-emerald-600 font-semibold">7 missions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Gains par jour</h3>
              <Bar
                data={dailyEarnings}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: "gray" },
                    },
                    x: {
                      ticks: { color: "gray" },
                    },
                  },
                }}
                height={300}
              />
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Statut des missions</h3>
              <div className="h-80 flex items-center justify-center">
                <Pie
                  data={missionStatus}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Missions récentes */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Missions récentes</h3>
              <p className="text-gray-600">Dernières 5 missions assignées</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Départ → Arrivée
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentMissions.map((mission) => (
                    <tr key={mission.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {mission.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 font-medium">{mission.departure}</span>
                          <svg
                            className="w-4 h-4 mx-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-sm text-gray-500">{mission.arrival}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mission.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            mission.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : mission.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {mission.status === "completed"
                            ? "✓ Complétée"
                            : mission.status === "pending"
                            ? "⏳ En cours"
                            : "✗ Annulée"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        €{mission.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
