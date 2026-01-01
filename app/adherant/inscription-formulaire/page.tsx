"use client";
import { useState } from 'react';
import { Upload, Camera, FileText, IdCard, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/app/components/customSelect';
import NavFormulaire from '@/app/components/navFormulaire';
import Stepper from '@/app/components/Stepper';
import { CityAutocomplete, SelectedCity } from '@/components/mission-components/CityAutocomplete';

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
  immatriculation: string;
  rcPro: string;
  rcCirculation: string;
};

export default function AdherantFormulaire() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    confirmEmail: '',
    ville: '',
    adresse: '',
    telephone: '',
    raisonSociale: '',
    numeroKbis: '',
    numeroPermis: '',
    dateDelivrance: '',
    typePermis: '',
    immatriculation: '',
    rcPro: '',
    rcCirculation: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [files, setFiles] = useState({
    carteIdentite: null as File | null,
    permisRectoVerso: null as File | null,
    kbis: null as File | null,
    rib: null as File | null,
    assuranceRcPro: null as File | null,
    assuranceRcCirculation: null as File | null,
    casierJudiciaire: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestion de la sélection de ville avec synchronisation
  const handleCitySelect = (city: SelectedCity | null) => {
    setSelectedCity(city);
    setFormData({ ...formData, ville: city?.name || '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files?.[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];

    const textFields = [
      { value: formData.nom, label: 'Nom' },
      { value: formData.prenom, label: 'Prénom' },
      { value: formData.dateNaissance, label: 'Date de naissance' },
      { value: formData.email, label: 'Email' },
      { value: formData.confirmEmail, label: 'Confirmation Email' },
      { value: formData.ville, label: 'Ville' },
      { value: formData.adresse, label: 'Adresse complète' },
      { value: formData.telephone, label: 'Téléphone' },
      { value: formData.raisonSociale, label: 'Raison sociale' },
      { value: formData.numeroKbis, label: 'Numéro Kbis' },
      { value: formData.numeroPermis, label: 'Numéro de permis' },
      { value: formData.dateDelivrance, label: 'Date de délivrance du permis' },
      { value: formData.typePermis, label: 'Type de permis' },
    ];

    let i = 0;
    while (i < textFields.length) {
      const field = textFields[i];
      if (!field.value) {
        missing.push(field.label);
      }
      i++;
    }

    const fileFields = [
      { value: files.carteIdentite, label: 'Carte d\'identité' },
      { value: files.permisRectoVerso, label: 'Permis recto/verso' },
      { value: files.kbis, label: 'Kbis' },
      { value: files.rib, label: 'RIB' },
      { value: files.assuranceRcPro, label: 'Assurance RC PRO' },
      { value: files.assuranceRcCirculation, label: 'Assurance RC circulation avec photo véhicule' },
      { value: files.casierJudiciaire, label: 'Extrait casier judiciaire' },
    ];

    let j = 0;
    while (j < fileFields.length) {
      const file = fileFields[j];
      if (!file.value) {
        missing.push(file.label);
      }
      j++;
    }

    setMissingFields(missing);
    setShowModal(true);

    if (missing.length === 0) {
      console.log('Formulaire complet soumis', { formData, files });
      setIsSubmitted(true);
      setCurrentStep(2);
    }
  };

  const router = useRouter();
  const handleCancel = () => {
    router.push('/');
  };

  // Si le formulaire est soumis, afficher la page de confirmation
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
                    Votre demande d'adhésion a été envoyée !
                  </h3>

                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Nous avons bien reçu votre demande d'inscription. Notre équipe va examiner votre dossier
                    et vous recevrez une réponse par email à l'adresse <strong>{formData.email}</strong> dans les plus brefs délais.
                  </p>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                    <ul className="text-left text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">1.</span>
                        <span>Vérification de votre dossier par notre équipe (24-48h)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">2.</span>
                        <span>Vous recevrez un email de confirmation si votre demande est acceptée</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-600 font-bold">3.</span>
                        <span>Création de votre compte et accès à la plateforme</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif de votre demande :</h4>
                    <div className="text-left text-sm text-gray-600 space-y-2">
                      <p><strong>Nom :</strong> {formData.nom} {formData.prenom}</p>
                      <p><strong>Email :</strong> {formData.email}</p>
                      <p><strong>Téléphone :</strong> {formData.telephone}</p>
                      <p><strong>Ville :</strong> {formData.ville}</p>
                      <p><strong>Raison sociale :</strong> {formData.raisonSociale}</p>
                      <p><strong>Date de soumission :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push('/')}
                    className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Affichage du formulaire (étape 1)
  return (
    <>
      <NavFormulaire />
      <div className="min-h-screen bg-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Stepper currentStep={currentStep} />

          <div onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden pt-15">
            <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <IdCard className="w-8 h-8" />
                Informations personnelles & entreprise
              </h2>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="DUPONT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateNaissance"
                    required
                    value={formData.dateNaissance}
                    onChange={handleInputChange}
                    className="w-[95%] sm:w-full px-4 sm:px-2 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                    placeholder="JJ/MM/AAAA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="06 12 34 56 78"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    required
                    value={formData.adresse}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="12 rue des Lilas, 75001 Paris"
                  />
                </div>

                {/* CityAutocomplete avec synchronisation */}
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
                  <span className="text-orange-500 text-sm ml-2">*</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="exemple@domaine.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer e-mail <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="confirmEmail"
                    required
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="Confirmez votre e-mail"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raison sociale <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="raisonSociale"
                    required
                    value={formData.raisonSociale}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="SARL TRANSPORT EXPRESS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro Kbis <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="numeroKbis"
                    required
                    value={formData.numeroKbis}
                    onChange={handleInputChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="123 456 789 00012"
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-xl font-semibold text-orange-800 mb-5 flex items-center gap-3">
                  <FileText className="w-7 h-7" />
                  Permis de conduire
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de permis <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="numeroPermis"
                      required
                      value={formData.numeroPermis}
                      onChange={handleInputChange}
                      className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-600 text-black"
                      placeholder="Ex: AB-123-CD"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de délivrance <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateDelivrance"
                      required
                      value={formData.dateDelivrance}
                      onChange={handleInputChange}
                      className="w-[93%] sm:w-full px-4 sm:px-2 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:border-orange-500 text-black"
                    />
                  </div>

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
                        className="hidden"
                        onChange={(e) => handleFileChange(e, 'permisRectoVerso')}
                      />
                    </label>
                  </div>
                  {files.permisRectoVerso && (
                    <p className="mt-2 text-sm text-green-600">✓ {files.permisRectoVerso.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-orange-900 flex items-center gap-3">
                  <Upload className="w-7 h-7" />
                  Documents obligatoires
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'carteIdentite', label: 'Carte d\'identité valide' },
                    { key: 'kbis', label: 'Kbis (moins de 3 mois)' },
                    { key: 'rib', label: 'RIB (IBAN)' },
                    { key: 'assuranceRcPro', label: 'Assurance RC PRO' },
                    { key: 'casierJudiciaire', label: 'Extrait casier judiciaire (moins de 3 mois)' },
                  ].map((doc) => (
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
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={(e) => handleFileChange(e, doc.key)}
                        />
                      </label>
                      {files[doc.key as keyof typeof files] && (
                        <p className="mt-2 text-sm text-green-600">
                          ✓ {(files[doc.key as keyof typeof files] as File).name}
                        </p>
                      )}
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assurance RC circulation (photo avec MT visible) <span className="text-orange-500">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-orange-50 hover:bg-orange-100">
                      <Camera className="w-10 h-10 text-orange-600" />
                      <span className="mt-2 text-sm text-orange-700">Prendre photo du véhicule assuré</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        required
                        onChange={(e) => handleFileChange(e, 'assuranceRcCirculation')}
                      />
                    </label>
                    {files.assuranceRcCirculation && (
                      <p className="mt-2 text-sm text-green-600">✓ {files.assuranceRcCirculation.name}</p>
                    )}
                  </div>
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
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full focus:outline-none font-semibold hover:bg-green-600 hover:from-green-600 hover:to-green-600 transition-colors"
                >
                  Envoyer la demande
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
              {missingFields.length === 0 ? '✓ Formulaire validé' : '⚠ Champs manquants'}
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