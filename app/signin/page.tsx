"use client"; // ← Ajoute cette ligne en tout premier

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50 pt-45">
      {/* === Partie gauche : Image + Titre === */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br   from-slate-900 via-slate-800 to-black relative  overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <Image
            src="/images/loginImage.jpg"
            alt="Convoyeur industriel et logistique"
            fill
            className="object-cover object-bottom"
            priority
          />
          {/* Overlay gradient léger pour lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>

        {/* Éléments décoratifs animés */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Contenu principal */}
        <div className="relative z-10 flex flex-col justify-center items-start w-full h-full px-16 space-y-8">
          {/* Badge moderne */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium">Service Premium</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            Déplacement de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              véhicules
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-md leading-relaxed">
            Convoyage de véhicules privés et services de transport fiables pour tous vos besoins logistiques
          </p>

          {/* Caractéristiques */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                ✓
              </div>
              <span className="text-sm font-medium">Service disponible 24/7</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                ✓
              </div>
              <span className="text-sm font-medium">Suivi en temps réel</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                ✓
              </div>
              <span className="text-sm font-medium">Conducteurs professionnels</span>
            </div>
          </div>

          {/* Icône décorative moderne */}
          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Grille décorative en fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* === Partie droite : Formulaire de connexion === */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-20">
        <div className="w-full max-w-md">
          {/* Logo centré avec carrés orange */}
          <div className="flex justify-center mb-8 -mt-10">
            <div className="relative inline-block">
              <Image
                src="/images/logo.jpg"
                alt="Logo TransConvoy"
                width={240}
                height={240}
                className="rounded-lg w-40 h-40"
              />

              {/* Carré orange - coin haut droit */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded"></div>

              {/* Carré orange - coin bas gauche */}
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-500 rounded"></div>
            </div>
          </div>

          {/* Sous-titre */}
          <p className="text-center text-orange-600 mb-6">Transport & Convoyeurs</p>

          {/* Titre principal */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Connexion à votre espace
          </h2>

          {/* Formulaire */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  placeholder="votre.email@domaine.com"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  placeholder="Entrer votre mot de passe"
                />
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-700 to-orange-600 text-white font-semibold text-lg rounded-full shadow-lg hover:from-green-800 hover:to-green-700 transform hover:scale-105 transition duration-200"
            >
              Se connecter
            </button>

            {/* Liens utiles */}
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 space-y-3 sm:space-y-0">
              <Link
                href="/mot-de-passe-oublie"
                className="text-blue-700 hover:text-orange-600 font-medium transition underline-offset-4 hover:underline"
              >
                J'ai oublié mon mot de passe
              </Link>

              <Link
                href="/inscription"
                className="text-orange-600 hover:text-blue-700 font-medium transition underline-offset-4 hover:underline"
              >
                Je n'ai pas de compte ? Inscrivez-vous
              </Link>
            </div>
          </form>

          {/* Pied de page */}
          <p className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TransConvoy – Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}