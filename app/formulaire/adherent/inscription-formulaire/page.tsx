"use client";

import { useMemo, useState } from "react";
import { Upload, Camera, FileText, IdCard, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/app/components/customSelect";
import NavFormulaire from "@/app/components/navFormulaire";
import Stepper from "@/app/components/Stepper";
import { CityAutocomplete, SelectedCity } from "@/components/mission-components/CityAutocomplete";

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
  dateDelivrance: string;
  typePermis: string;

  // champs que tu avais dans ton state, mais non utilisés par le back actuel
  immatriculation: string;
  rcPro: string;
  rcCirculation: string;
};

type FilesState = {
  // back exige 2 fichiers
  carteIdentite: File[];
  permisRectoVerso: File[];

  // back exige 1 fichier
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

  const [formData, setFormData] = useState<FormDataType>({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    confirmEmail: "",
    ville: "",
    adresse: "",
    telephone: "",
    raisonSociale: "",
    numeroKbis: "",
    numeroPermis: "",
    dateDelivrance: "",
    typePermis: "",
    immatriculation: "",
    rcPro: "",
    rcCirculation: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const [files, setFiles] = useState<FilesState>({
    carteIdentite: [],
    permisRectoVerso: [],
    kbis: null,
    rib: null,
    assuranceRcPro: null,
    assuranceRcCirculation: null,
    casierJudiciaire: null,
    carteGrisWgarage: null,
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
    if (maxCount === 1) {
      setFiles((prev) => ({ ...prev, [key]: selected[0] ?? null } as FilesState));
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: selected.slice(0, maxCount) } as FilesState));
  };

  // Configuration des champs du formulaire
  const formFields = [
    { name: "nom", label: "Nom", type: "text", placeholder: "DUPONT" },
    { name: "prenom", label: "Prénom", type: "text", placeholder: "Jean" },
    { name: "dateNaissance", label: "Date de naissance", type: "date", placeholder: "JJ/MM/AAAA" },
    { name: "telephone", label: "Téléphone", type: "tel", placeholder: "06 12 34 56 78" },
    { name: "adresse", label: "Adresse complète", type: "text", placeholder: "12 rue des Lilas, 75001 Paris" },
  ];

  const emailFields = [
    { name: "email", label: "Email", placeholder: "exemple@domaine.com" },
    { name: "confirmEmail", label: "Confirmer e-mail", placeholder: "Confirmez votre e-mail" },
  ];

  const entrepriseFields = [
    { name: "raisonSociale", label: "Raison sociale", placeholder: "SARL TRANSPORT EXPRESS" },
    { name: "numeroKbis", label: "Numéro Kbis", placeholder: "123 456 789 00012" },
  ];

  const permisFields = [
    { name: "numeroPermis", label: "Numéro de permis", type: "text", placeholder: "Ex: AB-123-CD" },
    { name: "dateDelivrance", label: "Date de délivrance", type: "date", placeholder: "" },
  ];

  // IMPORTANT: ton back exige aussi carteIdentite + permisRectoVerso en double.
  // Ici on garde ton design "Documents obligatoires" et on ajoute carteIdentite.
  const documentsConfig = [
    { key: "carteIdentite", label: "Carte d'identité valide (recto + verso)", type: "upload", max: 2 },
    { key: "kbis", label: "Kbis (moins de 3 mois)", type: "upload", max: 1 },
    { key: "rib", label: "RIB (IBAN)", type: "upload", max: 1 },
    { key: "carteGrisWgarage", label: "Carte grise W-garage", type: "upload", max: 1 },
    { key: "assuranceRcPro", label: "Assurance RC PRO", type: "upload", max: 1 },
    { key: "casierJudiciaire", label: "Extrait casier judiciaire (moins de 3 mois)", type: "upload", max: 1 },
    { key: "assuranceRcCirculation", label: "Assurance RC circulation (photo avec MT visible)", type: "camera", max: 1 },
  ] as const;

  const validationFields = [
    ...formFields.map((f) => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    ...emailFields.map((f) => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    { value: formData.ville, label: "Ville" },
    ...entrepriseFields.map((f) => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    ...permisFields.map((f) => ({ value: formData[f.name as keyof FormDataType], label: f.label })),
    { value: formData.typePermis, label: "Type de permis" },
  ];

  const fileValidation = useMemo(() => {
    const arr: { ok: boolean; label: string }[] = [];

    arr.push({ ok: files.carteIdentite.length === 2, label: "Carte d'identité (2 fichiers)" });
    arr.push({ ok: files.permisRectoVerso.length === 2, label: "Permis recto/verso (2 fichiers)" });

    const singles: Array<[keyof FilesState, string]> = [
      ["kbis", "Kbis"],
      ["rib", "RIB (IBAN)"],
      ["assuranceRcPro", "Assurance RC PRO"],
      ["assuranceRcCirculation", "Assurance RC circulation"],
      ["casierJudiciaire", "Casier judiciaire"],
      ["carteGrisWgarage", "Carte grise W-garage"],
    ];

    for (const [k, label] of singles) {
      arr.push({ ok: Boolean(files[k]), label });
    }
    return arr;
  }, [files]);

  async function submitDemande() {
    const fd = new FormData();

    // champs texte
    (Object.keys(formData) as (keyof FormDataType)[]).forEach((k) => {
      fd.append(k, String(formData[k] ?? ""));
    });

    // IMPORTANT: pour plusieurs fichiers -> append plusieurs fois la même clé [web:42]
    files.carteIdentite.forEach((f) => fd.append("carteIdentite", f));
    files.permisRectoVerso.forEach((f) => fd.append("permisRectoVerso", f));

    if (files.kbis) fd.append("kbis", files.kbis);
    if (files.rib) fd.append("rib", files.rib);
    if (files.assuranceRcPro) fd.append("assuranceRcPro", files.assuranceRcPro);
    if (files.assuranceRcCirculation) fd.append("assuranceRcCirculation", files.assuranceRcCirculation);
    if (files.casierJudiciaire) fd.append("casierJudiciaire", files.casierJudiciaire);
    if (files.carteGrisWgarage) fd.append("carteGrisWgarage", files.carteGrisWgarage);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/demandes`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message ?? `Erreur API (${res.status})`);
    }

    return res.json();
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];

    validationFields.forEach((field) => {
      if (!field.value) missing.push(field.label);
    });

    // validations fichiers (mêmes limites que le back)
    fileValidation.forEach((f) => {
      if (!f.ok) missing.push(f.label);
    });

    setMissingFields(missing);
    setShowModal(true);

    if (missing.length !== 0) return;

    setIsSending(true);
    try {
      await submitDemande();
      setIsSubmitted(true);
      setCurrentStep(2);
    } catch (err) {
      setMissingFields([err instanceof Error ? err.message : "Erreur inconnue"]);
      setShowModal(true);
    } finally {
      setIsSending(false);
    }
  };

  const summaryItems = [
    { label: "Nom", value: `${formData.nom} ${formData.prenom}` },
    { label: "Email", value: formData.email },
    { label: "Téléphone", value: formData.telephone },
    { label: "Ville", value: formData.ville },
    { label: "Raison sociale", value: formData.raisonSociale },
    { label: "Date de soumission", value: new Date().toLocaleDateString("fr-FR") },
  ];

  const nextSteps = [
    "Vérification de votre dossier par notre équipe (24-48h)",
    "Vous recevrez un email de confirmation si votre demande est acceptée",
    "Signature de contrat",
    "Création de votre compte et accès à la plateforme",
  ];

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
              <div className="p-8">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Votre demande d&apos;adhésion a été envoyée !
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Nous avons bien reçu votre demande d&apos;inscription. Notre équipe va examiner votre dossier
                    et vous recevrez une réponse par email à l&apos;adresse <strong>{formData.email}</strong> dans les plus brefs délais.
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
                    <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif de votre demande :</h4>
                    <div className="text-left text-sm text-gray-600 space-y-2">
                      {summaryItems.map((item, idx) => (
                        <p key={idx}>
                          <strong>{item.label} :</strong> {item.value}
                        </p>
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
        </div>
      </>
    );
  }

  return (
    <>
      <NavFormulaire />
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Stepper currentStep={currentStep} />
          {/* NOTE: je garde ton onSubmit sur le container comme tu l’as, mais idéalement il faut un <form>. */}
          <div onSubmit={onSubmit as any} className="bg-white rounded-2xl shadow-xl overflow-hidden pt-15">
            <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <IdCard className="w-8 h-8" />
                Informations personnelles & entreprise
              </h2>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      required
                      value={formData[field.name as keyof FormDataType]}
                      onChange={handleInputChange}
                      className={`${
                        field.type === "date" ? "w-[95%] sm:w-full px-4 sm:px-2" : "w-full px-6"
                      } py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black`}
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}

                <div>
                  <CityAutocomplete
                    value={inputValue}
                    onValueChange={setInputValue}
                    selectedCity={selectedCity}
                    onSelectCity={handleCitySelect}
                    theme="light"
                    placeholder="Entrez votre ville (min. 2 caractères)"
                    label="Ville"
                  />
                </div>

                {emailFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name={field.name}
                      required
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
                      type="text"
                      name={field.name}
                      required
                      value={formData[field.name as keyof FormDataType]}
                      onChange={handleInputChange}
                      className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-semibold text-orange-800 mb-5 flex items-center gap-3">
                  <FileText className="w-7 h-7" />
                  Permis de conduire
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  {permisFields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        required
                        value={formData[field.name as keyof FormDataType]}
                        onChange={handleInputChange}
                        className={`${
                          field.type === "date" ? "w-[93%] sm:w-full px-4 sm:px-2" : "w-full px-6"
                        } py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-600 text-black`}
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
                        { value: "B", label: "B (Voiture)" },
                        { value: "BE", label: "BE (Voiture + remorque)" },
                        { value: "C", label: "C (Poids lourd)" },
                        { value: "CE", label: "CE (Poids lourd + remorque)" },
                        { value: "D", label: "D (Bus / Transport de personnes)" },
                        { value: "DE", label: "DE (Bus + remorque)" },
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permis de conduire recto/verso <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-orange-50 hover:bg-orange-100 transition">
                      <Camera className="w-12 h-12 text-orange-600" />
                      <span className="mt-2 text-sm text-orange-700">Prendre une photo ou importer</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "permisRectoVerso", 2)}
                      />
                    </label>
                  </div>

                  {files.permisRectoVerso.length > 0 && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ {files.permisRectoVerso.map((f) => f.name).join(" , ")} ({files.permisRectoVerso.length}/2)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-orange-900 flex items-center gap-3">
                  <Upload className="w-7 h-7" />
                  Documents obligatoires
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {documentsConfig.map((doc) => {
                    const val = files[doc.key as keyof FilesState];
                    const isMulti = doc.max === 2;
                    const hasValue = isMulti ? (val as File[]).length > 0 : Boolean(val);

                    return (
                      <div key={doc.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {doc.label} <span className="text-orange-500">*</span>
                        </label>

                        <label
                          className={`flex ${doc.type === "camera" ? "flex-col" : ""} items-center justify-center w-full h-32 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-orange-50 hover:bg-orange-100 transition`}
                        >
                          <div className="text-center">
                            {doc.type === "camera" ? (
                              <Camera className="mx-auto w-10 h-10 text-orange-600" />
                            ) : (
                              <Upload className="mx-auto w-10 h-10 text-orange-600" />
                            )}
                            <span className="mt-2 block text-sm text-orange-700">
                              {doc.type === "camera" ? "Prendre photo du véhicule assuré" : "Cliquer pour uploader"}
                            </span>
                          </div>

                          <input
                            type="file"
                            className="hidden"
                            multiple={doc.max === 2}
                            accept={doc.type === "camera" ? "image/*" : ".pdf,.jpg,.jpeg,.png"}
                            capture={doc.type === "camera" ? "environment" : undefined}
                            required
                            onChange={(e) => handleFileChange(e, doc.key as keyof FilesState, doc.max)}
                          />
                        </label>

                        {hasValue && (
                          <p className="mt-2 text-sm text-green-600">
                            ✓{" "}
                            {isMulti
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

              <div className="flex justify-center gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:bg-black hover:from-black hover:to-black transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSending}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:bg-green-600 hover:from-green-600 hover:to-green-600 transition-colors disabled:opacity-60"
                >
                  {isSending ? "Envoi..." : "Envoyer la demande"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? "✓ Formulaire validé" : "⚠ Champs manquants"}
            </h3>

            {missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold mb-2">
                  Votre inscription a été soumise avec succès!
                </p>
                <p className="text-green-700 text-sm">
                  Nous avons envoyé la réponse de votre demande par e-mail.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">Veuillez remplir les champs suivants:</p>
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
    </>
  );
}
