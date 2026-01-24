"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Vider les champs au chargement de la page
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
    });
    setError("");
    
    // ✅ Forcer le navigateur à vider les champs après un court délai
    setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';
    }, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      console.log("Réponse API Next.js:", data);

      // ✅ TOUT SAUVEGARDER DANS LOCALSTORAGE
      const token = data.access_token || data.accessToken;
      if (token) {
        localStorage.setItem("accessToken", token);
      }
      
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      const userRole = data.role;

      if (!userRole || typeof userRole !== 'string') {
        throw new Error("Rôle utilisateur invalide ou manquant");
      }

      // ✅ SAUVEGARDER LE RÔLE DANS LOCALSTORAGE
      localStorage.setItem("role", userRole);
      
      console.log("✅ Rôle sauvegardé dans localStorage:", userRole);

      const roleRoutes: Record<string, string> = {
        adherent: '/adherent/mission-page',
        partenaire: '/partenaire/demande-mission',
        admin: '/admin/overview',
        manager: '/manager/home',
      };

      const redirectPath = roleRoutes[userRole];
      
      if (!redirectPath) {
        throw new Error(`Rôle non autorisé: ${userRole}`);
      }

      console.log("✅ Redirection vers:", redirectPath);

      // ✅ RÉINITIALISER LE FORMULAIRE AVANT LA REDIRECTION
      setFormData({
        email: "",
        password: "",
      });

      // ✅ Vider physiquement les inputs
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      
      if (emailInput) emailInput.value = '';
      if (passwordInput) passwordInput.value = '';

      // ✅ Utiliser replace au lieu de push pour éviter de revenir à la page login
      router.replace(redirectPath);

    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 pt-45">
      {/* === Partie gauche : Image + Titre === */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/loginImage.jpg"
            alt="Convoyeur industriel et logistique"
            fill
            sizes="50vw"
            className="object-cover object-bottom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        </div>

        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="relative z-10 flex flex-col justify-center items-start w-full h-full px-16 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-orange-400 text-sm font-medium">Service Premium</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
            Déplacement de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              véhicules
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-md leading-relaxed">
            Convoyage de véhicules privés et services de transport fiables pour tous vos besoins logistiques
          </p>

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

          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* === Partie droite : Formulaire === */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-20">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 -mt-10">
            <div className="relative inline-block">
              <Image
                src="/images/logo.jpg"
                alt="Logo TransConvoy"
                width={240}
                height={240}
                className="rounded-lg w-40 h-40"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-500 rounded"></div>
            </div>
          </div>

          <p className="text-center text-orange-600 mb-6">Transport & Convoyeurs</p>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Connexion à votre espace
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* ✅ Ajout de autoComplete="off" sur le formulaire */}
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            {/* ✅ Champs cachés pour tromper l'autocomplete */}
            <input type="email" name="fake_email" style={{ display: 'none' }} />
            <input type="password" name="fake_password" style={{ display: 'none' }} />

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="new-email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="votre.email@domaine.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Entrer votre mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-700 to-orange-600 text-white font-semibold text-lg rounded-full shadow-lg hover:from-green-800 hover:to-green-700 transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>

            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 space-y-3 sm:space-y-0">
              <Link
                href="/mot-de-passe-oublie"
                className="text-blue-700 hover:text-orange-600 font-medium transition underline-offset-4 hover:underline"
              >
                J&apos;ai oublié mon mot de passe
              </Link>

              <Link
                href="/inscription"
                className="text-orange-600 hover:text-blue-700 font-medium transition underline-offset-4 hover:underline"
              >
                Je n&apos;ai pas de compte ? Inscrivez-vous
              </Link>
            </div>
          </form>

          <p className="mt-10 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} TransConvoy – Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
}
