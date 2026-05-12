// components/partenaire-components/MissionRequestForm/index.tsx (ou ton fichier principal)
'use client';

import React, { useState, useEffect } from 'react';
import { FileUpload, MissionFormData } from '@/app/types/mission';
import type { VehicleType, VehiculeCarburant } from '@/app/config/mission-icons.config';
import { FormHeader } from './MissionRequestForm/FormHeader';
import AddressSection from './AddressSection';
import { DocumentUpload } from './MissionRequestForm/DocumentUpload';
import { VehicleSection } from './MissionRequestForm/VehicleSection';
import { CommentSection } from './MissionRequestForm/CommentSection';
import { AvailabilitySection } from './MissionRequestForm/AvailabilitySection';
import { FormActions } from './MissionRequestForm/FormActions';
import { useQuery } from '@apollo/client/react';
import SideBarAgent from '../agent-component/SideBarAgent';
import ProfileHeaderAgent from '../agent-component/ProfieHeaderAgent';

interface MissionRequestFormProps {
  initialData?: Partial<MissionFormData>;
  onSubmit: (data: MissionFormData, files: FileUpload[]) => Promise<void>;
  onCancel?: () => void;
}
interface PartenaireMissionHeaderData {
  partenaireMissionHeader: {
    entite: string;
    adresse: string | null;
    ville: string | null;
  };
}

