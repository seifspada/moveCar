'use client'
import { useEffect, useRef, useState } from 'react'
import { Star, MapPin, Clock, Map } from 'lucide-react'

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Directrice, Groupe Étoile Auto — Paris',
    avatar: 'MD',
    accent: 'text-orange-600',
    avatarBg: 'bg-orange-600/10 border-orange-600/30',
    text: "ConvoyPro a transformé notre gestion des transferts. On économise 6h de coordination par semaine. Le suivi en temps réel est un game changer.",
  },
  {
    name: 'Thomas Renard',
    role: 'Convoyeur indépendant — Lyon',
    avatar: 'TR',
    accent: 'text-teal-400',
    avatarBg: 'bg-teal-400/10 border-teal-400/30',
    text: "En 3 mois, j'ai réalisé 47 missions via ConvoyPro. L'app est fluide, les paiements sont rapides. C'est devenu ma principale source de revenus.",
  },
  {
    name: 'Pierre Laurent',
    role: 'Responsable logistique, Auto Sud — Marseille',
    avatar: 'PL',
    accent: 'text-indigo-400',
    avatarBg: 'bg-indigo-400/10 border-indigo-400/30',
    text: "La transparence est totale. On sait où est le véhicule à tout moment. Plus d'appels incessants. Un produit vraiment pensé pour les pros.",
  },
]

const mapCities = [
  { name: 'Paris',      x: '48%', y: '22%' },
  { name: 'Lyon',       x: '58%', y: '52%' },
  { name: 'Marseille',  x: '58%', y: '75%' },
  { name: 'Bordeaux',   x: '28%', y: '62%' },
  { name: 'Nantes',     x: '26%', y: '38%' },
  { name: 'Lille',      x: '50%', y: '10%' },
  { name: 'Strasbourg', x: '74%', y: '25%' },
  { name: 'Toulouse',   x: '38%', y: '74%' },
]

export default function SocialProof() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeCity, setActiveCity] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setActiveCity(c => (c + 1) % mapCities.length), 1500)
    return () => clearInterval(iv)
  }, [])

  return (
    <section ref={ref} className="py-20 max-w-6xl mx-auto px-6 md:px-10">

      {/* Header */}
      <div className={`text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
          Témoignages
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
          Ils font confiance à ConvoyPro
        </h2>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 hover:border-zinc-700 transition-all duration-300"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: `all 0.6s ease-out ${i * 0.1}s` }}
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className={`w-3.5 h-3.5 ${t.accent}`} fill="currentColor" />
              ))}
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed font-light mb-5 italic">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full border ${t.avatarBg} flex items-center justify-center text-xs font-bold ${t.accent}`}>
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{t.name}</div>
                <div className="text-xs text-zinc-500 font-light">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map + stats */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 items-center transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Text side */}
        <div>
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
            Déployé partout en France
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight mb-4">
            De Paris à Marseille,<br />
            <span className="text-orange-600">nous couvrons tout</span>
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed font-light mb-8">
            Plus de 850 convoyeurs actifs répartis sur tout le territoire. Une mission publiée à Lyon est acceptée en moins de 45 minutes en moyenne.
          </p>

          <div className="flex gap-8">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xl font-black text-orange-600">&lt; 45min</span>
              </div>
              <div className="text-xs text-zinc-500">Temps d'acceptation moyen</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Map className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xl font-black text-orange-600">96 dép.</span>
              </div>
              <div className="text-xs text-zinc-500">Départements couverts</div>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="relative h-80 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center">
          {/* France SVG */}
          <svg viewBox="0 0 200 220" className="w-[60%] h-[60%]">
            <path
              d="M95,5 L115,8 L135,18 L150,25 L165,35 L175,50 L180,65 L178,80 L172,92 L168,105 L170,118 L165,130 L158,140 L150,148 L140,158 L130,168 L118,178 L108,185 L95,190 L80,185 L65,175 L52,165 L42,155 L35,142 L30,130 L28,115 L30,100 L28,85 L25,70 L28,55 L35,42 L45,30 L58,20 L72,12 Z"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
            />
          </svg>

          {/* City dots */}
          {mapCities.map((city, i) => (
            <div
              key={city.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: city.x, top: city.y }}
            >
              <div className={`rounded-full transition-all duration-300 ${
                i === activeCity
                  ? 'w-2.5 h-2.5 bg-orange-600 shadow-[0_0_12px_theme(colors.yellow.300)]'
                  : 'w-1.5 h-1.5 bg-teal-400/60'
              }`}>
                {i === activeCity && (
                  <>
                    <div className="absolute inset-[-4px] rounded-full border border-orange-600/50 animate-ping" />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-600 text-zinc-950 text-[9px] font-black px-1.5 py-0.5 rounded whitespace-nowrap">
                      {city.name}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Badge */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 rounded-lg px-3 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_theme(colors.teal.400)]" />
            <span className="text-[11px] font-bold text-white">23 missions en cours</span>
          </div>

          {/* MapPin icon top-left */}
          <div className="absolute top-4 left-4">
            <MapPin className="w-4 h-4 text-zinc-700" />
          </div>
        </div>
      </div>
    </section>
  )
}