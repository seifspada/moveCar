'use client';

import { useState } from 'react';
import { Upload, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DateTimePicker } from '@/app/components/DateTimePicker';
import CustomSelect from '@/app/components/customSelect';
import { CityAutocomplete, SelectedCity } from '@/components/mission-components/CityAutocomplete';

// Types
type FormData = {
  villeDepart: string;
  typeLieuDepart: string;
  nomLieuDepart: string;
  villeArrivee: string;
  typeLieuArrivee: string;
  nomLieuArrivee: string;
  typeVehicule: string;
  marqueModele: string;
  immatriculation: string;
  nombrePlaces: string;
  boiteVitesse: string;
  commentaire: string;
};




// Composant ToggleSwitch
const ToggleSwitch = ({ label, checked, onChange }: { 
  label: string; 
  checked: boolean; 
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between bg-white border border-orange-200 px-5 py-4 rounded-full">
    <span className="text-sm font-semibold text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner ${
        checked ? 'bg-orange-500' : 'bg-gray-300'
      }`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  </div>
);

// Composant principal
export default function TravelRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    villeDepart: '', typeLieuDepart: '', nomLieuDepart: '',
    villeArrivee: '', typeLieuArrivee: '', nomLieuArrivee: '',
    typeVehicule: '', marqueModele: '', immatriculation: '',
    nombrePlaces: '', boiteVitesse: '', commentaire: ''
  });

  const [departureNotify, setDepartureNotify] = useState(false);
  const [arrivalNotify, setArrivalNotify] = useState(false);
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const [selectedTime1, setSelectedTime1] = useState('');
  const [selectedTime2, setSelectedTime2] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
 const [inputValueArrivee, setInputValueArrivee] = useState("");
  const [selectedCityArrivee, setSelectedCityArrivee] = useState<SelectedCity | null>(null);
  const [inputValueDepart, setInputValueDepart] = useState("");
  const [selectedCityDepart, setSelectedCityDepart] = useState<SelectedCity | null>(null);
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);



  // Gestion de la sélection de ville avec synchronisation
  const handleCitySelectDepart = (city: SelectedCity | null) => {
    setSelectedCityDepart(city);
    setFormData({ ...formData, villeDepart: city?.name || '' });
  };

  const handleCitySelectArrivee = (city: SelectedCity | null) => {
    setSelectedCityArrivee(city);
    setFormData({ ...formData, villeArrivee: city?.name || '' });
  };




  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const validateForm = (): string[] => {
  const missing: string[] = [];

  const requiredFields = [
    { value: formData.villeDepart, label: 'Ville de départ' },
    { value: formData.typeLieuDepart, label: 'Type de lieu de départ' },
    // nomLieuDepart → optionnel
    
    { value: formData.villeArrivee, label: "Ville d'arrivée" },
    { value: formData.typeLieuArrivee, label: "Type de lieu d'arrivée" },
    // nomLieuArrivee → optionnel

    { value: formData.typeVehicule, label: 'Type de véhicule' },
    { value: formData.marqueModele, label: 'Marque et modèle' },
    { value: formData.immatriculation, label: 'Immatriculation' },
    { value: formData.nombrePlaces, label: 'Nombre de places' },
    { value: formData.boiteVitesse, label: 'Boîte de vitesse' },

    { value: selectedDate1, label: 'Date de début' },
    { value: selectedTime1, label: 'Heure de début' },
    { value: selectedDate2, label: 'Date de fin' },
    { value: selectedTime2, label: 'Heure de fin' },
  ];

  requiredFields.forEach(field => {
    if (!field.value?.toString().trim()) {
      missing.push(field.label);
    }
  });

  // Vérification cohérence dates
  if (selectedDate1 && selectedDate2 && selectedTime1 && selectedTime2) {
    const start = new Date(`${selectedDate1}T${selectedTime1}`);
    const end = new Date(`${selectedDate2}T${selectedTime2}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      missing.push('Format de date/heure invalide');
    }
    else if (end <= start) {
      missing.push('La date/heure de fin doit être après le début');
    }
  }

  return missing;
};
  const handleSubmit = () => {
    const missing = validateForm();
    setMissingFields(missing);
    setShowModal(true);
    if (missing.length === 0) {
      console.log('Formulaire soumis', formData);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              Demande de déplacement envoyée
            </h2>
          </div>

          <div className="p-8 text-center py-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">Votre demande a été soumise avec succès 🚚</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Votre demande de déplacement a bien été enregistrée et sera traitée dans les plus brefs délais.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto text-left text-sm text-gray-700 space-y-2">
              <h4 className="font-semibold text-gray-900 mb-4">Récapitulatif</h4>
              <p><strong>Départ :</strong> {formData.villeDepart} ({formData.typeLieuDepart})</p>
              <p><strong>Arrivée :</strong> {formData.villeArrivee} ({formData.typeLieuArrivee})</p>
              <p><strong>Véhicule :</strong> {formData.marqueModele} - {formData.immatriculation}</p>
              <p><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
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
    );
  }


  const [files, setFiles] = useState<{
  documentDepart?: File;
  documentArrivee?: File;
}>({});

