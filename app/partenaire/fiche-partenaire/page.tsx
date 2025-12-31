'use client';
"use client";
import { useState } from 'react';
import { UserPlus, CheckCircle2, Building2, Calendar, Phone, Video, CalendarClock } from 'lucide-react';

type FormData = {
  nom: string;
  entite: string;
  statut: string;
  telephone: string;
  email: string;
  nombreDeplacements: string;
  nombreAgences: string;
  typeRdv: string;
  dateRdv: string;
};

export default function FichePartenaireContact() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    entite: '',
    statut: '',
    telephone: '',
    email: '',
    nombreDeplacements: '',
    nombreAgences: '',
    typeRdv: '',
    dateRdv: ''
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si on sélectionne un type de RDV, afficher le calendrier
    if (name === 'typeRdv' && value) {
      setShowCalendar(true);
    }
  };

  const validateForm = (): string[] => {
    const missing: string[] = [];

    const fields = [
      { value: formData.nom, label: 'Nom' },
      { value: formData.entite, label: 'Entité' },
      { value: formData.statut, label: 'Statut dans l\'entreprise' },
      { value: formData.telephone, label: 'Téléphone' },
      { value: formData.email, label: 'Email' },
      { value: formData.nombreDeplacements, label: 'Nombre de déplacements par mois' },
      { value: formData.nombreAgences, label: 'Nombre d\'agences' },
      { value: formData.typeRdv, label: 'Type de rendez-vous' },
      { value: formData.dateRdv, label: 'Date du rendez-vous' },
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

    return missing;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = validateForm();
    setMissingFields(missing);
    setShowModal(true);

    if (missing.length === 0) {
      console.log('Fiche partenaire premier contact soumise', formData);
      // Ici appel API
      setIsSubmitted(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: '',
      entite: '',
      statut: '',
      telephone: '',
      email: '',
      nombreDeplacements: '',
      nombreAgences: '',
      typeRdv: '',
      dateRdv: ''
    });
    setShowCalendar(false);
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
                Demande de contact envoyée avec succès
              </h2>
            </div>

            <div className="p-8">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Votre demande de premier contact a été envoyée !
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Nous avons bien reçu votre demande de contact. Notre équipe commerciale vous contactera 
                  pour votre {formData.typeRdv === 'telephonique' ? 'rendez-vous téléphonique' : 'rendez-vous physique'} 
                  prévu le <strong>{new Date(formData.dateRdv).toLocaleDateString('fr-FR')}</strong>.
                </p>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                  <ul className="text-left text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">1.</span>
                      <span>Confirmation de votre rendez-vous par email à {formData.email}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">2.</span>
                      <span>Étude personnalisée de vos besoins en transport</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">3.</span>
                      <span>Proposition d'une solution adaptée à votre entreprise</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-gray-900 mb-3">Récapitulatif de votre demande :</h4>
                  <div className="text-left text-sm text-gray-600 space-y-2">
                    <p><strong>Nom :</strong> {formData.nom}</p>
                    <p><strong>Entité :</strong> {formData.entite}</p>
                    <p><strong>Statut :</strong> {formData.statut}</p>
                    <p><strong>Email :</strong> {formData.email}</p>
                    <p><strong>Téléphone :</strong> {formData.telephone}</p>
                    <p><strong>Déplacements/mois :</strong> {formData.nombreDeplacements}</p>
                    <p><strong>Nombre d'agences :</strong> {formData.nombreAgences}</p>
                    <p><strong>Type de RDV :</strong> {formData.typeRdv === 'telephonique' ? 'Téléphonique' : 'Physique'}</p>
                    <p><strong>Date :</strong> {new Date(formData.dateRdv).toLocaleDateString('fr-FR')}</p>
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

  // Formulaire de premier contact
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <UserPlus className="w-8 h-8" />
              Fiche Partenaire - Premier Contact
            </h2>
            <p className="mt-2 text-orange-100">Demande d'étude de vos besoins en transport</p>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Section 1: Informations de Premier Contact */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-5 flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  1. Informations de Premier Contact
                </h3>

                <div className="space-y-4">
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
                      Entité <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="entite"
                      value={formData.entite}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut dans l'entreprise <span className="text-orange-500">*</span>
                    </label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black bg-white"
                    >
                      <option value="">Sélectionnez votre statut</option>
                      <option value="Directeur Général">Directeur Général</option>
                      <option value="Directeur">Directeur</option>
                      <option value="Manager">Manager</option>
                      <option value="Responsable Transport">Responsable Transport</option>
                      <option value="Responsable Logistique">Responsable Logistique</option>
                      <option value="Chef d'entreprise">Chef d'entreprise</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone <span className="text-orange-500">*</span>
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
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Renseignements */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-5">
                  2. Renseignements
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de déplacements par mois <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="nombreDeplacements"
                      value={formData.nombreDeplacements}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'agences <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="nombreAgences"
                      value={formData.nombreAgences}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Rendez-vous */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-orange-900 mb-5 flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  3. Rendez-vous souhaité pour étude de vos besoins
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Type de rendez-vous <span className="text-orange-500">*</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-full cursor-pointer transition-all ${
                        formData.typeRdv === 'telephonique' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="typeRdv"
                          value="telephonique"
                          checked={formData.typeRdv === 'telephonique'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-orange-600"
                        />
                        <Phone className="w-6 h-6 text-orange-600" />
                        <span className="font-medium text-gray-900">RDV téléphonique</span>
                      </label>

                      <label className={`flex items-center gap-3 p-4 border-2 rounded-full cursor-pointer transition-all ${
                        formData.typeRdv === 'physique' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-300 hover:border-orange-300'
                      }`}>
                        <input
                          type="radio"
                          name="typeRdv"
                          value="physique"
                          checked={formData.typeRdv === 'physique'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-orange-600"
                        />
                        <CalendarClock className="w-6 h-6 text-orange-600" />
                        <span className="font-medium text-gray-900">RDV physique</span>
                      </label>
                    </div>
                  </div>

                  {showCalendar && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date du rendez-vous <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateRdv"
                        value={formData.dateRdv}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black"
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        Notre équipe vous contactera pour confirmer ce créneau
                      </p>
                    </div>
                  )}
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
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold py-3.5 px-6 rounded-full hover:from-orange-700 hover:to-orange-900 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Notre équipe commerciale vous contactera dans les plus brefs délais
        </p>
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
                  Votre demande a été soumise avec succès!
                </p>
                <p className="text-green-700 text-sm">
                  Nous vous contacterons très prochainement.
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