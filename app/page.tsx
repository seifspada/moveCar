'use client'

import { FinalCTA, Footer } from "@/components/accueil-components/CTAFooter"
import Features from "@/components/accueil-components/Features"
import Hero from "@/components/accueil-components/Hero"
import HowItWorks from "@/components/accueil-components/HowItWorks"
import Navbar from "@/components/accueil-components/Navbar"
import SocialProof from "@/components/accueil-components/SocialProof"
import { PricingSection, TrustSection } from "@/components/accueil-components/TrustPricing"

const Divider = () => (
  <div className="max-w-6xl mx-auto px-10">
    <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      {/* Fixed background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-52 -left-52 w-[600px] h-[600px] rounded-full bg-violet-500/[0.04] blur-3xl" />
        <div className="absolute top-1/3 -right-52 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/[0.04] blur-3xl" />
      </div>

      <main>
        <Hero />
        <Divider />
        <HowItWorks />
        <Divider />
        <Features />
        <TrustSection />
        <Divider />
        <SocialProof />
        <Divider />
        <PricingSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}