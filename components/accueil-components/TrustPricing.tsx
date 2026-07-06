'use client'
import { useEffect, useRef, useState } from 'react'
import { BadgeCheck, FileText, Lock, Star, Phone, ScrollText, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const trustItems = [
  { icon: BadgeCheck,  title: 'Identité vérifiée',    desc: 'Chaque convoyeur passe par une vérification KYC complète avant sa première mission.' },
  { icon: FileText,    title: 'Permis validé',         desc: 'Numéro de permis vérifié auprès des autorités françaises pour chaque profil.' },
  { icon: Lock,        title: 'Données sécurisées',    desc: 'Chiffrement AES-256. Vos données ne sont jamais revendues. RGPD compliant.' },
  { icon: Star,        title: 'Système de notation',   desc: 'Agences et convoyeurs se notent mutuellement. La qualité garantie par la communauté.' },
  { icon: Phone,       title: 'Support 7j/7',          desc: 'Une équipe dédiée disponible tous les jours pour gérer les incidents et questions.' },
  { icon: ScrollText,  title: 'Contrats automatiques', desc: "Chaque mission génère un contrat légal horodaté. Vous êtes protégé à chaque étape." },
]

export function TrustSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="confiance" className="py-28 max-w-6xl mx-auto px-6 md:px-10">

      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
          Sécurité & Confiance
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-4">
          Votre sécurité,<br />
          notre <span className="text-orange-600">priorité absolue</span>
        </h2>
        <p className="text-zinc-400 text-base font-light max-w-md mx-auto leading-relaxed">
          Nous avons construit MoveCar sur des fondations de confiance. Chaque détail est pensé pour protéger agences et convoyeurs.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {trustItems.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 transition-all duration-300"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: `all 0.6s ease-out ${0.05 + i * 0.07}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <Icon className="w-4.5 h-4.5 text-zinc-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-light">{item.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

const agencyFeatures = [
  'Publication de missions illimitée',
  'Tableau de bord multi-agences',
  'Suivi GPS inclus',
  'Contrats automatiques',
  'Support prioritaire',
]

const convoyeurFeatures = [
  'Accès à toutes les missions en France',
  'Paiement rapide sous 48h',
  'Application mobile iOS & Android',
  'Navigation GPS intégrée',
  'Historique et gains détaillés',
]

export function PricingSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="tarification" className="py-28 relative">
      <div className="max-w-4xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-700 text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
            Tarification
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
            Simple. Transparent.<br />
            <span className="text-orange-600">Aucune surprise.</span>
          </h2>
        </div>

        {/* Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Agency card */}
          <div className="relative overflow-hidden rounded-2xl border border-orange-600/20 bg-zinc-900/60 p-10">
            <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-orange-600/[0.05] blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 rounded-full px-3.5 py-1 mb-6 text-[11px] font-black text-orange-600 tracking-widest">
              POUR LES AGENCES
            </div>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-6xl font-black text-orange-600 leading-none tracking-tighter">0</span>
              <span className="text-2xl font-black text-orange-600 mb-1.5">€</span>
            </div>
            <div className="text-sm font-bold text-white mb-3">Commission par mission</div>
            <p className="text-zinc-500 text-sm leading-relaxed font-light mb-7">
              Pas d'abonnement. Pas de frais cachés. Vous ne payez que lorsque votre véhicule est livré avec succès.
            </p>

            {agencyFeatures.map(item => (
              <div key={item} className="flex items-center gap-2.5 mb-2.5">
                <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="text-sm text-zinc-400 font-light">{item}</span>
              </div>
            ))}

            <Link
  href="/formulaire/partenaire/fiche-partenaire-formulaire"
  className="w-full mt-7 flex items-center justify-center gap-2 py-3.5 bg-orange-600 hover:bg-yellow-200 text-zinc-950 text-sm font-bold rounded-xl transition-all duration-200"
>
  Créer mon compte agence
  <ArrowRight className="w-4 h-4" />
</Link>
          </div>

          {/* Convoyeur card */}
          <div className="relative overflow-hidden rounded-2xl border border-teal-400/20 bg-zinc-900/60 p-10">
            <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-teal-400/[0.05] blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-teal-400/10 border border-teal-400/20 rounded-full px-3.5 py-1 mb-6 text-[11px] font-black text-teal-400 tracking-widest">
              POUR LES CONVOYEURS
            </div>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-6xl font-black text-teal-400 leading-none tracking-tighter">10</span>
              <span className="text-2xl font-black text-teal-400 mb-1.5">%</span>
            </div>
            <div className="text-sm font-bold text-white mb-3">Inscription gratuite</div>
            <p className="text-zinc-500 text-sm leading-relaxed font-light mb-7">
              Inscrivez-vous gratuitement, complétez votre vérification, et commencez à accepter des missions dès aujourd'hui.
            </p>

            {convoyeurFeatures.map(item => (
              <div key={item} className="flex items-center gap-2.5 mb-2.5">
                <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="text-sm text-zinc-400 font-light">{item}</span>
              </div>
            ))}
            
           <Link
  href="/formulaire/adherent/inscription-formulaire"
  className="w-full mt-7 flex items-center justify-center gap-2 py-3.5 bg-transparent hover:bg-teal-400/[0.06] text-teal-400 text-sm font-bold border border-teal-400/30 hover:border-teal-400/50 rounded-xl transition-all duration-200"
>
  Devenir convoyeur
  <ArrowRight className="w-4 h-4" />
</Link>
          </div>
        </div>

        {/* Fine print */}
        <p className={`text-center text-zinc-600 text-xs mt-6 font-light transition-all duration-700 delay-400 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          La commission de 10% est prélevée uniquement sur le montant de la mission, à la livraison confirmée.
        </p>
      </div>
    </section>
  )
}