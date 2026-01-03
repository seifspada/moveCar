"use client";
import { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';
import NavFormulaire from '@/app/components/navFormulaire';
import { CityAutocomplete, SelectedCity } from '@/components/mission-components/CityAutocomplete';

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

export default function FormulairePartenaire() {
  const [formData, setFormData] = useState<FormData>({
    codePartenaire: '',
    entiteGroupe: '',
    entiteAgence: '',
    nom: '',
    prenom: '',
    adresseAgence: '',
    ville: '',
    telephone: '',
    email: '',
    confirmEmail: '',
    motDePasse: '',
    confirmMotDePasse: ''
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion de la sélection de ville avec synchronisation
  const handleCitySelect = (city: SelectedCity | null) => {
    setSelectedCity(city);
    setFormData({ ...formData, ville: city?.name || '' });
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];

    const fields = [
      { value: formData.codePartenaire, label: 'Code unique partenaire' },
      { value: formData.entiteGroupe, label: 'Entité Groupe' },
      { value: formData.entiteAgence, label: 'Entité Agence' },
      { value: formData.nom, label: 'Nom' },
      { value: formData.prenom, label: 'Prénom' },
      { value: formData.adresseAgence, label: 'Adresse agence' },
      { value: formData.ville, label: 'Ville' },
      { value: formData.email, label: 'Adresse mail' },
      { value: formData.confirmEmail, label: 'Confirmation adresse mail' },
      { value: formData.motDePasse, label: 'Mot de passe' },
      { value: formData.confirmMotDePasse, label: 'Confirmation mot de passe' },
    ];

    let i = 0;
    while (i < fields.length) {
      const field = fields[i];
      if (!field.value.trim()) {
        missing.push(field.label);
      }
      i++;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      missing.push('Format email invalide');
    }

    if (formData.email !== formData.confirmEmail && formData.confirmEmail) {
      missing.push('Les emails ne correspondent pas');
    }

    // Validation mot de passe
    if (formData.motDePasse && formData.motDePasse.length < 8) {
      missing.push('Mot de passe minimum 8 caractères');
    }

    if (formData.motDePasse !== formData.confirmMotDePasse && formData.confirmMotDePasse) {
      missing.push('Les mots de passe ne correspondent pas');
    }

    return missing;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = validateForm();
    setMissingFields(missing);
    setShowModal(true);

    if (missing.length === 0) {
      console.log('Formulaire partenaire complet soumis', formData);
      // Ici appel API
      setIsSubmitted(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      codePartenaire: '',
      entiteGroupe: '',
      entiteAgence: '',
      nom: '',
      prenom: '',
      adresseAgence: '',
      ville: '',
      telephone: '',
      email: '',
      confirmEmail: '',
      motDePasse: '',
      confirmMotDePasse: ''
    });
    setInputValue('');
    setSelectedCity(null);
  };

  // Page de confirmation après soumission
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
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Votre demande d'adhésion partenaire a été envoyée !
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous avons bien reçu votre demande d'inscription en tant que partenaire. Notre équipe va examiner votre dossier 
                  et vous recevrez une réponse par email à l'adresse <strong>{formData.email}</strong> dans les plus brefs délais.
                </p>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <span>Vérification de votre code partenaire et des informations (24-48h)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <span>Validation de votre entité par l'Entité Group</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <span>Création de votre compte partenaire et accès à la plateforme</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif de votre demande :</h4>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <p><strong>Code partenaire :</strong> {formData.codePartenaire}</p>
                    <p><strong>Entité Groupe :</strong> {formData.entiteGroupe}</p>
                    <p><strong>Entité Agence :</strong> {formData.entiteAgence}</p>
                    <p><strong>Nom :</strong> {formData.nom} {formData.prenom}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                    <p><strong>Ville :</strong> {formData.ville}</p>
                    <p><strong>Date de soumission :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/'}
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire d'inscription
  return (
    <div className="min-h-screen bg-black py-12 px-4 lg:pt-35 sm:pt-25">
      <NavFormulaire />
      <div className="max-w-3xl mx-auto pt-10 md:pt-10 sm:pt-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <UserPlus className="w-8 h-8" />
              Formulaire d'adhésion - Donneur d'ordre partenaire
            </h2>
            <div className="mt-3 px-4 py-2 bg-black rounded-lg inline-block">
              <p className="text-sm">Code unique partagé par Entité Group</p>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code unique partenaire <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="codePartenaire"
                  value={formData.codePartenaire}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                />
              </div>

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

              {/* CityAutocomplete avec synchronisation */}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse mail <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation adresse mail <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                />
              </div>

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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmation mot de passe <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmMotDePasse"
                    value={formData.confirmMotDePasse}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-full hover:bg-gray-300 transition-all duration-200 shadow hover:shadow-md"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="flex-1 bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Envoyer le formulaire
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          En soumettant ce formulaire, vous acceptez nos conditions d'utilisation
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? '✓ Formulaire validé' : '⚠ Champs manquants'}
            </h3>

            {missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-full text-center border border-green-200">
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
    </div>
  );
}