"use client";

import { useMemo, useState } from "react";
import { Upload, FileText, IdCard, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/app/components/customSelect";
import NavFormulaire from "@/app/components/navFormulaire";
import Stepper from "@/app/components/Stepper";
import { CityAutocomplete, SelectedCity } from "@/components/mission-components/CityAutocomplete";
import { AdherentAPI } from "@/lib/api/adherent-api";
type FormDataType = {
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  confirmEmail: string;
  ville: string;
  adresse: string;
  telephone: string;
  raisonSociale: string;
  numeroKbis: string;
  numeroPermis: string;
  dateDebutValiditePermis: string;
  typePermis: string;
  immatriculation: string;
  rcPro: string;
  rcCirculation: string;
};

type FilesState = {
  carteIdentite: File[];
  permisRectoVerso: File[];
  kbis: File | null;
  rib: File | null;
  assuranceRcPro: File | null;
  assuranceRcCirculation: File | null;
  casierJudiciaire: File | null;
  carteGrisWgarage: File | null;
};

export default function AdherentFormulaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  

  const [formData, setFormData] = useState<FormDataType>({
    nom: "", prenom: "", dateNaissance: "", email: "", confirmEmail: "",
    ville: "", adresse: "", telephone: "", raisonSociale: "", numeroKbis: "",
    numeroPermis: "", dateDebutValiditePermis: "", typePermis: "", immatriculation: "",
    rcPro: "", rcCirculation: "",
  });

  const [files, setFiles] = useState<FilesState>({
    carteIdentite: [], permisRectoVerso: [],
    kbis: null, rib: null,
    assuranceRcPro: null, assuranceRcCirculation: null,
    casierJudiciaire: null, carteGrisWgarage: null,
  });

  const router = useRouter();
  const handleCancel = () => router.push("/");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCitySelect = (city: SelectedCity | null) => {
    setSelectedCity(city);
    setFormData({ ...formData, ville: city?.name || "" });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof FilesState,
    maxCount = 1,
  ) => {
    const selected = Array.from(e.target.files ?? []);
    const file = selected[0] ?? null;
    if (maxCount === 1) {
      setFiles((prev) => ({ ...prev, [key]: file } as FilesState));
    } else {
      setFiles((prev) => ({ ...prev, [key]: selected.slice(0, maxCount) } as FilesState));
    }
  };

  const formFields = [
    { name: "nom",           label: "Nom",              type: "text", placeholder: "DUPONT" },
    { name: "prenom",        label: "Prénom",            type: "text", placeholder: "Jean" },
    { name: "dateNaissance", label: "Date de naissance", type: "date", placeholder: "JJ/MM/AAAA" },
    { name: "telephone",     label: "Téléphone",         type: "tel",  placeholder: "+3361234567 ou 0612345678" },
    { name: "adresse",       label: "Adresse complète",  type: "text", placeholder: "12 rue des Lilas, 75001 Paris" },
  ];

  const emailFields = [
    { name: "email",        label: "Email",           placeholder: "exemple@domaine.com" },
    { name: "confirmEmail", label: "Confirmer e-mail", placeholder: "Confirmez votre e-mail" },
  ];

  const entrepriseFields = [
    { name: "raisonSociale", label: "Raison sociale", placeholder: "SARL TRANSPORT EXPRESS" },
    { name: "numeroKbis",    label: "Numéro Kbis",    placeholder: "123 456 789 00012" },
  ];

  const permisFields = [
    { name: "numeroPermis",            label: "Numéro de permis",          type: "text", placeholder: "Ex: AB-123-CD" },
    { name: "dateDebutValiditePermis", label: "Date de début de validité", type: "date", placeholder: "" },
  ];

  const documentsConfig = [
    { key: "carteIdentite",          label: "Carte d'identité valide (recto + verso)",   max: 2 },
    { key: "kbis",                   label: "Kbis (moins de 3 mois)",                     max: 1 },
    { key: "rib",                    label: "RIB (IBAN)",                                  max: 1 },
    { key: "carteGrisWgarage",       label: "Carte grise W-garage",                        max: 1 },
    { key: "assuranceRcPro",         label: "Assurance RC PRO",                            max: 1 },
    { key: "assuranceRcCirculation", label: "Assurance RC Circulation",                    max: 1 },
    { key: "casierJudiciaire",       label: "Extrait casier judiciaire (moins de 3 mois)", max: 1 },
  ] as const;

  const validationFields = [
    ...formFields.map((f)       => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    ...emailFields.map((f)      => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    { value: formData.ville, label: "Ville" },
    ...entrepriseFields.map((f) => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    ...permisFields.map((f)     => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    { value: formData.typePermis, label: "Type de permis" },
  ];

  const fileValidation = useMemo(() => {
    const arr: { ok: boolean; label: string }[] = [];
    arr.push({ ok: files.carteIdentite.length === 2,    label: "Carte d'identité (2 fichiers)" });
    arr.push({ ok: files.permisRectoVerso.length === 2, label: "Permis recto/verso (2 fichiers)" });
    const singles: Array<[keyof FilesState, string]> = [
      ["kbis",                   "Kbis"],
      ["rib",                    "RIB (IBAN)"],
      ["assuranceRcPro",         "Assurance RC PRO"],
      ["assuranceRcCirculation", "Assurance RC Circulation"],
      ["casierJudiciaire",       "Casier judiciaire"],
      ["carteGrisWgarage",       "Carte grise W-garage"],
    ];
    for (const [k, label] of singles) {
      arr.push({ ok: Boolean(files[k]), label });
    }
    return arr;
  }, [files]);

  async function submitDemande() {
    const fd = new FormData();
    (Object.keys(formData) as (keyof FormDataType)[]).forEach((k) => {
      fd.append(k, String(formData[k] ?? ""));
    });
    files.carteIdentite.forEach((f)    => fd.append("carteIdentite", f));
    files.permisRectoVerso.forEach((f) => fd.append("permisRectoVerso", f));
    const singleFileEntries: [keyof FilesState, string][] = [
      ["kbis",                   "kbis"],
      ["rib",                    "rib"],
      ["assuranceRcPro",         "assuranceRcPro"],
      ["assuranceRcCirculation", "assuranceRcCirculation"],
      ["casierJudiciaire",       "casierJudiciaire"],
      ["carteGrisWgarage",       "carteGrisWgarage"],
    ];
    singleFileEntries.forEach(([stateKey, fieldName]) => {
      const file = files[stateKey];
      if (file instanceof File) fd.append(fieldName, file);
    });
    return AdherentAPI.createDemande(fd);
  }


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── Validation champs ──
    const missing: string[] = [];
    validationFields.forEach((field) => { if (!field.value) missing.push(field.label); });
    fileValidation.forEach((f) => { if (!f.ok) missing.push(f.label); });

    if (missing.length !== 0) {
      // Champs manquants → modale d'erreur classique
      setMissingFields(missing);
      setShowModal(true);
      return;
    }

    // ── Envoi ──
    setIsSending(true);
    try {
      await submitDemande();

      // ✅ 1. Affiche la modale succès 2 secondes, PUIS bascule sur la page de confirmation
      setMissingFields([]);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);   // ferme la modale succès
        setIsSubmitted(true);  // affiche la page de confirmation
        setCurrentStep(2);
      }, 2000); // ← 2 secondes

    } catch (err) {
      setMissingFields([err instanceof Error ? err.message : "Erreur inconnue"]);
      setShowModal(true);
    } finally {
      setIsSending(false);
    }
  };

  const summaryItems = [
    { label: "Nom",               value: `${formData.nom} ${formData.prenom}` },
    { label: "Email",             value: formData.email },
    { label: "Téléphone",         value: formData.telephone },
    { label: "Ville",             value: formData.ville },
    { label: "Raison sociale",    value: formData.raisonSociale },
    { label: "Date de soumission", value: new Date().toLocaleDateString("fr-FR") },
  ];

  const nextSteps = [
    "Vérification de votre dossier par notre équipe (24-48h)",
    "Vous recevrez un email de confirmation si votre demande est acceptée",
    "Signature de contrat",
    "Création de votre compte et accès à la plateforme",
  ];

  // ── Page de confirmation (après fermeture modale succès) ──────
  if (isSubmitted) {
    return (
      <>
        <NavFormulaire />
        <div className="min-h-screen bg-black py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Stepper currentStep={2} />
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  Demande envoyée avec succès
                </h2>
              </div>
              <div className="p-8 text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Votre demande d&apos;adhésion a été envoyée !
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous avons bien reçu votre demande. Notre équipe va examiner votre dossier
                  et vous contactera à <strong>{formData.email}</strong>.
                </p>


                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                  <ul className="text-left text-gray-700 space-y-2">
                    {nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h4>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    {summaryItems.map((item, idx) => (
                      <p key={idx}><strong>{item.label} :</strong> {item.value}</p>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors"
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

  // ── Formulaire ────────────────────────────────────────────────
  return (
    <>
      <NavFormulaire />
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Stepper currentStep={currentStep} />
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden pt-15">
            <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <IdCard className="w-8 h-8" />
                Informations personnelles & entreprise
              </h2>
            </div>

            <div className="p-8 space-y-8">

              {/* Infos personnelles */}
              <div className="grid md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type={field.type} name={field.name} required
                      value={formData[field.name as keyof FormDataType]}
                      onChange={handleInputChange}
                      className={`${field.type === "date" ? "w-[95%] sm:w-full px-4 sm:px-2" : "w-full px-6"} py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black`}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                <div>
                  <CityAutocomplete
                    value={inputValue} onValueChange={setInputValue}
                    selectedCity={selectedCity} onSelectCity={handleCitySelect}
                    theme="light" placeholder="Entrez votre ville (min. 2 caractères)" label="Ville"
                  />
                </div>
                {emailFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email" name={field.name} required
                      value={formData[field.name as keyof FormDataType]}
                      onChange={handleInputChange}
                      className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
                {entrepriseFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text" name={field.name} required
                      value={formData[field.name as keyof FormDataType]}
                      onChange={handleInputChange}
                      className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              {/* Permis */}
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-semibold text-orange-800 mb-5 flex items-center gap-3">
                  <FileText className="w-7 h-7" /> Permis de conduire
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {permisFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type={field.type} name={field.name} required
                        value={formData[field.name as keyof FormDataType]}
                        onChange={handleInputChange}
                        className={`${field.type === "date" ? "w-[93%] sm:w-full px-4 sm:px-2" : "w-full px-6"} py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-600 text-black`}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de permis <span className="text-orange-500">*</span>
                    </label>
                    <CustomSelect
                      value={formData.typePermis}
                      onChange={(val) => setFormData({ ...formData, typePermis: String(val) })}
                      options={[
                        { value: "B",  label: "B (Voiture)" },
                        { value: "BE", label: "BE (Voiture + remorque)" },
                        { value: "C",  label: "C (Poids lourd)" },
                        { value: "CE", label: "CE (Poids lourd + remorque)" },
                        { value: "D",  label: "D (Bus / Transport de personnes)" },
                        { value: "DE", label: "DE (Bus + remorque)" },
                      ]}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permis de conduire recto/verso <span className="text-orange-500">*</span>
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-orange-50 hover:bg-orange-100 transition">
                    <Upload className="w-12 h-12 text-orange-600" />
                    <span className="mt-2 text-sm text-orange-700">Importer recto + verso (2 fichiers)</span>
                    <input
                      type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden"
                      onChange={(e) => handleFileChange(e, "permisRectoVerso", 2)}
                    />
                  </label>
                  {files.permisRectoVerso.length > 0 && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ {files.permisRectoVerso.map((f) => f.name).join(" , ")} ({files.permisRectoVerso.length}/2)
                    </p>
                  )}
                </div>
              </div>

              {/* Documents obligatoires */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-orange-900 flex items-center gap-3">
                  <Upload className="w-7 h-7" /> Documents obligatoires
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {documentsConfig.map((doc) => {
                    const val     = files[doc.key as keyof FilesState];
                    const isMulti = doc.max === 2;
                    const hasValue = isMulti ? (val as File[]).length > 0 : Boolean(val);
                    return (
                      <div key={doc.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {doc.label} <span className="text-orange-500">*</span>
                        </label>
                        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-orange-50 hover:bg-orange-100 transition">
                          <div className="text-center">
                            <Upload className="mx-auto w-10 h-10 text-orange-600" />
                            <span className="mt-2 block text-sm text-orange-700">Cliquer pour uploader</span>
                          </div>
                          <input
                            type="file" className="hidden"
                            multiple={doc.max === 2}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            onChange={(e) => handleFileChange(e, doc.key as keyof FilesState, doc.max)}
                          />
                        </label>
                        {hasValue && (
                          <p className="mt-2 text-sm text-green-600">
                            ✓ {isMulti
                              ? (val as File[]).map((f) => f.name).join(" , ")
                              : (val as File).name}
                            {isMulti ? ` (${(val as File[]).length}/2)` : ""}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-center gap-4 pt-8">
                <button type="button" onClick={handleCancel}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:from-black hover:to-black transition-colors">
                  Retour
                </button>
                <button type="button" onClick={onSubmit} disabled={isSending}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:from-green-600 hover:to-green-600 transition-colors disabled:opacity-60">
                  {isSending ? "Envoi en cours…" : "Envoyer la demande"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modale : erreurs OU succès 2s ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? "✓ Formulaire validé" : "⚠ Champs manquants"}
            </h3>

            {missingFields.length === 0 ? (
              // ✅ Succès : se ferme automatiquement après 2s (pas de bouton Fermer)
              <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold mb-2">
                  Inscription soumise avec succès !
                </p>
                <p className="text-green-700 text-sm">
                  Nous avons envoyé la réponse par e-mail.
                </p>
                <p className="text-green-500 text-xs mt-3 italic">
                  Cette fenêtre se ferme dans 2 secondes…
                </p>
              </div>
            ) : (
              // ✅ Erreur : bouton Fermer présent
              <>
                <p className="text-gray-700 mb-4">Veuillez remplir les champs suivants :</p>
                <ul className="list-disc list-inside text-red-600 mb-6 space-y-1">
                  {missingFields.map((field, idx) => <li key={idx}>{field}</li>)}
                </ul>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition font-semibold"
                >
                  Fermer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}