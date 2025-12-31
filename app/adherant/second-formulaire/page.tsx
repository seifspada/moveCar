"use client";
import { useState } from 'react';
import Image from 'next/image';
import { CheckCircle, User, Mail, Lock, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NavFormulaire from '@/app/components/navFormulaire';
import Stepper from '@/app/components/Stepper';

export default function InscriptionForm() {
  const router = useRouter();
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  
  const [photo, setPhoto] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pack, setPack] = useState<'basique' | 'premium'>('basique');
  const [cgvAccepted, setCgvAccepted] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const truncateFileName = (name: string) => {
    if (name.length > 10) {
      return name.substring(0, 10) + "...";
    }
    return name;
  };

  const isFormValid =
    photo &&
    email === confirmEmail &&
    email.includes('@') &&
    password.length >= 8 &&
    password === confirmPassword &&
    cgvAccepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log('Compte créé avec succès', { email, pack, photo });
      // Ici appel API pour créer le compte
      setIsAccountCreated(true);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  // Si le compte est créé, afficher la page de confirmation (Toutes les étapes complétées)
  if (isAccountCreated) {
    return (
      <>
        <NavFormulaire />
        <div className="min-h-screen bg-black py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Stepper currentStep={4} />
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-8">
              <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
                <h2 className="text-2xl font-semibold flex items-center gap-3">
                  <CheckCircle className="w-8 h-8" />
                  Compte créé avec succès - Processus terminé
                </h2>
              </div>

              <div className="p-8">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    🎉 Bienvenue dans la communauté !
                  </h3>
                  
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
                    Félicitations ! Toutes les étapes sont complétées. Votre compte a été créé avec succès 
                    et vous pouvez maintenant accéder à toutes les fonctionnalités de la plateforme.
                  </p>

                  {photo && (
                    <div className="mb-8">
                      <Image
                        src={photo}
                        alt="Photo de profil"
                        width={120}
                        height={120}
                        className="h-30 w-30 object-cover rounded-full border-4 border-green-500 mx-auto"
                      />
                    </div>
                  )}

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                    <h4 className="font-semibold text-green-900 mb-3 text-lg flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Processus d'inscription terminé
                    </h4>
                    <div className="text-sm text-green-800 space-y-2">
                      <p>✓ Demande envoyée et validée</p>
                      <p>✓ Demande acceptée par l'équipe</p>
                      <p>✓ Compte créé et activé</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <h4 className="font-semibold text-orange-900 mb-4 text-lg">Informations de votre compte :</h4>
                    <div className="text-left space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700"><strong>Email :</strong> {email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-orange-600" />
                        <span className="text-gray-700">
                          <strong>Formule :</strong> Pack {pack === 'basique' ? 'Basique (47,50 €/mois)' : 'Premium (57,50 €/mois)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-700"><strong>Statut :</strong> Compte actif et opérationnel</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                    <h4 className="font-semibold text-blue-900 mb-3">Prochaines étapes :</h4>
                    <ul className="text-left text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">1.</span>
<span>Veuillez vous connecter via la page de connexion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">2.</span>
                        <span>Configurez vos préférences de notification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">3.</span>
                        <span>Découvrez les missions disponibles sur la plateforme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">4.</span>
                        <span>Téléchargez l'application mobile pour rester connecté</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => router.push('/')}
                      className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors shadow-lg"
                    >
                      Revenir à l’accueil
                    </button>
                    <button
                      onClick={() => router.push('/signin')}
                      className="px-10 py-4 bg-white text-orange-600 border-2 border-orange-600 rounded-full font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Se connecter
                    </button>
                  </div>

                  <p className="mt-8 text-sm text-gray-500">
                    Un email de confirmation a été envoyé à <strong>{email}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Affichage du formulaire de création de compte (Étapes 1 et 2 déjà complétées)
  return (
    <>
      <NavFormulaire />
      <div className="min-h-screen bg-black py-12 px-4 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Stepper currentStep={3} />
          
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Votre demande a été acceptée !</h3>
                    <p className="text-sm text-green-700">
                      Étapes 1 et 2 complétées. Créez maintenant votre compte pour accéder à la plateforme.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <User className="w-7 h-7 text-orange-600" />
                Création de votre compte
              </h2>
              <p className="text-gray-600 mt-2">
                Complétez les informations ci-dessous pour finaliser la création de votre compte et commencer à utiliser nos services.
              </p>
            </div>

            <div className="space-y-8">
              {/* 1. Photo d'identité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photo d'identité (faciale) <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <div className="shrink-0">
                    {photo ? (
                      <Image
                        src={photo}
                        alt="Photo d'identité"
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
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-[11px] sm:text-xs text-gray-500 truncate">
                      {selectedFile ? truncateFileName(selectedFile.name) : "Aucun fichier sélectionné"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse e-mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmer l'adresse e-mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className={`w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black ${
                      confirmEmail && email !== confirmEmail
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    placeholder="Confirmez votre e-mail"
                  />
                  {confirmEmail && email !== confirmEmail && (
                    <p className="mt-1 text-xs text-red-600">Les adresses e-mail ne correspondent pas</p>
                  )}
                </div>
              </div>

              {/* 3. Mot de passe */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black"
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmer le mot de passe <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-600 text-black ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              </div>

              {/* 4. Choix du pack */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Choix de l'adhésion <span className="text-red-600">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pack Basique */}
                  <label
                    className={`relative block cursor-pointer rounded-full border-2 p-6 transition-all ${
                      pack === 'basique'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pack"
                      value="basique"
                      checked={pack === 'basique'}
                      onChange={() => setPack('basique')}
                      className="absolute opacity-0"
                    />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Pack Basique</h3>
                      <span className="text-2xl font-bold text-orange-600">47,50 €</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Diffusion des missions</li>
                      <li>✓ Relance de paiement</li>
                      <li>✓ Annulation gratuite avant 16h</li>
                    </ul>
                  </label>

                  {/* Pack Premium */}
                  <label
                    className={`relative block cursor-pointer rounded-full border-2 p-6 transition-all ${
                      pack === 'premium'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pack"
                      value="premium"
                      checked={pack === 'premium'}
                      onChange={() => setPack('premium')}
                      className="absolute opacity-0"
                    />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">Pack Premium</h3>
                      <span className="text-2xl font-bold text-orange-600">57,50 €</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>✓ Diffusion prioritaire (2h en avance)</li>
                      <li>✓ 2 lettres de relance au donneur d'ordre</li>
                      <li>✓ Annulation gratuite avant 12h</li>
                    </ul>
                    <span className="absolute top-1 right-2 bg-green-600 text-black border border-gray-300 text-xs px-1 py-0.5 rounded">
                      Recommandé
                    </span>
                  </label>
                </div>
              </div>

              {/* 5. CGV */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="cgv"
                  checked={cgvAccepted}
                  onChange={(e) => setCgvAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="cgv" className="text-sm text-gray-700">
                  J'accepte les{' '}
                  <a href="/cgv" target="_blank" className="text-blue-600 underline">
                    conditions générales d'adhésion
                  </a>{' '}
                  ainsi que le traitement de mes données personnelles et l'utilisation de la géolocalisation.{' '}
                  <span className="text-red-600">*</span>
                </label>
              </div>

              {/* 6. Boutons */}
              <div className="flex justify-center gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-red-600 text-red-600 rounded-full hover:bg-red-50 transition"
                >
                  Annuler
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`px-6 sm:px-10 py-2 sm:py-3 rounded-full font-medium text-white transition ${
                    isFormValid
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Créer mon compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}