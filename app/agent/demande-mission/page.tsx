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
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    // ✅ Vérifier token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // ✅ Lire agentId directement (sauvegardé par le login fix)
    const agentIdRaw = localStorage.getItem('agentId');
    const resolvedAgentId = agentIdRaw ? Number(agentIdRaw) : null;

    console.log('🔑 agentId depuis localStorage:', resolvedAgentId);

    // ✅ Fallback — décoder le JWT si agentId absent
    if (!resolvedAgentId) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔑 JWT payload (fallback):', payload);

        const jwtAgentId = payload.agentId ? Number(payload.agentId) : null;

        if (!jwtAgentId) {
          console.error('❌ agentId introuvable dans localStorage ET dans le JWT');
          alert('Session invalide : agentId manquant. Veuillez vous reconnecter.');
          router.push('/auth/login');
          return;
        }

        // ✅ Sauvegarder pour les prochaines fois
        localStorage.setItem('agentId', String(jwtAgentId));
        setAgentId(jwtAgentId);
        console.log('✅ agentId récupéré depuis JWT (fallback):', jwtAgentId);
        return;
      } catch (e) {
        console.error('❌ Erreur décodage JWT:', e);
        router.push('/auth/login');
        return;
      }
    }

    setAgentId(resolvedAgentId);
    console.log('✅ agentId utilisé:', resolvedAgentId);
  }, []);

  const handleSubmit = async (data: MissionFormData, uploadFiles: FileUpload[]) => {
    try {
      console.log('📤 Envoi de la mission...');
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

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch('/api/mission/creationMission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

        const errorMessage =
          error.error ||
          (Array.isArray(error.message) ? error.message.join(', ') : error.message) ||
          'Une erreur est survenue lors de la création de la mission';

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
      }

      throw error;
    }
  };

  const handleCancel = () => router.back();

  const handleNewMission = () => {
    setShowSuccessModal(false);
    setCreatedMission(null);
    setFiles([]);
    setFormKey((prev) => prev + 1);
  };

  const handleGoToMissions = () => {
    setShowSuccessModal(false);
    router.push('/agent/acceuil');
  };

  if (agentId === null) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 pt-15 md:pt-20 my-10">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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