'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, X } from 'lucide-react';
import { DateTimePicker } from '@/app/components/DateTimePicker';
import { SelectedCity } from '@/components/mission-components/CityAutocomplete';
import ProfileHeader from '@/components/partenaire-components/ProfileHeader';
import SidebarPartenaire from '@/app/components/sideBarPartenaire';
import AddressSection from '@/components/partenaire-components/AddressSection';
import { useRoleProtection } from '@/app/hooks/userRoleProtection';

// ===================================
// TYPES
// ===================================
type FormData = {
  adresseArriveeComplete: string;
  adresseDepartComplete: string;
  villeDepart: string;
  typeLieuDepart: string;
  nomLieuDepart: string;
  villeArrivee: string;
  typeLieuArrivee: string;
  nomLieuArrivee: string;
  typeVehicule: string;
  typeCarburant: string;
  marqueModele: string;
  immatriculation: string;
  nombrePlaces: string;
  boiteVitesse: string;
  commentaire: string;
  nomContactDepart: string;
  telephoneContactDepart: string;
  nomContactArrivee: string;
  telephoneContactArrivee: string;
};

// ===================================
// FONCTIONS HELPER DE MAPPING
// ===================================
const mapVehiculeType = (type: string): string => {
  const mapping: Record<string, string> = {
    'citadine': 'CITADINE',
    'berline': 'BERLINE',
    'compacte': 'COMPACTE',
    'cabriolet': 'CABRIOLET',
    'monospace': 'MONOSPACE',
    'luxe': 'LUXE',
    'VU3m3': 'VU_3M3',
    'VU6m3': 'VU_6M3',
    'VU9m3': 'VU_9M3',
    'VU12m3': 'VU_12M3',
    'VU15m3': 'VU_15M3',
    'VU20m3': 'VU_20M3',
    'VU25m3': 'VU_25M3',
    'VU30m3': 'VU_30M3',
  };
  return mapping[type] || type;
};

const mapCarburantType = (type: string): string => {
  const mapping: Record<string, string> = {
    'Essence': 'ESSENCE',
    'Diesel': 'DIESEL',
    'Hybride': 'HYBRIDE',
    'Electrique': 'ELECTRIQUE',
  };
  return mapping[type] || type;
};

const mapBoiteVitesse = (type: string): string => {
  const mapping: Record<string, string> = {
    'automatique': 'AUTOMATIQUE',
    'manuelle': 'MANUELLE',
  };
  return mapping[type] || type;
};

