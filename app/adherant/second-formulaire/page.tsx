"use client"; // ← Ajoute cette ligne en tout premier
import { SetStateAction, useState } from 'react';
import Image from 'next/image';

export default function InscriptionForm() {
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
    setSelectedFile(file); // stocke le fichier pour le nom
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string); // stocke la photo en base64
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
  // On précise que selectedFile est soit un File, soit null

  const isFormValid =
    photo &&
    email === confirmEmail &&
    email.includes('@') &&
    password.length >= 8 &&
    password === confirmPassword &&
    cgvAccepted;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Créer votre compte adhérent</h1>
            <p className="mt-2 text-gray-600">Tous les champs marqués d’une * sont obligatoires</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form className="space-y-8">
              {/* 1. Photo d'identité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photo d’identité (faciale) <span className="text-red-600">*</span>
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
      <label className="
        inline-block 
        px-3 py-2 sm:px-5 sm:py-3
        bg-orange-600 text-white font-semibold text-sm
        rounded-lg cursor-pointer
        hover:bg-orange-700
      ">
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
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirmer l’adresse e-mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
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
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className={`mt-1 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
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
                  Choix de l’adhésion <span className="text-red-600">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pack Basique */}
                  <label
                    className={`relative block cursor-pointer rounded-lg border-2 p-6 transition-all ${
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
                    className={`relative block cursor-pointer rounded-lg border-2 p-6 transition-all ${
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
                      <li>✓ 2 lettres de relance au donneur d’ordre</li>
                      <li>✓ Annulation gratuite avant 12h</li>
                    </ul>
                    <span className="absolute top-1 right-2 bg-white-600 text-black border border-gray-300 text-xs px-1 py-0.5 rounded">
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
                  J’accepte les{' '}
                  <a href="/cgv" target="_blank" className="text-blue-600 underline">
                    conditions générales d’adhésion
                  </a>{' '}
                  ainsi que le traitement de mes données personnelles et l’utilisation de la géolocalisation.{' '}
                  <span className="text-red-600">*</span>
                </label>
              </div>

              {/* 6. Boutons */}
         <div className="flex flex-col sm:flex-row sm:justify-between pt-6 gap-4">
  <div className="flex gap-3">
    <button
      type="button"
      className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
    >
      Retour
    </button>

    <button
      type="button"
      className="px-4 sm:px-6 py-2 sm:py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
    >
      Annuler
    </button>
  </div>

  <button
    type="submit"
    disabled={!isFormValid}
    className={`px-6 sm:px-10 py-2 sm:py-3 rounded-lg font-medium text-white transition ${
      isFormValid
        ? 'bg-blue-600 hover:bg-blue-700'
        : 'bg-gray-400 cursor-not-allowed'
    }`}
  >
    Valider mon inscription
  </button>
</div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}