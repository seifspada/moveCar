"use client"; // ← Ajoute cette ligne en tout premier
import { useState } from 'react';
import { Upload, Camera, Calendar, FileText, IdCard, Truck, Link } from 'lucide-react';
import router, { useRouter } from 'next/navigation';

export default function AdherantFormulaire() {
const [formData, setFormData] = useState({
      nom: '',
    prenom: '',
    dateNaissance: '',
    email: '',
    adresse: '',
    telephone: '',
    raisonSociale: '',
    numeroPermis: '',
    dateDelivrance: '',
    typePermis: '',
    immatriculation: '',
    rcPro: '',
    rcCirculation: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Gestion des fichiers
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files?.[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

   const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérification de tous les champs
    const missing: string[] = [];
    
    // Liste des champs texte à vérifier
    const textFields = [
      { value: formData.nom, label: 'Nom' },
      { value: formData.prenom, label: 'Prénom' },
      { value: formData.dateNaissance, label: 'Date de naissance' },
      { value: formData.email, label: 'Email' },
      { value: formData.adresse, label: 'Adresse complète' },
      { value: formData.raisonSociale, label: 'Raison sociale / Numéro Kbis' },
      { value: formData.numeroPermis, label: 'Numéro de permis' },
      { value: formData.dateDelivrance, label: 'Date de délivrance du permis' },
      { value: formData.typePermis, label: 'Type de permis' },
    ];
    
    // Vérifier les champs texte avec while
    let i = 0;
    while (i < textFields.length) {
      const field = textFields[i];
      let checkEmpty = !field.value;
      while (checkEmpty) {
        missing.push(field.label);
        checkEmpty = false;
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
    
    // Vérifier les fichiers avec while
    let j = 0;
    while (j < fileFields.length) {
      const file = fileFields[j];
      let checkFile = !file.value;
      while (checkFile) {
        missing.push(file.label);
        checkFile = false;
      }
      j++;
    }
    
    setMissingFields(missing);
    setShowModal(true);
    
    // Vérifier si le formulaire est complet
    let isComplete = missing.length === 0;
    while (isComplete) {
      console.log('Formulaire complet soumis', { formData, files });
      // Ici appel API
      isComplete = false;
    }
  };
  const router = useRouter();
    const handleCancel = () => {
    router.push('/'); // <-- mettre le path de redirection ici
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Truck className="w-12 h-12 text-orange-500" />
              <h1 className="text-4xl font-bold text-orange-900">
                Inscription Adhérent Convoyeur
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Tous les champs marqués d'une étoile (*) sont obligatoires</p>
          </div>

          <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-800 to-orange-600 text-white p-6">
              <h2 className="text-2xl font-semibold flex items-center gap-3">
                <IdCard className="w-8 h-8" />
                Informations personnelles & entreprise
              </h2>
            </div>

            <div className="p-8 space-y-8">
              {/* Informations personnelles */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-black"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-black"
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
                  className=" w-[95%]   sm:w-full px-4 sm:px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black" 
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-black"
                  placeholder="06 12 34 56 78"
                />
              </div>

               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                 email <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-black"
                  placeholder="exemple@domaine.com"
                />
              </div>

                <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="adresse"
                  required
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-black"
                  placeholder="12 rue des Lilas, 75001 Paris"
                />
              </div>

                 
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison sociale / Numéro Kbis <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="raisonSociale"
                  required
                  value={formData.raisonSociale}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition placeholder-gray-400 text-black"
                  placeholder="SARL TRANSPORT EXPRESS - SIRET 123 456 789 00012"
                />
              </div>
              </div>

              {/* Permis de conduire */}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none  focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 text-black"
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
                      className=" w-[93%]   sm:w-full px-4 sm:px-2 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:border-orange-500 text-black" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de permis <span className="text-orange-500">*</span>
                    </label>
                    <select
                      name="typePermis"
                      required
                      value={formData.typePermis}
                      onChange={(e) => setFormData({ ...formData, typePermis: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-400 text-black"
                    >
                      <option value="">Sélectionner</option>
                      <option value="C">C (Poids lourd)</option>
                      <option value="CE">CE (Remorque)</option>
                      <option value="D">D (Transport de personnes)</option>
                    </select>
                  </div>
                </div>

                {/* Photo permis recto/verso */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Permis de conduire recto/verso <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition">
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

              {/* Documents à uploader */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-orange-900 flex items-center gap-3">
                  <Upload className="w-7 h-7" />
                  Documents obligatoires
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'carteIdentite', label: 'Carte d’identité valide' },
                    { key: 'kbis', label: 'Kbis (moins de 3 mois)' },
                    { key: 'rib', label: 'RIB (IBAN)' },
                    { key: 'assuranceRcPro', label: 'Assurance RC PRO' },
                    { key: 'casierJudiciaire', label: 'Extrait casier judiciaire (moins de 3 mois)' },
                  ].map((doc) => (
                    <div key={doc.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {doc.label} <span className="text-orange-500">*</span>
                      </label>
                      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-orange-400 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition">
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

                  {/* Assurance RC Circulation avec photo véhicule */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assurance RC circulation (photo avec MT visible) <span className="text-orange-500">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-400 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100">
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

              {/* Boutons */}
              <div className="flex justify-end gap-4 pt-8">
                <button
                  type="button"
                   onClick={handleCancel}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg focus:outline-none font-medium hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-lg focus:outline-none font-semibold hover:from-orange-700 hover:to-orange-900 shadow-lg transform hover:scale-105 transition"
                >
                  Valider l'inscription
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}