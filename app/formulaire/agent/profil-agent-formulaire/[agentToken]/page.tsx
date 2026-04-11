"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle, User, Mail, Building2,
  AlertCircle, Eye, EyeOff,
} from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation"; // ✅ ajout useSearchParams
import NavFormulaire from "@/app/components/navFormulaire";
import {
  CityAutocomplete,
  SelectedCity,
} from "@/components/mission-components/CityAutocomplete";

type RouteParams = { agentToken: string };

export default function AgentProfilForm() {
  const router = useRouter();
  const params = useParams<RouteParams>();
  const token = params.agentToken;
  const searchParams = useSearchParams();                      // ✅ ajout
  const codeFromUrl = searchParams.get("code") || "";          // ✅ ajout

  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agenceData, setAgenceData] = useState<any>(null);

  // Photo
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Champs formulaire
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");                          // 🔴 FIX ajouté
  const [prenom, setPrenom] = useState("");                    // 🔴 FIX ajouté
  const [telephone, setTelephone] = useState("");              // 🔴 FIX ajouté
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cgvAccepted, setCgvAccepted] = useState(false);

  // Ville autocomplete
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [ville, setVille] = useState("");                      // 🔴 FIX ajouté

  // ✅ Vérifier le token au chargement
  useEffect(() => {
    if (!token) {
      setError("Lien invalide : token manquant ou expiré");
      setLoading(false);
      return;
    }

fetch(`${process.env.NEXT_PUBLIC_API_URL}/agents/verify-token/${token}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body?.message || "Lien invalide ou expiré");
        return body;
      })
      .then((data) => {
        setAgenceData(data);
        setEmail(data.email);
        // Pré-remplir ville si disponible
        if (data.ville) {
          setVille(data.ville);
          setInputValue(data.ville);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Impossible de vérifier le lien");
        setLoading(false);
      });
  }, [token]);

  const handleCitySelect = (city: SelectedCity | null) => {
    setSelectedCity(city);
    setVille(city?.name || "");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La photo ne doit pas dépasser 5MB");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const truncateFileName = (name: string) =>
    name.length > 20 ? name.substring(0, 20) + "..." : name;

  // 🔴 FIX: photo optionnelle — ne bloque plus la soumission
  const isFormValid =
    nom.trim().length > 0 &&
    prenom.trim().length > 0 &&
    password.length >= 8 &&
    password === confirmPassword &&
    cgvAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !token) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("nom", nom);                             
      formData.append("prenom", prenom);                       
      if (telephone) formData.append("telephone", telephone);  
      if (ville) formData.append("ville", ville);              
      if (selectedFile) formData.append("photo", selectedFile);

   const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/agents/complete-profile/${token}`,
  { method: "POST", body: formData }
);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur lors de la création");
      }

      setIsAccountCreated(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push("/");

  // ─── États de chargement / erreur token ───────────────────────────────────

  if (error && !agenceData) {
    return (
      <>
        <NavFormulaire />
        <div className="min-h-screen bg-black py-12 px-4 pt-32">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Lien invalide ou expiré
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">💡 <strong>Que faire ?</strong></p>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1 text-left">
                    <li>• Vérifiez que vous avez cliqué sur le bon lien dans l&apos;email</li>
                    <li>• Le lien est valide pendant 7 jours seulement</li>
                    <li>• Contactez votre partenaire si le problème persiste</li>
                  </ul>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition"
                >
                  Retour à l&apos;accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading && !agenceData) {
    return (
      <>
        <NavFormulaire />
        <div className="min-h-screen bg-black flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
            <p className="text-white text-xl">Vérification du lien...</p>
          </div>
        </div>
      </>
    );
  }

  // ─── Succès ────────────────────────────────────────────────────────────────

  if (isAccountCreated) {
    return (
      <>
        <NavFormulaire />
        <div className="min-h-screen bg-black py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  Profil agent créé avec succès
                </h2>
              </div>
              <div className="p-8 text-center py-12">
                {photo ? (
                  <div className="mb-6">
                    <Image
                      src={photo}
                      alt="Photo de profil"
                      width={120}
                      height={120}
                      className="object-cover rounded-full border-4 border-green-500 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                )}

                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 Bienvenue {prenom} {nom} !
                </h3>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <div className="text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700"><strong>Email :</strong> {email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-orange-600" />
                      <span className="text-gray-700">
                        <strong>Agence :</strong> {agenceData?.nomAgence || "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700"><strong>Statut :</strong> Compte actif</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => router.push("/")}
                    className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors shadow-lg"
                  >
                    Revenir à l&apos;accueil
                  </button>
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="px-10 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-full font-semibold hover:bg-orange-50 transition-colors"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── Formulaire principal ──────────────────────────────────────────────────

  return (
    <>
      <NavFormulaire />
      <div className="min-h-screen bg-black py-12 px-4 pt-32">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">

            {/* Bannière agence */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">
                    Agence : {agenceData?.nomAgence || "—"}
                    {agenceData?.ville ? ` — ${agenceData.ville}` : ""}
                  </h3>
                  <p className="text-sm text-orange-700">
                    Complétez votre profil pour accéder à votre espace agent.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
              <User className="w-7 h-7 text-orange-600" />
              Création de votre profil agent
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Code partenaire (lecture seule) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code partenaire
                </label>
                <input
                  type="text"
                  value={agenceData?.codePartenaire || codeFromUrl}
                  readOnly
                  className="w-full px-6 py-3 border border-gray-300 rounded-full bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Email readonly */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-6 py-3 border border-gray-300 rounded-full bg-gray-100 cursor-not-allowed text-gray-700"
                />
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email récupéré automatiquement depuis l&apos;agence
                </p>
              </div>

              {/* 🔴 FIX: Nom / Prénom ajoutés */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>
              </div>

              {/* 🔴 FIX: Téléphone ajouté */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>

              {/* 🔴 FIX: Ville ajoutée */}
              <div>
                <CityAutocomplete
                  value={inputValue}
                  onValueChange={setInputValue}
                  selectedCity={selectedCity}
                  onSelectCity={handleCitySelect}
                  theme="light"
                  placeholder="Entrez votre ville (min. 2 caractères)"
                />
              </div>

              {/* Photo (optionnelle) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photo de profil
                  <span className="text-gray-400 text-xs ml-2">(optionnelle)</span>
                </label>
                <div className="flex items-center gap-6">
                  <div className="shrink-0">
                    {photo ? (
                      <Image
                        src={photo}
                        alt="Photo de profil"
                        width={160}
                        height={160}
                        className="h-40 w-40 object-cover rounded-full border-4 border-gray-200"
                      />
                    ) : (
                      <div className="h-40 w-40 bg-gray-200 border-4 border-dashed border-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-5xl">+</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="inline-block px-5 py-3 bg-orange-600 text-white font-semibold text-sm rounded-full cursor-pointer hover:bg-black transition-colors">
                      Choisir une photo
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      {selectedFile ? truncateFileName(selectedFile.name) : "Aucun fichier sélectionné"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Max 5MB - JPG/PNG/WEBP</p>
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Minimum 8 caractères"
                      className="w-full px-6 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Confirmez votre mot de passe"
                      className={`w-full px-6 py-3 pr-12 border rounded-full focus:outline-none focus:ring-2 text-black ${
                        confirmPassword && password !== confirmPassword
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-orange-500"
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              </div>

              {/* CGV */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cgv"
                  checked={cgvAccepted}
                  onChange={(e) => setCgvAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 text-orange-600 rounded border-gray-300"
                />
                <label htmlFor="cgv" className="text-sm text-gray-700">
                  J&apos;accepte les{" "}
                  <a href="/cgv" target="_blank" className="text-blue-600 underline">
                    conditions générales d&apos;utilisation
                  </a>{" "}
                  <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Boutons */}
              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-3 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`px-10 py-3 rounded-full font-medium text-white transition ${
                    isFormValid && !loading
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Création en cours..." : "Créer mon profil"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}
