// app/hooks/useDemande.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export type TypeDemande = 'adherent' | 'partenaire';

export type StatutDemande =
  | 'EN_ATTENTE'
  | 'EN_COURS_TRAITEMENT'
  | 'ACCEPTEE'
  | 'REFUSEE';

export interface Demande {
  id: string;
  realId: number;
  email: string;
  message: string;
  type: TypeDemande;
  statut: StatutDemande;
  receivedAt: Date;
}

export function useDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [connected, setConnected] = useState(false);

  const addDemande = useCallback((
    email: string,
    type: TypeDemande,
    message: string,
    id?: string,
    receivedAt?: Date,
    realId?: number,
    statut: StatutDemande = 'EN_ATTENTE',
  ) => {
    const newDemande: Demande = {
      id: id ?? `${Date.now()}-${Math.random()}`,
      realId: realId ?? 0,
      email,
      message,
      type,
      statut,
      receivedAt: receivedAt ?? new Date(),
    };

    setDemandes((prev) => {
      if (prev.some((d) => d.id === newDemande.id)) return prev;
      return [newDemande, ...prev];
    });
  }, []);

  const updateStatut = useCallback((
    realId: number,
    type: TypeDemande,
    statut: StatutDemande,
  ) => {
    setDemandes((prev) =>
      prev.map((d) =>
        d.realId === realId && d.type === type ? { ...d, statut } : d,
      ),
    );
  }, []);

  const clearAll = useCallback(() => setDemandes([]), []);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    console.log('🔌 Socket.IO BACKEND_URL:', backendUrl);

    if (!backendUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL is missing');
      setConnected(false);
      return;
    }

    const socket = io(backendUrl, {
      transports: ['polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      timeout: 20000,
    });

    const onConnect = () => {
      console.log('✅ Socket connecté:', socket.id);
      setConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.warn('❌ Socket déconnecté:', reason);
      setConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error('🚨 Socket connect_error:', err.message);
    };

    const onNewDemande = (data: {
      email: string;
      id?: number;
      nom?: string;
      prenom?: string;
      message?: string;
    }) => {
      addDemande(
        data.email,
        'adherent',
        data.message ?? `Demande de ${data.nom ?? ''} ${data.prenom ?? ''}`.trim(),
        undefined,
        undefined,
        data.id,
        'EN_ATTENTE',
      );
    };

    const onDemandeStatutChange = (data: {
      id: number;
      statut: StatutDemande;
      type: string;
    }) => {
      if (data.type === 'adherent') {
        updateStatut(data.id, 'adherent', data.statut);
      }
    };

    const onHistoriqueDemandes = (data: {
      type: TypeDemande;
      demandes: { id: number; email: string; message: string; timestamp: string }[];
    }) => {
      if (data.type === 'adherent') {
        data.demandes.forEach((d) => {
          addDemande(
            d.email,
            'adherent',
            d.message,
            `hist-adherent-${d.id}`,
            new Date(d.timestamp),
            d.id,
            'EN_ATTENTE',
          );
        });
      }
    };

    const onNewDemandePartenaire = (data: {
      email: string;
      id?: number;
      nom?: string;
      entite?: string;
      message?: string;
    }) => {
      addDemande(
        data.email,
        'partenaire',
        data.message ?? `${data.nom ?? ''} — ${data.entite ?? ''}`.trim(),
        undefined,
        undefined,
        data.id,
        'EN_ATTENTE',
      );
    };

    const onDemandePartenaireStatutChange = (data: {
      id: number;
      statut: StatutDemande;
      type: string;
    }) => {
      if (data.type === 'partenaire') {
        updateStatut(data.id, 'partenaire', data.statut);
      }
    };

    const onHistoriqueDemandesPartenaire = (data: {
      type: TypeDemande;
      demandes: { id: number; email: string; message: string; timestamp: string }[];
    }) => {
      if (data.type === 'partenaire') {
        data.demandes.forEach((d) => {
          addDemande(
            d.email,
            'partenaire',
            d.message,
            `hist-partenaire-${d.id}`,
            new Date(d.timestamp),
            d.id,
            'EN_ATTENTE',
          );
        });
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('new-demande', onNewDemande);
    socket.on('demande-statut-change', onDemandeStatutChange);
    socket.on('historique-demandes', onHistoriqueDemandes);
    socket.on('new-demande-partenaire', onNewDemandePartenaire);
    socket.on('demande-partenaire-statut-change', onDemandePartenaireStatutChange);
    socket.on('historique-demandes-partenaire', onHistoriqueDemandesPartenaire);

    const keepAlive = setInterval(() => {
      if (socket.connected) {
        socket.emit('ping');
      }
    }, 25000);

    return () => {
      clearInterval(keepAlive);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('new-demande', onNewDemande);
      socket.off('demande-statut-change', onDemandeStatutChange);
      socket.off('historique-demandes', onHistoriqueDemandes);
      socket.off('new-demande-partenaire', onNewDemandePartenaire);
      socket.off('demande-partenaire-statut-change', onDemandePartenaireStatutChange);
      socket.off('historique-demandes-partenaire', onHistoriqueDemandesPartenaire);
      socket.disconnect();
    };
  }, [addDemande, updateStatut]);

  const demandesEnAttente = demandes.filter((d) => d.statut === 'EN_ATTENTE');
  const demandesEnCours = demandes.filter((d) => d.statut === 'EN_COURS_TRAITEMENT');
  const demandesAcceptees = demandes.filter((d) => d.statut === 'ACCEPTEE');
  const demandesRefusees = demandes.filter((d) => d.statut === 'REFUSEE');
  const demandesAdherent = demandes.filter((d) => d.type === 'adherent');
  const demandesPartenaire = demandes.filter((d) => d.type === 'partenaire');
  const partenairesEnAttente = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'EN_ATTENTE');
  const partenairesRdvConfirme = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'EN_COURS_TRAITEMENT');
  const partenairesAcceptes = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'ACCEPTEE');
  const partenairesRefuses = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'REFUSEE');

  const stats = {
    total: demandes.length,
    adherents: demandesAdherent.length,
    partenaires: demandesPartenaire.length,
    parStatut: {
      enAttente: demandesEnAttente.length,
      enCoursTraitement: demandesEnCours.length,
      acceptees: demandesAcceptees.length,
      refusees: demandesRefusees.length,
    },
  };

  return {
    demandes,
    demandesEnAttente,
    demandesEnCours,
    demandesAcceptees,
    demandesRefusees,
    demandesAdherent,
    demandesPartenaire,
    partenairesEnAttente,
    partenairesRdvConfirme,
    partenairesAcceptes,
    partenairesRefuses,
    connected,
    stats,
    clearAll,
  };
}