// 2. Fonction de gestion (à ajouter aussi)
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'documentDepart' | 'documentArrivee') => {
  const file = e.target.files?.[0];
  if (file) {
    setFiles(prev => ({ ...prev, [key]: file }));
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="border-l-4 border-orange-500 pl-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Demande de Déplacement</h1>
          <p className="text-sm text-gray-600 mt-1">Complétez les informations pour votre demande</p>
        </div>

        {/* Entité et Adresse */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Entité</label>
            <input type="text" value="Société Transport Express" readOnly 
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
            <input type="text" value="45 Avenue des Champs-Élysées, 75008 Paris" readOnly 
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700" />
          </div>
        </div>

       {/* Départ */}
<div className="border-2 border-orange-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-orange-50 to-white">
  <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
    <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
    Adresse de départ
  </h2>
  <div className="space-y-4">
    {/* CityAutocomplete pour ville de départ */}
    <CityAutocomplete
      value={inputValueDepart}
      onValueChange={setInputValueDepart}
      selectedCity={selectedCityDepart}
      onSelectCity={handleCitySelectDepart}
      theme="light"
      placeholder="Entrez votre ville de départ (min. 2 caractères)"
    />
    
  
<div className="grid grid-cols-2 gap-4">
  <CustomSelect
    options={[
      { label: "Agence", value: "agence" },
      { label: "Concession", value: "concession" },
      { label: "Particulier", value: "particulier" }
    ]}
    value={formData.typeLieuDepart}           // ← CORRECTION ici
    onChange={(value) => handleInputChange({ 
      target: { name: 'typeLieuDepart', value: String(value) } 
    } as any)}
    placeholder="Type de lieu"
/>
  <input 
    type="text" 
    name="nomLieuDepart" 
    value={formData.nomLieuDepart} 
    onChange={handleInputChange}
    placeholder="Nom du lieu (ex: Agence XYZ)" 
    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500" 
  />
</div>
    <ToggleSwitch label="Prévenir une personne au départ" checked={departureNotify} onChange={setDepartureNotify} />
  </div>
</div>

{/* Arrivée */}
<div className="border-2 border-orange-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-orange-50 to-white">
  <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center">
    <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
    Adresse d'arrivée
  </h2>
  <div className="space-y-4">
    {/* CityAutocomplete pour ville d'arrivée */}
    <CityAutocomplete
      value={inputValueArrivee}
      onValueChange={setInputValueArrivee}
      selectedCity={selectedCityArrivee}
      onSelectCity={handleCitySelectArrivee}
      theme="light"
      placeholder="Entrez votre ville d'arrivée (min. 2 caractères)"
    />
    
<div className="grid grid-cols-2 gap-4">
  <CustomSelect
    options={[
      { label: "Agence", value: "agence" },
      { label: "Concession", value: "concession" },
      { label: "Particulier", value: "particulier" }
    ]}
    value={formData.typeLieuArrivee}
    onChange={(value) => handleInputChange({ 
      target: { name: 'typeLieuArrivee', value: String(value) } 
    } as any)}
    placeholder="Type de lieu"
/>
  <input 
    type="text" 
    name="nomLieuArrivee" 
    value={formData.nomLieuArrivee} 
    onChange={handleInputChange}
    placeholder="Nom du lieu (ex: Concession ACME)" 
    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500" 
  />
</div>
    <ToggleSwitch label="Prévenir une personne à l'arrivée" checked={arrivalNotify} onChange={setArrivalNotify} />
  </div>
</div>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
  {/* Document de départ */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      Document de départ <span className="text-orange-500 text-xs">(facultatif)</span>
    </label>
    <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-orange-300 rounded-full cursor-pointer bg-orange-50/50 hover:border-orange-500 hover:bg-orange-50 transition-all group">
      <div className="text-center p-6">
        <Upload className="mx-auto h-10 w-10 text-orange-400 group-hover:text-orange-600 transition-colors" />
        <p className="mt-3 text-sm font-medium text-gray-600 group-hover:text-orange-700">
          Déposer ou cliquer pour uploader
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, JPG, PNG • Max. 10 Mo
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => handleFileChange(e, 'documentDepart')}
      />
    </label>
    
    {files.documentDepart && (
      <div className="mt-2 flex items-center gap-2 text-sm">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-green-700 truncate max-w-[220px]">
          {files.documentDepart.name}
        </span>
      </div>
    )}
  </div>

  {/* Document d'arrivée */}
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      Document d'arrivée <span className="text-orange-500 text-xs">(facultatif)</span>
    </label>
    <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-orange-300 rounded-full cursor-pointer bg-orange-50/50 hover:border-orange-500 hover:bg-orange-50 transition-all group">
      <div className="text-center p-6">
        <Upload className="mx-auto h-10 w-10 text-orange-400 group-hover:text-orange-600 transition-colors" />
        <p className="mt-3 text-sm font-medium text-gray-600 group-hover:text-orange-700">
          Déposer ou cliquer pour uploader
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, JPG, PNG • Max. 10 Mo
        </p>
      </div>
      <input
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => handleFileChange(e, 'documentArrivee')}
      />
    </label>
    
    {files.documentArrivee && (
      <div className="mt-2 flex items-center gap-2 text-sm">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span className="text-green-700 truncate max-w-[220px]">
          {files.documentArrivee.name}
        </span>
      </div>
    )}
  </div>
</div>

        {/* Véhicule */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select name="typeVehicule" value={formData.typeVehicule} onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500">
            <option value="">Type de véhicule</option>
            <option value="citadine">Citadine</option>
            <option value="berline">Berline</option>
            <option value="suv">SUV</option>
          </select>
          <input type="text" name="marqueModele" value={formData.marqueModele} onChange={handleInputChange}
            placeholder="Marque et modèle" className="col-span-2 w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500" />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <input type="text" name="immatriculation" value={formData.immatriculation} onChange={handleInputChange}
            placeholder="Immatriculation" className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500" />
          <select name="nombrePlaces" value={formData.nombrePlaces} onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500">
            <option value="">Places</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <select name="boiteVitesse" value={formData.boiteVitesse} onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500">
            <option value="">Boîte</option>
            <option value="automatique">Automatique</option>
            <option value="manuelle">Manuelle</option>
          </select>
        </div>

        {/* Commentaire */}
        <div className="border-2 border-orange-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-orange-50 to-white">
          <h2 className="text-lg font-bold text-orange-700 mb-4">Commentaire</h2>
          <textarea name="commentaire" value={formData.commentaire} onChange={handleInputChange}
            placeholder="Instructions complémentaires..." rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>

        {/* Disponibilité */}
        <div className="border-2 border-orange-200 rounded-xl p-6 mb-8 bg-gradient-to-br from-orange-50 to-white">
          <h2 className="text-lg font-bold text-orange-700 mb-4">Disponibilité du véhicule</h2>
          <DateTimePicker 
            selectedDate={selectedDate1} 
            selectedTime={selectedTime1}
            onDateChange={setSelectedDate1}
            onTimeChange={setSelectedTime1}
            label="Disponible à partir du"
          />
          <DateTimePicker 
            selectedDate={selectedDate2} 
            selectedTime={selectedTime2}
            onDateChange={setSelectedDate2}
            onTimeChange={setSelectedTime2}
            label="Disponible jusqu'au"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-4">
          <button type="button" className="px-8 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-all">
            Retour
          </button>
          <button type="button" onClick={handleSubmit}
            className="px-30 py-5 bg-orange-500 text-white rounded-full font-semibold hover:bg-green-600  transition-all">
            Calculer
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {missingFields.length === 0 ? '✓ Formulaire validé' : '⚠ Champs manquants'}
            </h3>
            {missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-full text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold">Demande soumise avec succès!</p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">Veuillez remplir:</p>
                <ul className="list-disc list-inside text-red-600 mb-6 space-y-1">
                  {missingFields.map((field, idx) => <li key={idx}>{field}</li>)}
                </ul>
              </>
            )}
            <button onClick={() => setShowModal(false)}
              className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition font-semibold">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}