// ===================================
// COMPOSANT PRINCIPAL
// ===================================
export default function TravelRequestForm() {
  const { isAuthorized, isLoading } = useRoleProtection({
    allowedRoles: ['partenaire']
  });

  // États du formulaire
  const [formData, setFormData] = useState<FormData>({
    villeDepart: '',
    adresseDepartComplete: '',
    typeLieuDepart: '',
    nomLieuDepart: '',
    villeArrivee: '',
    adresseArriveeComplete: '',
    typeLieuArrivee: '',
    nomLieuArrivee: '',
    typeVehicule: '',
    typeCarburant: '',
    marqueModele: '',
    immatriculation: '',
    nombrePlaces: '',
    boiteVitesse: '',
    commentaire: '',
    nomContactDepart: '',
    telephoneContactDepart: '',
    nomContactArrivee: '',
    telephoneContactArrivee: '',
  });

  // États UI
  const [departureNotify, setDepartureNotify] = useState(false);
  const [arrivalNotify, setArrivalNotify] = useState(false);
  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const [selectedTime1, setSelectedTime1] = useState('');
  const [selectedTime2, setSelectedTime2] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputValueArrivee, setInputValueArrivee] = useState('');
  const [selectedCityArrivee, setSelectedCityArrivee] = useState<SelectedCity | null>(null);
  const [inputValueDepart, setInputValueDepart] = useState('');
  const [selectedCityDepart, setSelectedCityDepart] = useState<SelectedCity | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [missionData, setMissionData] = useState<any>(null);

  // ===================================
  // HANDLERS
  // ===================================
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  const handleCitySelectDepart = (city: SelectedCity | null) => {
    setSelectedCityDepart(city);
    setFormData({ ...formData, villeDepart: city?.name || '' });
  };

  const handleCitySelectArrivee = (city: SelectedCity | null) => {
    setSelectedCityArrivee(city);
    setFormData({ ...formData, villeArrivee: city?.name || '' });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const uniqueFiles = selectedFiles.filter(
      newFile => !files.some(existingFile => existingFile.name === newFile.name)
    );
    setFiles(prev => [...prev, ...uniqueFiles].slice(0, 3));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ===================================
  // VALIDATION
  // ===================================
  const validateForm = (): string[] => {
    const missing: string[] = [];

    const requiredFields = [
      { value: formData.villeDepart, label: 'Ville de départ' },
      { value: formData.adresseDepartComplete, label: 'Adresse de départ' },
      { value: formData.typeLieuDepart, label: 'Type de lieu de départ' },
      { value: formData.villeArrivee, label: "Ville d'arrivée" },
      { value: formData.adresseArriveeComplete, label: "Adresse d'arrivée" },
      { value: formData.typeLieuArrivee, label: "Type de lieu d'arrivée" },
      { value: formData.typeVehicule, label: 'Type de véhicule' },
      { value: formData.typeCarburant, label: 'Type de carburant' },
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

    if (departureNotify) {
      if (!formData.nomContactDepart?.trim()) {
        missing.push('Nom du contact de départ');
      }
      if (!formData.telephoneContactDepart?.trim()) {
        missing.push('Téléphone du contact de départ');
      }
    }

    if (arrivalNotify) {
      if (!formData.nomContactArrivee?.trim()) {
        missing.push("Nom du contact d'arrivée");
      }
      if (!formData.telephoneContactArrivee?.trim()) {
        missing.push("Téléphone du contact d'arrivée");
      }
    }

    // ✅ Validation des dates
    if (selectedDate1 && selectedDate2 && selectedTime1 && selectedTime2) {
      const start = new Date(`${selectedDate1}T${selectedTime1}`);
      const end = new Date(`${selectedDate2}T${selectedTime2}`);
      const now = new Date();

      if (isNaN(start.getTime())) {
        missing.push('⚠️ Date/heure de début invalide');
      } else if (isNaN(end.getTime())) {
        missing.push('⚠️ Date/heure de fin invalide');
      } else if (start < now) {
        missing.push('⏰ La date de début doit être dans le futur');
      } else if (end <= start) {
        missing.push('📅 La date de fin doit être après la date de début');
      }
    }

    return missing;
  };

  // ===================================
  // UPLOAD DOCUMENTS
  // ===================================
  const uploadDocuments = async (missionId: string, files: File[]) => {
    if (files.length === 0) return;

    console.log(`📄 Upload de ${files.length} document(s) pour la mission ${missionId}...`);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('documents', file);
      });
      formData.append('missionId', missionId);

      const response = await fetch('/api/mission/upload-documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'upload des documents");
      }

      const result = await response.json();
      console.log('✅ Documents uploadés:', result);
    } catch (error) {
      console.error('❌ Erreur upload documents:', error);
      throw error;
    }
  };

  // ===================================
  // SOUMISSION
  // ===================================
  const handleSubmit = async () => {
    setDateError(null);
    const missing = validateForm();
    setMissingFields(missing);

    if (missing.length > 0) {
      const dateErrors = missing.filter(m =>
        m.includes('date') ||
        m.includes('heure') ||
        m.includes('⚠️') ||
        m.includes('⏰') ||
        m.includes('📅')
      );

      if (dateErrors.length > 0) {
        setDateError(dateErrors[0]);
      }

      setShowModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const missionData = {
        partenaireId: '1',

        villeDepart: formData.villeDepart,
        adresseDepartComplete: formData.adresseDepartComplete,
        typeLieuDepart: formData.typeLieuDepart,
        ...(formData.nomLieuDepart && { nomLieuDepart: formData.nomLieuDepart }),

        villeArrivee: formData.villeArrivee,
        adresseArriveeComplete: formData.adresseArriveeComplete,
        typeLieuArrivee: formData.typeLieuArrivee,
        ...(formData.nomLieuArrivee && { nomLieuArrivee: formData.nomLieuArrivee }),

        typeVehicule: mapVehiculeType(formData.typeVehicule),
        typeCarburant: mapCarburantType(formData.typeCarburant),
        marqueModele: formData.marqueModele,
        immatriculation: formData.immatriculation.toUpperCase(),
        nombrePlaces: parseInt(formData.nombrePlaces),
        boiteVitesse: mapBoiteVitesse(formData.boiteVitesse),

        dateDebut: new Date(`${selectedDate1}T${selectedTime1}`).toISOString(),
        dateFin: new Date(`${selectedDate2}T${selectedTime2}`).toISOString(),

        ...(departureNotify && {
          notifierDepart: true,
          nomContactDepart: formData.nomContactDepart,
          telephoneContactDepart: formData.telephoneContactDepart
        }),

        ...(arrivalNotify && {
          notifierArrivee: true,
          nomContactArrivee: formData.nomContactArrivee,
          telephoneContactArrivee: formData.telephoneContactArrivee
        }),

        ...(formData.commentaire?.trim() && {
          commentaire: formData.commentaire.trim()
        })
      };

      console.log('📤 Envoi des données:', missionData);

      // ✅ Utiliser votre path existant
      const response = await fetch('/api/mission/creationMission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(missionData),
      });

     const result = await response.json();

if (!result.success) {
  throw new Error(result.error || 'Erreur lors de la création de la mission');
}

console.log('✅ Mission créée:', result);

// ✅ Stocker les données de la mission
setMissionData(result.data);

// ✅ Upload des documents si présents
if (files.length > 0 && result.data?.id) {
  try {
    await uploadDocuments(result.data.id, files);
    console.log('✅ Tous les documents ont été uploadés');
  } catch (uploadError) {
    console.warn('⚠️ Erreur upload documents (mission créée quand même):', uploadError);
  }
}

setIsSubmitted(true);


    } catch (error: any) {
      console.error('❌ Erreur lors de la soumission:', error);

      let userMessage = 'Une erreur inattendue est survenue. Veuillez réessayer.';

      if (error.message) {
        userMessage = error.message;
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        userMessage = '🌐 Impossible de contacter le serveur.\n\nVérifiez votre connexion internet.';
      }

      setErrorMessage(userMessage);
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================================
  // RENDU CONDITIONNEL
  // ===================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

if (isSubmitted) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      {/* Modal optimisé pour impression */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        
        {/* Header - Compact */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 print:bg-orange-600 print:p-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 print:text-lg">
                <CheckCircle2 className="w-6 h-6 print:w-5 print:h-5" />
                Mission créée avec succès
              </h2>
              <p className="text-orange-100 text-xs mt-0.5">
                Réf: {missionData?.id?.substring(0, 8).toUpperCase() || 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-100">Créée le</p>
              <p className="font-semibold text-sm">
                {missionData?.dateCreation 
                  ? new Date(missionData.dateCreation).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 print:p-4">
          {/* Statut - Compact */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg mb-4 print:mb-3 print:p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-yellow-800 uppercase">Statut</p>
                <p className="text-lg font-bold text-yellow-700 print:text-base">
                  {missionData?.statut === 'EN_ATTENTE' ? '⏳ En attente' : missionData?.statut}
                </p>
              </div>
            </div>
          </div>

          {/* Trajet - Sur une seule ligne - Compact */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4 mb-4 print:mb-3 print:p-3 print:border">
            <h4 className="text-base font-bold text-orange-700 mb-3 flex items-center gap-2 print:text-sm print:mb-2">
              <span className="text-lg print:text-base">🚗</span> Itinéraire
            </h4>
            
            <div className="grid grid-cols-2 gap-4 print:gap-3">
              {/* Départ */}
              <div className="flex gap-3 print:gap-2">
                <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 print:w-8 print:h-8 print:text-base">
                  A
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-green-700 uppercase mb-0.5">Départ</p>
                  <p className="font-bold text-gray-900 text-base truncate print:text-sm">
                    {missionData?.adresseDepart?.villeNom || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {missionData?.adresseDepart?.adresseComplete || 'N/A'}
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full inline-block mt-1">
                    {missionData?.adresseDepart?.typeLieu || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Arrivée */}
              <div className="flex gap-3 print:gap-2">
                <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 print:w-8 print:h-8 print:text-base">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-red-700 uppercase mb-0.5">Arrivée</p>
                  <p className="font-bold text-gray-900 text-base truncate print:text-sm">
                    {missionData?.adresseArrivee?.villeNom || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {missionData?.adresseArrivee?.adresseComplete || 'N/A'}
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full inline-block mt-1">
                    {missionData?.adresseArrivee?.typeLieu || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 colonnes pour optimiser l'espace */}
          <div className="grid grid-cols-3 gap-4 mb-4 print:gap-3 print:mb-3">
            {/* Colonne 1 - Statistiques + Frais */}
            <div className="space-y-4 print:space-y-3">
              {/* Statistiques */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
                <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
                  <span className="text-base print:text-sm">📊</span> Trajet
                </h5>
                <div className="space-y-2 print:space-y-1.5">
                  <div className="flex justify-between items-center pb-1.5 border-b border-orange-200">
                    <span className="text-xs text-gray-700">Distance</span>
                    <span className="text-base font-bold text-orange-700 print:text-sm">
                      {missionData?.calculs?.distanceKm || '0'} km
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-1.5 border-b border-orange-200">
                    <span className="text-xs text-gray-700">Durée</span>
                    <span className="text-base font-bold text-orange-700 print:text-sm">
                      {missionData?.calculs?.detailCalcul?.dureeFormatee || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-gray-700 font-bold">Total</span>
                    <span className="text-lg font-bold text-orange-600 print:text-base">
                      {parseFloat(missionData?.calculs?.montantTotal || '0').toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Détails des frais */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 print:p-2 print:border">
                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
                  <span className="text-base print:text-sm">💰</span> Frais
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600 text-xs">
                      Kilométrage
                    </span>
                    <span className="font-semibold text-gray-900">
                      {((parseFloat(missionData?.calculs?.distanceKm || '0')) * (missionData?.calculs?.detailCalcul?.prixParKm || 0)).toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span className="text-gray-600 text-xs">Péage</span>
                    <span className="font-semibold text-gray-900">
                      {parseFloat(missionData?.calculs?.fraisPeage || '0').toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 bg-orange-50 -mx-1 px-1 py-1.5 rounded border border-orange-200">
  <span className="font-bold text-gray-900 text-xs">TTC</span>
  <span className="font-bold text-orange-600 text-sm">
    {parseFloat(missionData?.calculs?.montantTotal || '0').toFixed(2)} €
  </span>
</div>
                </div>
              </div>
            </div>

            {/* Colonne 2 - Véhicule + Disponibilité */}
            <div className="space-y-4 print:space-y-3">
              {/* Véhicule */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
                <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
                  <span className="text-base print:text-sm">🚙</span> Véhicule
                </h5>
                <div className="space-y-2 print:space-y-1.5">
                  <div>
                    <p className="text-xs text-orange-700 font-semibold uppercase">Modèle</p>
                    <p className="font-bold text-gray-900 text-sm">{missionData?.vehicule?.marqueModele || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-orange-700">Immat.</p>
                      <p className="font-bold text-gray-900 text-xs">{missionData?.vehicule?.immatriculation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700">Type</p>
                      <p className="font-bold text-gray-900 text-xs">{missionData?.vehicule?.typeVehicule || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700">Carburant</p>
                      <p className="font-bold text-gray-900 text-xs">{missionData?.vehicule?.typeCarburant || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-orange-700">Places</p>
                      <p className="font-bold text-gray-900 text-xs">{missionData?.vehicule?.nombrePlaces || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Disponibilité */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
                <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
                  <span className="text-base print:text-sm">📅</span> Disponibilité
                </h5>
                <div className="space-y-2 print:space-y-1.5">
                  <div>
                    <p className="text-xs text-orange-700 font-semibold uppercase">Départ dès le</p>
                    <p className="font-bold text-gray-900 text-xs">
                      {missionData?.disponibilite?.dateDebut 
                        ? new Date(missionData.disponibilite.dateDebut).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-700 font-semibold uppercase">Arrivée avant le</p>
                    <p className="font-bold text-gray-900 text-xs">
                      {missionData?.disponibilite?.dateFin 
                        ? new Date(missionData.disponibilite.dateFin).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 3 - Notifications + Commentaire + Documents */}
            <div className="space-y-4 print:space-y-3">
              {/* Notifications */}
              {missionData?.notifications && missionData.notifications.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 print:p-2 print:border">
                  <h5 className="font-bold text-orange-800 mb-3 flex items-center gap-1 text-sm print:text-xs print:mb-2">
                    <span className="text-base print:text-sm">🔔</span> Notifications
                  </h5>
                  <div className="space-y-2 print:space-y-1.5">
                    {missionData.notifications.map((notif: any, idx: number) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-orange-200 print:p-1.5">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-sm print:text-xs">{notif.typeNotification === 'DEPART' ? '📤' : '📥'}</span>
                          <p className="font-bold text-gray-900 text-xs flex-1">
                            {notif.typeNotification === 'DEPART' ? 'Départ' : 'Arrivée'}
                          </p>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                            notif.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {notif.actif ? '✓' : '○'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {notif.nomContact || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notif.telephoneContact || 'N/A'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commentaire */}
              {missionData?.commentaire && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-2 rounded-lg print:border print:p-1.5">
                  <p className="text-xs font-semibold text-amber-800 uppercase mb-1 flex items-center gap-1">
                    <span>💬</span> Commentaire
                  </p>
                  <p className="text-gray-700 text-xs italic line-clamp-3">{missionData.commentaire}</p>
                </div>
              )}

              {/* Documents */}
              {files.length > 0 && (
                <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 print:p-2 print:border">
                  <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-1 text-sm print:text-xs">
                    <span className="text-base print:text-sm">📎</span> Documents
                  </h5>
                  <ul className="space-y-1.5">
                    {files.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs bg-white p-1.5 rounded border border-gray-200">
                        <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="truncate flex-1 text-gray-700">{file.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 justify-center pt-4 border-t-2 border-orange-200 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 border-2 border-orange-600 rounded-xl text-orange-700 font-semibold hover:bg-orange-50 transition-all flex items-center gap-2 text-sm"
            >
              <span className="text-lg">🖨️</span> Imprimer
            </button>
            <button
              onClick={() => (window.location.href = '/partenaire/demande-mission')}
              className="px-8 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
            >
              <span className="text-lg">➕</span> Nouvelle demande
            </button>
          </div>
        </div>
      </div>

      {/* Styles optimisés pour l'impression sur 1 page */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 12mm;
          }
          
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          .print\\:border {
            border-width: 1px !important;
          }
          
          .print\\:p-4 {
            padding: 0.75rem !important;
          }
          
          .print\\:p-3 {
            padding: 0.5rem !important;
          }
          
          .print\\:p-2 {
            padding: 0.4rem !important;
          }
          
          .print\\:p-1\\.5 {
            padding: 0.3rem !important;
          }
          
          .print\\:mb-3 {
            margin-bottom: 0.5rem !important;
          }
          
          .print\\:mb-2 {
            margin-bottom: 0.4rem !important;
          }
          
          .print\\:gap-3 {
            gap: 0.5rem !important;
          }
          
          .print\\:gap-2 {
            gap: 0.4rem !important;
          }
          
          .print\\:space-y-3 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .print\\:space-y-1\\.5 > * + * {
            margin-top: 0.3rem !important;
          }
          
          .print\\:text-lg {
            font-size: 1rem !important;
          }
          
          .print\\:text-base {
            font-size: 0.9rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.8rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.7rem !important;
          }
          
          .print\\:w-5 {
            width: 1rem !important;
          }
          
          .print\\:h-5 {
            height: 1rem !important;
          }
          
          .print\\:w-8 {
            width: 1.5rem !important;
          }
          
          .print\\:h-8 {
            height: 1.5rem !important;
          }
          
          /* Éviter les coupures de page */
          .grid > div {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}
  // ===================================
  // FORMULAIRE PRINCIPAL
  // ===================================
  return (
    <div className="min-h-screen bg-black">
      <SidebarPartenaire
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />

      <ProfileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        toggleDesktopMenu={toggleDesktopMenu}
        partner={{
          nom: 'transport express',
          email: 'transportexpress@gmail.com',
          logoUrl: '/images/logo.jpg',
          isOnline: true
        }}
      />

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 pt-15 md:pt-20 my-10">
        <div className="block lg:hidden border-l-4 border-orange-500 pl-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Demande de Déplacement</h1>
          <p className="text-sm text-gray-600 mt-1">Complétez les informations pour votre demande</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Entité</label>
            <input
              type="text"
              value="Société Transport Express"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
            <input
              type="text"
              value="45 Avenue des Champs-Élysées, 75008 Paris"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        <AddressSection
          type="depart"
          stepNumber={1}
          title="Adresse de départ"
          formData={formData}
          onFormDataChange={setFormData}
          inputValue={inputValueDepart}
          onInputValueChange={setInputValueDepart}
          selectedCity={selectedCityDepart}
          onSelectCity={handleCitySelectDepart}
          notify={departureNotify}
          onNotifyChange={setDepartureNotify}
          notifyLabel="Prévenir une personne au départ"
          nomContact={formData.nomContactDepart}
          telephoneContact={formData.telephoneContactDepart}
          onNomContactChange={(value) =>
            setFormData(prev => ({ ...prev, nomContactDepart: value }))
          }
          onTelephoneContactChange={(value) =>
            setFormData(prev => ({ ...prev, telephoneContactDepart: value }))
          }
        />

        <AddressSection
          type="arrivee"
          stepNumber={2}
          title="Adresse d'arrivée"
          formData={formData}
          onFormDataChange={setFormData}
          inputValue={inputValueArrivee}
          onInputValueChange={setInputValueArrivee}
          selectedCity={selectedCityArrivee}
          onSelectCity={handleCitySelectArrivee}
          notify={arrivalNotify}
          onNotifyChange={setArrivalNotify}
          notifyLabel="Prévenir une personne à l'arrivée"
          nomContact={formData.nomContactArrivee}
          telephoneContact={formData.telephoneContactArrivee}
          onNomContactChange={(value) =>
            setFormData(prev => ({ ...prev, nomContactArrivee: value }))
          }
          onTelephoneContactChange={(value) =>
            setFormData(prev => ({ ...prev, telephoneContactArrivee: value }))
          }
        />

        {/* Section Documents administratifs */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Documents administratifs{" "}
            <span className="text-orange-500 text-sm font-normal">(facultatif - max 3)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                {files[index] ? (
                  <div className="relative border-2 border-green-300 rounded-xl p-4 bg-green-50 hover:shadow-md transition-shadow">
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                      aria-label="Supprimer le fichier"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-green-200 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 truncate px-2" title={files[index].name}>
                        {files[index].name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(files[index].size / 1024 / 1024).toFixed(2)} Mo
                      </p>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-orange-300 rounded-full cursor-pointer bg-orange-50/50 hover:border-orange-500 hover:bg-orange-50 transition-all group">
                    <div className="text-center p-4">
                      <Upload className="mx-auto h-10 w-10 text-orange-400 group-hover:text-orange-600 transition-colors" />
                      <p className="mt-3 text-sm font-medium text-gray-600">
                        Document {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, JPG, PNG • Max 10 Mo
                      </p>
                    </div>

                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {files.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                📎 {files.length} document{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                {files.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span>•</span>
                    <span className="truncate">{file.name}</span>
                    <span className="text-blue-500">({(file.size / 1024).toFixed(0)} Ko)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            name="typeVehicule"
            value={formData.typeVehicule}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Type de véhicule</option>
            <option value="citadine">Citadine</option>
            <option value="berline">Berline</option>
            <option value="compacte">Compacte</option>
            <option value="cabriolet">Cabriolet</option>
            <option value="monospace">Monospace</option>
            <option value="luxe">Voiture de luxe</option>
            <option value="VU3m3">VU 3m³</option>
            <option value="VU6m3">VU 6m³</option>
            <option value="VU9m3">VU 9m³</option>
            <option value="VU12m3">VU 12m³</option>
            <option value="VU15m3">VU 15m³</option>
            <option value="VU20m3">VU 20m³</option>
            <option value="VU25m3">VU 25m³</option>
            <option value="VU30m3">VU 30m³</option>
          </select>

          <select
            name="typeCarburant"
            value={formData.typeCarburant}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Type de carburant</option>
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybride">Hybride</option>
            <option value="Electrique">Électrique</option>
          </select>

          <input
            type="text"
            name="marqueModele"
            value={formData.marqueModele}
            onChange={handleInputChange}
            placeholder="Marque et modèle"
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleInputChange}
            placeholder="Immatriculation"
            maxLength={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none uppercase"
          />

          <select
            name="nombrePlaces"
            value={formData.nombrePlaces}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Nombre de places</option>
            <option value="2">2 places</option>
            <option value="4">4 places</option>
            <option value="5">5 places</option>
            <option value="7">7 places</option>
            <option value="9">9 places</option>
          </select>

          <select
            name="boiteVitesse"
            value={formData.boiteVitesse}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Boîte de vitesse</option>
            <option value="automatique">Automatique</option>
            <option value="manuelle">Manuelle</option>
          </select>
        </div>

        <div className="border-2 border-orange-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-orange-50 to-white">
          <h2 className="text-lg font-bold text-orange-700 mb-4">Commentaire</h2>
          <textarea
            name="commentaire"
            value={formData.commentaire}
            onChange={handleInputChange}
            placeholder="Instructions complémentaires, consignes particulières..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-2 text-right">
            {formData.commentaire.length}/500 caractères
          </p>
        </div>

        <div
          className={`border-2 rounded-xl p-6 mb-8 bg-gradient-to-br transition-all ${
            dateError ? 'border-red-400 bg-red-50' : 'border-orange-200 from-orange-50 to-white'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${dateError ? 'text-red-700' : 'text-orange-700'}`}>
              Disponibilité du véhicule
            </h2>
            {dateError && (
              <span className="text-red-600 text-sm font-semibold animate-pulse">⚠️ Erreur</span>
            )}
          </div>

          {dateError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {dateError}
              </p>
            </div>
          )}

          <DateTimePicker
            selectedDate={selectedDate1}
            selectedTime={selectedTime1}
            onDateChange={(date) => {
              setSelectedDate1(date);
              setDateError(null);
            }}
            onTimeChange={(time) => {
              setSelectedTime1(time);
              setDateError(null);
            }}
            label="Disponible à partir du"
          />

          <DateTimePicker
            selectedDate={selectedDate2}
            selectedTime={selectedTime2}
            onDateChange={(date) => {
              setSelectedDate2(date);
              setDateError(null);
            }}
            onTimeChange={(time) => {
              setSelectedTime2(time);
              setDateError(null);
            }}
            label="Livraison au plus tard"
            minDate={selectedDate1}
            minTime={selectedTime1}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            disabled={isSubmitting}
          >
            Retour
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-20 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Création en cours...
              </>
            ) : (
              'Créer la mission'
            )}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {errorMessage ? (
                <>
                  <span className="text-3xl">⚠️</span>
                  Erreur
                </>
              ) : missingFields.length === 0 ? (
                <>
                  <span className="text-3xl">✓</span>
                  Formulaire validé
                </>
              ) : (
                <>
                  <span className="text-3xl">⚠️</span>
                  Champs manquants
                </>
              )}
            </h3>

            {errorMessage ? (
              <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 mb-6">
                <div className="text-red-700 text-sm font-semibold whitespace-pre-line text-left">
                  {errorMessage}
                </div>
              </div>
            ) : missingFields.length === 0 ? (
              <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
                <p className="text-green-600 text-lg font-semibold">Demande soumise avec succès!</p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4 font-medium">
                  Veuillez corriger les éléments suivants :
                </p>
                <ul className="list-none mb-6 space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                  {missingFields.map((field, idx) => (
                    <li
                      key={idx}
                      className={`text-sm p-2 rounded flex items-start gap-2 ${
                        field.includes('⚠️') || field.includes('⏰') || field.includes('📅')
                          ? 'bg-red-100 text-red-700 font-semibold border border-red-300'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      <span className="flex-shrink-0">
                        {field.includes('⚠️') || field.includes('⏰') || field.includes('📅') ? '' : '•'}
                      </span>
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                setErrorMessage(null);
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full hover:from-orange-700 hover:to-orange-800 transition font-semibold shadow-md hover:shadow-lg"
            >
              {errorMessage ? 'Corriger' : 'Compris'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
