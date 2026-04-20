'use client'
import { useEffect, useRef, useState } from 'react'
import { ClipboardList, Handshake, MapPin, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    color: 'text-orange-600',
    bg: 'bg-orange-600/10',
    border: 'border-orange-600/20',
    glow: 'shadow-orange-600/20',
    num: 1,
    title: "L'agence publie",
    desc: "L'agence crée une mission en quelques secondes : départ, destination, véhicule, date, budget. Visible instantanément sur la plateforme.",
    tags: ['Multi-agences', 'Géolocalisation', 'Planning intégré'],
    tagColor: 'text-orange-600 bg-orange-600/10 border-orange-600/20',
  },
  {
    icon: Handshake,
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
    border: 'border-teal-400/20',
    glow: 'shadow-teal-400/20',
    num: 2,
    title: "Le convoyeur accepte",
    desc: "Les convoyeurs certifiés consultent les missions disponibles près d'eux, postulent, et sont confirmés. Tout se passe dans l'application.",
    tags: ['Vérification ID', 'Profil certifié', 'Notation mutuelle'],
    tagColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  },
  {
    icon: MapPin,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/20',
    glow: 'shadow-indigo-400/20',
    num: 3,
    title: "La mission commence",
    desc: "Le convoyeur prend le véhicule et démarre. Son smartphone envoie sa position GPS en temps réel. L'agence suit depuis son tableau de bord.",
    tags: ['GPS live', 'Alertes push', 'Rapport de fin'],
    tagColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  },
  {
    icon: CheckCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-600/10',
    border: 'border-orange-600/20',
    glow: 'shadow-orange-600/20',
    num: 4,
    title: "Livraison & paiement",
    desc: "À l'arrivée, le convoyeur confirme avec une photo. Le paiement est automatiquement déclenché. Mission archivée dans l'historique.",
    tags: ['Paiement auto', 'Photo preuve', 'Archivage légal'],
    tagColor: 'text-orange-600 bg-orange-600/10 border-orange-600/20',
  },
]

export default function HowItWorks() {
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
    <section ref={ref} id="comment-ca-marche" className="py-28 max-w-6xl mx-auto px-6 md:px-10">

      {/* Header */}
      <div className={`text-center mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
          Processus simplifié
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed font-light">
          De la publication à la livraison, tout est automatisé et transparent.
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">

        {/* Connector line — desktop only */}
        <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-zinc-800 z-0">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 via-teal-400 to-indigo-400 transition-all duration-[2s] ease-out delay-500"
            style={{ width: visible ? '100%' : '0%' }}
          />
        </div>

        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div
              key={i}
              className={`relative z-10 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
            >
              <div className="px-3 py-4">
                {/* Icon circle */}
                <div className={`relative w-[72px] h-[72px] rounded-full ${step.bg} border ${step.border} flex items-center justify-center mb-5 group-hover:shadow-lg transition-all duration-300 cursor-default hover:shadow-lg ${step.glow}`}>
                  <Icon className={`w-7 h-7 ${step.color}`} />
                  {/* Step number badge */}
                  <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-950 bg-orange-600`}>
                    {step.num}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-2.5">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-light mb-4">{step.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {step.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${step.tagColor} tracking-wide`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}