export const MissionRequestForm: React.FC<MissionRequestFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // ✅ Récupération des données partenaire via GraphQL
  

  const [formData, setFormData] = useState<MissionFormData>({
    entite: '',
    adresseEntite: '',

    nomContactDepart: '',
    telephoneContactDepart: '',
    nomContactArrivee: '',
    telephoneContactArrivee: '',

    typeVehicule: '',
    typeCarburant: '',
    marqueModele: '',
    immatriculation: '',
    nombrePlaces: '',
    boiteVitesse: '',
    commentaire: '',

    villeDepart: '',
    adresseDepartComplete: '',
    typeLieuDepart: 'AUTRE',
    villeArrivee: '',
    adresseArriveeComplete: '',
    typeLieuArrivee: 'AUTRE',

    notifierDepart: false,
    notifierArrivee: false,

    ...initialData,
  });

  const [inputValueDepart, setInputValueDepart] = useState('');
  const [inputValueArrivee, setInputValueArrivee] = useState('');
  const [selectedCityDepart, setSelectedCityDepart] = useState<any>(null);
  const [selectedCityArrivee, setSelectedCityArrivee] = useState<any>(null);

  const [departureNotify, setDepartureNotify] = useState(false);
  const [arrivalNotify, setArrivalNotify] = useState(false);

  const [files, setFiles] = useState<FileUpload[]>([]);

  const [selectedDate1, setSelectedDate1] = useState('');
  const [selectedTime1, setSelectedTime1] = useState('');
  const [selectedDate2, setSelectedDate2] = useState('');
  const [selectedTime2, setSelectedTime2] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen((prev) => !prev);

  // ✅ Remplir entite et adresseEntite dès que les données sont disponibles
 
  useEffect(() => {
    console.log('📊 FormData mis à jour:', {
      villeDepart: formData.villeDepart,
      villeArrivee: formData.villeArrivee,
      adresseDepartComplete: formData.adresseDepartComplete,
      adresseArriveeComplete: formData.adresseArriveeComplete,
    });
  }, [formData.villeDepart, formData.villeArrivee]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCitySelectDepart = (city: any) => {
    setSelectedCityDepart(city);

    if (!city) {
      setFormData((prev) => ({
        ...prev,
        villeDepart: '',
      }));
      return;
    }

    const villeNom =
      city?.nom || city?.ville || city?.name || city?.city || '';

    setFormData((prev) => ({
      ...prev,
      villeDepart: villeNom,
    }));
  };

  const handleCitySelectArrivee = (city: any) => {
    setSelectedCityArrivee(city);

    if (!city) {
      setFormData((prev) => ({
        ...prev,
        villeArrivee: '',
      }));
      return;
    }

    const villeNom =
      city?.nom || city?.ville || city?.name || city?.city || '';

    setFormData((prev) => ({
      ...prev,
      villeArrivee: villeNom,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Le fichier est trop volumineux (max 10 Mo)');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Format non autorisé (PDF, JPG, PNG uniquement)');
      return;
    }

    if (files.length >= 3) {
      alert('Maximum 3 fichiers autorisés');
      return;
    }

    setFiles((prev) => [
      ...prev,
      {
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      },
    ]);

    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!selectedDate1 || !selectedTime1) {
      setDateError("Veuillez sélectionner la date et l'heure de départ");
      return false;
    }

    if (!selectedDate2 || !selectedTime2) {
      setDateError("Veuillez sélectionner la date et l'heure d'arrivée");
      return false;
    }

    const date1 = new Date(selectedDate1 + 'T' + selectedTime1 + ':00');
    const date2 = new Date(selectedDate2 + 'T' + selectedTime2 + ':00');

    if (date2 <= date1) {
      setDateError('La date de livraison doit être après la date de départ');
      return false;
    }

    if (!selectedCityDepart || !formData.villeDepart) {
      alert('Veuillez sélectionner une ville de départ');
      return false;
    }

    if (!selectedCityArrivee || !formData.villeArrivee) {
      alert("Veuillez sélectionner une ville d'arrivée");
      return false;
    }

    if (!formData.typeVehicule) {
      alert('Veuillez sélectionner le type de véhicule');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const dateDebutISO = new Date(
      `${selectedDate1}T${selectedTime1}:00`
    ).toISOString();
    const dateFinISO = new Date(
      `${selectedDate2}T${selectedTime2}:00`
    ).toISOString();

    const payload: MissionFormData = {
      ...formData,
      dateDebut: dateDebutISO,
      dateFin: dateFinISO,
      nombrePlaces:
        typeof formData.nombrePlaces === 'string'
          ? parseInt(formData.nombrePlaces, 10)
          : formData.nombrePlaces,
      typeVehicule: formData.typeVehicule.toUpperCase() as VehicleType,
      typeCarburant: formData.typeCarburant.toUpperCase() as VehiculeCarburant,
      boiteVitesse: formData.boiteVitesse.toUpperCase(),
      immatriculation: formData.immatriculation.toUpperCase(),
      typeLieuDepart: formData.typeLieuDepart || 'AUTRE',
      typeLieuArrivee: formData.typeLieuArrivee || 'AUTRE',
    };

    console.log('📦 Payload envoyé à onSubmit:', payload);

    setIsSubmitting(true);
    try {
      await onSubmit(payload, files);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else window.history.back();
  };


  return (
    <div className="min-h-screen bg-black">
         

<div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 pt-2 md:pt-4 my-0">
            <FormHeader />


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
          nomContact={formData.nomContactDepart || ''}
          telephoneContact={formData.telephoneContactDepart || ''}
          onNomContactChange={(value) =>
            setFormData((prev) => ({ ...prev, nomContactDepart: value }))
          }
          onTelephoneContactChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              telephoneContactDepart: value,
            }))
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
          nomContact={formData.nomContactArrivee || ''}
          telephoneContact={formData.telephoneContactArrivee || ''}
          onNomContactChange={(value) =>
            setFormData((prev) => ({ ...prev, nomContactArrivee: value }))
          }
          onTelephoneContactChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              telephoneContactArrivee: value,
            }))
          }
        />

        <DocumentUpload
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
        />

        <VehicleSection formData={formData} onChange={handleInputChange} />

        <CommentSection
          value={formData.commentaire || ''}
          onChange={handleInputChange}
        />

        <AvailabilitySection
          selectedDate1={selectedDate1}
          selectedTime1={selectedTime1}
          selectedDate2={selectedDate2}
          selectedTime2={selectedTime2}
          onDate1Change={setSelectedDate1}
          onTime1Change={setSelectedTime1}
          onDate2Change={setSelectedDate2}
          onTime2Change={setSelectedTime2}
          dateError={dateError}
          onDateErrorChange={setDateError}
        />

        <FormActions
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default MissionRequestForm;
