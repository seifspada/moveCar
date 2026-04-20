'use client'
import { useState, useEffect } from 'react'
import { Menu, X, Zap, LogIn, ArrowRight } from 'lucide-react'

const navLinks = [
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Tarification', href: '#tarification' },
  { label: 'Confiance', href: '#confiance' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'py-3 bg-zinc-950/90 backdrop-blur-xl border-b border-white/[0.06]'
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-zinc-950" fill="currentColor" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Convoy<span className="text-orange-600">Pro</span>
          </span>
        </a>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-zinc-400 hover:text-orange-600 text-sm font-medium tracking-wide transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/auth/login"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 rounded-lg transition-all duration-200"
          >
            <LogIn className="w-3.5 h-3.5" />
            Connexion
          </a>
          <a
            href="/auth/register"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-zinc-950 bg-orange-600 hover:bg-yellow-200 rounded-lg transition-all duration-200 shadow-lg shadow-orange-600/10"
          >
            Commencer
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Burger — mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-zinc-950/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-zinc-400 hover:text-orange-600 text-sm font-medium py-2.5 border-b border-white/[0.04] last:border-0 transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 pt-3">
            <a href="/auth/login" className="flex-1 text-center py-2.5 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-lg">
              Connexion
            </a>
            <a href="/auth/register" className="flex-1 text-center py-2.5 text-sm font-semibold text-zinc-950 bg-orange-600 rounded-lg">
              Commencer
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}