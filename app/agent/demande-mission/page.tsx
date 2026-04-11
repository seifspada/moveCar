'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MissionRequestForm from '@/components/partenaire-components/MissionRequestForm';
import { MissionFormData, FileUpload, MissionData } from '@/app/types/mission';
import MissionSuccess from '@/components/partenaire-components/MissionSuccessModal';

interface CreatedMission extends MissionData {}

export default function Page() {
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdMission, setCreatedMission] = useState<CreatedMission | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [agentId, setAgentId] = useState<number | null>(null);
  const [formKey, setFormKey] = useState(0); // pour reset le formulaire

useEffect(() => {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!raw) { router.push('/login'); return; }

  try {
    const user = JSON.parse(raw);
    
    // 🔍 DEBUG - à supprimer après
    console.log('👤 USER COMPLET DANS STORAGE:', JSON.stringify(user, null, 2));
    console.log('👤 user.id:', user.id);
    console.log('👤 user.agentId:', user.agentId);
    console.log('👤 user.agenceId:', user.agenceId);

    const resolvedAgentId = user.agentId ?? null;

    if (!resolvedAgentId) {
      alert('Session invalide : agentId manquant. Veuillez vous reconnecter.');
      router.push('/login');
      return;
    }

    setAgentId(resolvedAgentId);
    console.log('✅ agentId utilisé:', resolvedAgentId); // doit être 30

  } catch (e) {
    console.error('❌ Erreur parsing user:', e);
    router.push('/login');
  }
}, []);

 const handleSubmit = async (data: MissionFormData, uploadFiles: FileUpload[]) => {
  try {
    console.log('📤 Envoi de la mission...');
    console.log('🔍 FormData complet:', data);
    console.log('🔍 agentId:', agentId);

    if (!agentId) {
      alert('❌ Erreur: Aucun agent connecté. Veuillez vous reconnecter.');
      return;
    }

    if (!data.villeDepart) {
      alert('⚠️ Veuillez sélectionner une ville de départ');
      return;
    }

    if (!data.villeArrivee) {
      alert("⚠️ Veuillez sélectionner une ville d'arrivée");
      return;
    }

    if (!data.dateDebut || !data.dateFin) {
      alert('⚠️ Dates de disponibilité manquantes (dateDebut/dateFin).');
      console.error('❌ dateDebut/dateFin manquantes dans data:', {
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
      });
      return;
    }

    const payload = {
      agentId,

      villeDepart: data.villeDepart,
      adresseDepartComplete: data.adresseDepartComplete || data.villeDepart,
      typeLieuDepart: data.typeLieuDepart || 'AUTRE',
      nomLieuDepart: data.nomLieuDepart || undefined,

      villeArrivee: data.villeArrivee,
      adresseArriveeComplete: data.adresseArriveeComplete || data.villeArrivee,
      typeLieuArrivee: data.typeLieuArrivee || 'AUTRE',
      nomLieuArrivee: data.nomLieuArrivee || undefined,

      typeVehicule: data.typeVehicule,
      typeCarburant: data.typeCarburant,
      marqueModele: data.marqueModele,
      immatriculation: data.immatriculation,
      nombrePlaces:
        typeof data.nombrePlaces === 'string'
          ? parseInt(data.nombrePlaces, 10)
          : data.nombrePlaces,
      boiteVitesse: data.boiteVitesse,

      dateDebut: data.dateDebut,
      dateFin: data.dateFin,

      notifierDepart: !!data.nomContactDepart && !!data.telephoneContactDepart,
      nomContactDepart: data.nomContactDepart || undefined,
      telephoneContactDepart: data.telephoneContactDepart || undefined,

      notifierArrivee: !!data.nomContactArrivee && !!data.telephoneContactArrivee,
      nomContactArrivee: data.nomContactArrivee || undefined,
      telephoneContactArrivee: data.telephoneContactArrivee || undefined,

      commentaire: data.commentaire || undefined,
    };

    console.log('📦 Payload final:', payload);

    // ✅ Récupérer le token JWT stocké lors du login
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('/api/mission/creationMission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Envoyer le token pour que NestJS JwtAuthGuard l'accepte
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `Erreur HTTP ${response.status}`,
      }));

      console.error('❌ Erreur API:', error);

      let errorMessage = 'Une erreur est survenue lors de la création de la mission';

      if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
      }

      alert('❌ ' + errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Mission créée:', result);

    if (result.data) {
      setCreatedMission(result.data);
      setFiles(uploadFiles.map((f) => f.file));
      setShowSuccessModal(true);
    } else {
      router.push('/agent/missions');
    }

  } catch (error: any) {
    console.error('💥 Erreur handleSubmit:', error);

    if (error.name === 'AbortError') {
      alert("⏱️ Délai d'attente dépassé. Le serveur met trop de temps à répondre.");
    } else if (!navigator.onLine) {
      alert('📡 Pas de connexion internet. Vérifiez votre connexion.');
    } else if (error.message) {
      console.error('Message déjà affiché:', error.message);
    } else {
      alert('❌ Une erreur inattendue est survenue. Veuillez réessayer.');
    }

    throw error;
  }
};
  const handleCancel = () => {
    router.back();
  };

  const handleNewMission = () => {
    // fermer le récap + vider les données + reset du formulaire
    setShowSuccessModal(false);
    setCreatedMission(null);
    setFiles([]);
    setFormKey((prev) => prev + 1); // force un remount du formulaire -> tous les champs vidés
  };

  const handleGoToMissions = () => {
    setShowSuccessModal(false);
    router.push('/agent/acceuil');
  };

  if (agentId === null) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 pt-15 md:pt-20 my-10">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Formulaire caché en impression */}
      <div className="print:hidden bg-black" key={formKey}>
        <MissionRequestForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {showSuccessModal && createdMission && (
        <MissionSuccess
          mission={createdMission}
          files={files}
          onNewMission={handleNewMission}
          onGoToMissions={handleGoToMissions}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  );
}
