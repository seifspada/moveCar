'use client'
import { useEffect, useRef, useState } from 'react'
import { Building2, Car, Check, Apple, Play, Zap, Twitter, Github, Mail } from 'lucide-react'

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* BG radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(234,179,8,0.05)_0%,transparent_70%)] pointer-events-none" />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div
        className={`max-w-3xl mx-auto text-center relative transition-all duration-700 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'}`}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-600/[0.06] border border-orange-600/15 rounded-full px-5 py-2 mb-10 text-sm font-semibold text-zinc-300/70">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
          Rejoignez 850+ convoyeurs actifs en France
        </div>

        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white mb-6">
          Prêt à lancer<br />
          <span className="text-orange-600">votre première</span><br />
          mission ?
        </h2>

        <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-md mx-auto mb-12">
          Inscription en 3 minutes. Première mission publiée aujourd'hui.
          Le réseau de convoyage le plus fiable de France.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button className="flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-400 text-zinc-950 text-sm font-bold rounded-xl transition-all duration-200 shadow-xl shadow-orange-600/10">
            <Building2 className="w-4 h-4" />
            Inscrire mon agence
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-transparent hover:bg-white/[0.03] text-white text-sm font-semibold border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all duration-200">
            <Car className="w-4 h-4" />
            Devenir convoyeur
          </button>
        </div>

        {/* Trust chips */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-zinc-600 font-light">
          {['Sans engagement', 'Support inclus', 'RGPD conforme'].map((item, i) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-zinc-600" />
              {item}
              {i < 2 && <span className="text-zinc-800 ml-1.5">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* App badges */}
      <div className={`flex justify-center gap-4 mt-14 flex-wrap transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
        {[
          { Icon: Apple, name: 'App Store',    sub: 'Télécharger sur' },
          { Icon: Play,  name: 'Google Play',  sub: 'Disponible sur' },
        ].map(({ Icon, name, sub }) => (
          <button
            key={name}
            className="flex items-center gap-3 bg-white/[0.04] hover:bg-orange-600/[0.05] border border-white/[0.08] hover:border-orange-600/25 rounded-xl px-5 py-3 transition-all duration-200"
          >
            <Icon className="w-6 h-6 text-white" />
            <div className="text-left">
              <div className="text-[10px] text-zinc-500 tracking-wide">{sub}</div>
              <div className="text-sm font-bold text-white">{name}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export function Footer() {
  const links = ['Mentions légales', 'Confidentialité', 'CGU', 'Contact', 'Blog']
  const socials = [
    { Icon: Twitter, label: 'Twitter' },
    { Icon: Github,  label: 'GitHub' },
    { Icon: Mail,    label: 'Email' },
  ]

  return (
    <footer className="border-t border-zinc-900 py-10 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 flex-wrap">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-600 rounded-md flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5 text-zinc-950" fill="currentColor" />
          </div>
          <span className="font-black text-base tracking-tight text-white">
            Convoy<span className="text-orange-600">Pro</span>
          </span>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-6 justify-center">
          {links.map(link => (
            <a
              key={link}
              href="#"
              className="text-zinc-600 hover:text-zinc-300 text-xs font-medium transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right: social + copyright */}
        <div className="flex items-center gap-4">
          {socials.map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
          <span className="text-zinc-700 text-xs ml-2">© {new Date().getFullYear()} ConvoyPro</span>
        </div>
      </div>
    </footer>
  )
}