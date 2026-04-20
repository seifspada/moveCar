'use client'
import { useEffect, useRef, useState } from 'react'
import { Satellite, ShieldCheck, Building2, Zap, BarChart3, AlertTriangle, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Satellite,
    accent: 'text-orange-600',
    bg: 'bg-orange-600/[0.07]',
    border: 'border-orange-600/15',
    glow: 'bg-orange-600/[0.04]',
    title: 'Suivi GPS Temps Réel',
    desc: "Suivez chaque véhicule sur une carte interactive. Position mise à jour toutes les 10 secondes via le smartphone du convoyeur.",
    large: true,
  },
  {
    icon: ShieldCheck,
    accent: 'text-teal-400',
    bg: 'bg-teal-400/[0.07]',
    border: 'border-teal-400/15',
    glow: 'bg-teal-400/[0.04]',
    title: 'Convoyeurs Vérifiés',
    desc: "Chaque convoyeur est vérifié : permis, identité, antécédents. Vous ne confiez votre véhicule qu'à des professionnels.",
    large: false,
  },
  {
    icon: Building2,
    accent: 'text-indigo-400',
    bg: 'bg-indigo-400/[0.07]',
    border: 'border-indigo-400/15',
    glow: 'bg-indigo-400/[0.04]',
    title: 'Multi-Agences',
    desc: "Gérez plusieurs concessions depuis un seul tableau de bord. Parfait pour les groupes automobiles nationaux.",
    large: false,
  },
  {
    icon: Zap,
    accent: 'text-orange-400',
    bg: 'bg-orange-400/[0.07]',
    border: 'border-orange-400/15',
    glow: 'bg-orange-400/[0.04]',
    title: 'Missions Express',
    desc: "Besoin urgent ? Activez le mode Express pour trouver un convoyeur disponible dans les 2 heures.",
    large: false,
  },
  {
    icon: BarChart3,
    accent: 'text-orange-600',
    bg: 'bg-orange-600/[0.07]',
    border: 'border-orange-600/15',
    glow: 'bg-orange-600/[0.04]',
    title: 'Historique & Rapports',
    desc: "Chaque mission archivée avec rapport complet, photos, et signature. Votre comptabilité simplifiée.",
    large: true,
  },
  {
    icon: AlertTriangle,
    accent: 'text-teal-400',
    bg: 'bg-teal-400/[0.07]',
    border: 'border-teal-400/15',
    glow: 'bg-teal-400/[0.04]',
    title: 'Gestion des Incidents',
    desc: "Un problème en route ? Le convoyeur signale en un tap. Support réactif 7j/7 pour résoudre rapidement.",
    large: false,
  },
]

function FeatureCard({ feature, delay, visible }: { feature: typeof features[0]; delay: number; visible: boolean }) {
  const Icon = feature.icon
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${feature.border} bg-zinc-900/40 backdrop-blur-sm p-7 
        ${feature.large ? 'lg:col-span-2' : 'lg:col-span-1'}
        transition-all duration-700 ease-out hover:border-white/10 group cursor-default`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(28px)', transitionDelay: `${delay}s` }}
    >
      {/* BG orb */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${feature.glow} blur-2xl pointer-events-none`} />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-5`}>
        <Icon className={`w-5 h-5 ${feature.accent}`} />
      </div>

      <h3 className="text-base font-bold text-white tracking-tight mb-2.5">{feature.title}</h3>
      <p className={`text-zinc-500 text-sm leading-relaxed font-light ${feature.large ? 'max-w-md' : ''}`}>
        {feature.desc}
      </p>

      {/* Arrow */}
      <div className={`absolute bottom-5 right-5 ${feature.accent} opacity-20 group-hover:opacity-50 transition-opacity`}>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  )
}

export default function Features() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="fonctionnalites" className="py-28 relative">
      {/* Subtle grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 relative">
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
              Fonctionnalités
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
              Tout ce dont vous<br />
              <span className="text-orange-600">avez besoin</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-xs leading-relaxed font-light md:text-right">
            Une plateforme complète pensée pour les professionnels de l'automobile.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} delay={0.1 + i * 0.08} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  )
}