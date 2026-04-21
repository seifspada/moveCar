// app/hooks/useDemande.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

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
  const [socket, setSocket] = useState<Socket | null>(null);

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

  useEffect(() => {
    // ── DEBUG : affiche l'URL utilisée dans F12 Console ──
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    console.log('🔌 Socket.IO BACKEND_URL:', backendUrl);

    const s = io(backendUrl, {
      transports: ['websocket', 'polling'], // websocket en priorité
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    s.on('connect',    () => {
      console.log('✅ Socket connecté:', s.id);
      setConnected(true);
    });
    s.on('disconnect', (reason) => {
      console.warn('❌ Socket déconnecté:', reason);
      setConnected(false);
    });
    s.on('connect_error', (err) => {
      console.error('🚨 Socket connect_error:', err.message);
    });

    // ── ADHÉRENT ──
    s.on('new-demande', (data: {
      email: string; id?: number; nom?: string; prenom?: string; message?: string;
    }) => {
      addDemande(
        data.email, 'adherent',
        data.message ?? `Demande de ${data.nom ?? ''} ${data.prenom ?? ''}`.trim(),
        undefined, undefined, data.id, 'EN_ATTENTE',
      );
    });

    s.on('demande-statut-change', (data: {
      id: number; statut: StatutDemande; type: string;
    }) => {
      if (data.type === 'adherent') updateStatut(data.id, 'adherent', data.statut);
    });

    s.on('historique-demandes', (data: {
      type: TypeDemande;
      demandes: { id: number; email: string; message: string; timestamp: string }[];
    }) => {
      if (data.type === 'adherent') {
        data.demandes.forEach((d) =>
          addDemande(d.email, 'adherent', d.message,
            `hist-adherent-${d.id}`, new Date(d.timestamp), d.id, 'EN_ATTENTE'),
        );
      }
    });

    // ── PARTENAIRE ──
    s.on('new-demande-partenaire', (data: {
      email: string; id?: number; nom?: string; entite?: string; message?: string;
    }) => {
      addDemande(
        data.email, 'partenaire',
        data.message ?? `${data.nom ?? ''} — ${data.entite ?? ''}`.trim(),
        undefined, undefined, data.id, 'EN_ATTENTE',
      );
    });

    s.on('demande-partenaire-statut-change', (data: {
      id: number; statut: StatutDemande; type: string;
    }) => {
      if (data.type === 'partenaire') updateStatut(data.id, 'partenaire', data.statut);
    });

    s.on('historique-demandes-partenaire', (data: {
      type: TypeDemande;
      demandes: { id: number; email: string; message: string; timestamp: string }[];
    }) => {
      if (data.type === 'partenaire') {
        data.demandes.forEach((d) =>
          addDemande(d.email, 'partenaire', d.message,
            `hist-partenaire-${d.id}`, new Date(d.timestamp), d.id, 'EN_ATTENTE'),
        );
      }
    });

    setSocket(s);
    return () => { s.disconnect(); };
  }, [addDemande, updateStatut]);

  const clearAll = useCallback(() => setDemandes([]), []);

  const demandesEnAttente      = demandes.filter((d) => d.statut === 'EN_ATTENTE');
  const demandesEnCours        = demandes.filter((d) => d.statut === 'EN_COURS_TRAITEMENT');
  const demandesAcceptees      = demandes.filter((d) => d.statut === 'ACCEPTEE');
  const demandesRefusees       = demandes.filter((d) => d.statut === 'REFUSEE');
  const demandesAdherent       = demandes.filter((d) => d.type === 'adherent');
  const demandesPartenaire     = demandes.filter((d) => d.type === 'partenaire');
  const partenairesEnAttente   = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'EN_ATTENTE');
  const partenairesRdvConfirme = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'EN_COURS_TRAITEMENT');
  const partenairesAcceptes    = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'ACCEPTEE');
  const partenairesRefuses     = demandes.filter((d) => d.type === 'partenaire' && d.statut === 'REFUSEE');

  const stats = {
    total:       demandes.length,
    adherents:   demandesAdherent.length,
    partenaires: demandesPartenaire.length,
    parStatut: {
      enAttente:         demandesEnAttente.length,
      enCoursTraitement: demandesEnCours.length,
      acceptees:         demandesAcceptees.length,
      refusees:          demandesRefusees.length,
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