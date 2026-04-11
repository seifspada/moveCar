// app/formulaire/partenaire/inscription-formulaire/[profileToken]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  UserPlus,
} from "lucide-react";
import NavFormulaire from "@/app/components/navFormulaire";
import {
  CityAutocomplete,
  SelectedCity,
} from "@/components/mission-components/CityAutocomplete";

type FormData = {
  codePartenaire: string;
  entiteGroupe: string;
  entiteAgence: string;
  nom: string;
  prenom: string;
  adresseAgence: string;
  ville: string;
  telephone: string;
  email: string;
  confirmEmail: string;
  motDePasse: string;
  confirmMotDePasse: string;
};

export default function InscriptionFormulairePage() {
  const params = useParams<{ profileToken: string }>();
  const profileToken = params?.profileToken || "";
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") || "";

  const [formData, setFormData] = useState<FormData>({
    codePartenaire: "",
    entiteGroupe: "",
    entiteAgence: "",
    nom: "",
    prenom: "",
    adresseAgence: "",
    ville: "",
    telephone: "",
    email: "",
    confirmEmail: "",
    motDePasse: "",
    confirmMotDePasse: "",
  });

  // ✅ États photo
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, codePartenaire: codeFromUrl }));
    const timer = setTimeout(() => setIsReadOnly(false), 100);
    return () => clearTimeout(timer);
  }, [codeFromUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "codePartenaire") return;
    setFormData({ ...formData, [name]: value });
  };

  const handleCitySelect = (city: SelectedCity | null) => {
    setSelectedCity(city);
    setFormData({ ...formData, ville: city?.name || "" });
  };

  // ✅ Gestion photo — même pattern que adhérent
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

  const validateForm = (): string[] => {
    const missing: string[] = [];

    const fields = [
      { value: formData.codePartenaire, label: "Code unique partenaire" },
      { value: formData.entiteGroupe, label: "Entité Groupe" },
      { value: formData.entiteAgence, label: "Entité Agence" },
      { value: formData.nom, label: "Nom" },
      { value: formData.prenom, label: "Prénom" },
      { value: formData.adresseAgence, label: "Adresse agence" },
      { value: formData.ville, label: "Ville" },
      { value: formData.email, label: "Adresse mail" },
      { value: formData.confirmEmail, label: "Confirmation adresse mail" },
      { value: formData.motDePasse, label: "Mot de passe" },
      { value: formData.confirmMotDePasse, label: "Confirmation mot de passe" },
    ];

    for (const field of fields) {
      if (!field.value.trim()) missing.push(field.label);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      missing.push("Format email invalide");
    }

    if (formData.email !== formData.confirmEmail && formData.confirmEmail) {
      missing.push("Les emails ne correspondent pas");
    }

    if (formData.motDePasse && formData.motDePasse.length < 8) {
      missing.push("Mot de passe minimum 8 caractères");
    }

    if (
      formData.motDePasse !== formData.confirmMotDePasse &&
      formData.confirmMotDePasse
    ) {
      missing.push("Les mots de passe ne correspondent pas");
    }

    return missing;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = validateForm();
    setMissingFields(missing);
    setApiError(null);

    if (missing.length > 0) {
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nom", formData.nom);
      formDataToSend.append("prenom", formData.prenom);
      formDataToSend.append("entiteGroupe", formData.entiteGroupe);
      formDataToSend.append("entiteAgence", formData.entiteAgence);
      formDataToSend.append("telephone", formData.telephone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("motDePasse", formData.motDePasse);
      if (formData.adresseAgence) formDataToSend.append("adresseAgence", formData.adresseAgence);
      if (formData.ville) formDataToSend.append("ville", formData.ville);

      // ✅ Photo optionnelle
      if (selectedFile) {
        formDataToSend.append("photo", selectedFile);
      }

      const response = await fetch(
        `/api/partenaire/inscription-formulaire?profileToken=${encodeURIComponent(
          profileToken,
        )}&code=${encodeURIComponent(formData.codePartenaire)}`,
        { method: "POST", body: formDataToSend },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = Array.isArray(err?.message)
          ? err.message.join(", ")
          : (err?.message ?? "Erreur lors de la création du profil partenaire");
        throw new Error(message);
      }

      const result = await response.json();
      console.log("✅ Profil partenaire créé:", result);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      setApiError(error.message || "Erreur lors de la création du profil");
      setMissingFields([error.message || "Erreur API"]);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      codePartenaire: codeFromUrl,
      entiteGroupe: "",
      entiteAgence: "",
      nom: "",
      prenom: "",
      adresseAgence: "",
      ville: "",
      telephone: "",
      email: "",
      confirmEmail: "",
      motDePasse: "",
      confirmMotDePasse: "",
    });
    setInputValue("");
    setSelectedCity(null);
    setPhoto(null);
    setSelectedFile(null);
    setApiError(null);
  };

  // ✅ Page succès
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                Inscription envoyée avec succès
              </h2>
            </div>

            <div className="p-8">
              <div className="text-center py-12">
                {/* ✅ Photo sur page succès */}
                {photo ? (
                  <div className="mb-6">
                    <Image
                      src={photo}
                      alt="Photo de profil"
                      width={120}
                      height={120}
                      className="h-30 w-30 object-cover rounded-full border-4 border-green-500 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Votre demande d&apos;adhésion partenaire a été envoyée !
                </h3>

                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous avons bien reçu votre demande. Notre équipe va examiner
                  votre dossier et vous recevrez une réponse par email à{" "}
                  <strong>{formData.email}</strong> dans les plus brefs délais.
                </p>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <span>Vérification de votre code partenaire (24-48h)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <span>Validation de votre entité par l&apos;Entité Group</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <span>Création de votre compte partenaire et accès à la plateforme</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h4>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <p><strong>Code partenaire :</strong> {formData.codePartenaire}</p>
                    <p><strong>Entité Groupe :</strong> {formData.entiteGroupe}</p>
                    <p><strong>Entité Agence :</strong> {formData.entiteAgence}</p>
                    <p><strong>Nom :</strong> {formData.nom} {formData.prenom}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                    <p><strong>Ville :</strong> {formData.ville}</p>
                    {selectedFile && (
                      <p><strong>Photo de profil :</strong> ✅ Uploadée</p>
                    )}
                    <p>
                      <strong>Date de soumission :</strong>{" "}
                      {new Date().toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors"
                >
                  Retour à l&apos;accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 📝 Formulaire principal
  return (
    <div className="min-h-screen bg-black py-12 px-4 lg:pt-35 sm:pt-25">
      <NavFormulaire />
      <div className="max-w-3xl mx-auto pt-10 md:pt-10 sm:pt-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <UserPlus className="w-8 h-8" />
              Formulaire d&apos;adhésion - Donneur d&apos;ordre partenaire
            </h2>
            <div className="mt-3 px-4 py-2 bg-black rounded-lg inline-block">
              <p className="text-sm">Code unique partagé par Entité Group</p>
            </div>
          </div>

          <div className="p-8">
            <form autoComplete="off" onSubmit={onSubmit}>
              <div className="space-y-6">

                {/* ✅ 1. Photo — EN PREMIER */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Photo d&apos;identité (faciale){" "}
                    <span className="text-gray-400 text-xs font-normal">(optionnelle)</span>
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
                    <div className="w-full pr-2 sm:pr-0">
                      <label className="inline-block px-3 py-2 sm:px-5 sm:py-3 bg-orange-600 text-white font-semibold text-sm rounded-full cursor-pointer hover:bg-black transition-colors">
                        Choisir une photo
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="mt-1 text-[11px] sm:text-xs text-gray-500 truncate">
                        {selectedFile
                          ? truncateFileName(selectedFile.name)
                          : "Aucun fichier sélectionné"}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        Max 5MB — JPG/PNG/WEBP
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Code partenaire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code unique partenaire <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="codePartenaire"
                    value={formData.codePartenaire}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>

                {/* 3. Entité Groupe / Agence */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entité Groupe <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="entiteGroupe"
                      value={formData.entiteGroupe}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entité Agence <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="entiteAgence"
                      value={formData.entiteAgence}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                </div>

                {/* 4. Nom / Prénom */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                </div>

                {/* 5. Adresse agence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse agence <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="adresseAgence"
                    value={formData.adresseAgence}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  />
                </div>

                {/* 6. Ville */}
                <div className="flex flex-col gap-1">
                  <CityAutocomplete
                    value={inputValue}
                    onValueChange={setInputValue}
                    selectedCity={selectedCity}
                    onSelectCity={handleCitySelect}
                    theme="light"
                    placeholder="Entrez votre ville (min. 2 caractères)"
                  />
                </div>

                {/* 7. Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  />
                </div>

                {/* 8. Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse mail <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    onFocus={(e) => e.target.removeAttribute("readonly")}
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  />
                </div>

                {/* 8b. Confirmation email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmation adresse mail <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    onFocus={(e) => e.target.removeAttribute("readonly")}
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  />
                </div>

                {/* 9. Mot de passe */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="motDePasse"
                        value={formData.motDePasse}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        onFocus={(e) => e.target.removeAttribute("readonly")}
                        autoComplete="new-password"
                        placeholder="Minimum 8 caractères"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmMotDePasse"
                        value={formData.confirmMotDePasse}
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        onFocus={(e) => e.target.removeAttribute("readonly")}
                        autoComplete="new-password"
                        placeholder="Confirmez votre mot de passe"
                        className={`w-full px-4 py-3 pr-12 border rounded-full focus:outline-none focus:ring-2 transition-all text-black ${
                          formData.confirmMotDePasse &&
                          formData.motDePasse !== formData.confirmMotDePasse
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-orange-200"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmMotDePasse &&
                      formData.motDePasse !== formData.confirmMotDePasse && (
                        <p className="mt-1 text-xs text-red-600">
                          Les mots de passe ne correspondent pas
                        </p>
                      )}
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-center gap-4 pt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-6 sm:px-10 py-2 sm:py-3 rounded-full font-medium text-white transition flex items-center gap-2 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-orange-600 hover:bg-green-600"
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer le formulaire"
                    )}
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          En soumettant ce formulaire, vous acceptez nos conditions d&apos;utilisation
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? "✓ Formulaire validé" : "⚠ Champs manquants / erreur"}
            </h3>

            {missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-xl text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold mb-2">
                  Votre inscription a été soumise avec succès !
                </p>
                <p className="text-green-700 text-sm">
                  Nous avons envoyé la réponse de votre demande par e-mail.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  {missingFields[0].startsWith("Erreur") ||
                  missingFields[0].startsWith("Impossible")
                    ? "Une erreur est survenue :"
                    : "Veuillez remplir / corriger les éléments suivants :"}
                </p>
                <ul className="list-disc list-inside text-red-600 mb-6 space-y-1">
                  {missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              </>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}