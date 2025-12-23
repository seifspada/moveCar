"use client"; // ← Ajoute cette ligne en tout premier

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* === Partie gauche : Image + Titre === */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-orange-500 relative overflow-hidden">
        <Image
          src="/images/Image.png"
          alt="Convoyeur industriel et logistique"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full text-white px-12">
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight">
            Déplacement de véhicules
          </h1>
          <p className="text-2xl font-light text-center max-w-lg">
            Convoyage de véhicules privés et services de transport fiables
          </p>
          <div className="mt-10">
            <svg className="w-24 h-24 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm18.37-9.54l-2.83-2.83a.996.996 0 0 0-1.41 0l-1.73 1.73 3.75 3.75 1.73-1.73a.996.996 0 0 0 0-1.41l-.51-.51z"/>
            </svg>
          </div>
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
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-500"
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
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-500"
                  placeholder="Entrer votre mot de passe"
                />
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-700 to-orange-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:from-orange-800 hover:to-orange-700 transform hover:scale-105 transition duration-200"
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