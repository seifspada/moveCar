'use client';

import { useState } from 'react';
import {
  toggleAgence,
  deleteAgence,
  changeAgent,
  resendInvitation,
} from '@/app/utils/agenceApi';
import { Agent } from '@/app/types/agences';

export function useAgenceActions(onSuccess: () => void) {
  const [actionLoading, setActionLoading] = useState<string | null>(null); // ✅ renommé
  const [message, setMessage]             = useState<{                     // ✅ ajouté
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = async (id: number, isActive: boolean) => {          // ✅ isActive ajouté
    setActionLoading('toggle');
    try {
      await toggleAgence(id);
      showMessage('success', isActive ? 'Agence désactivée' : 'Agence activée');
      onSuccess();
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number, onClose: () => void) => {        // ✅ onClose ajouté
    setActionLoading('delete');
    try {
      await deleteAgence(id);
      showMessage('success', 'Agence supprimée');
      onSuccess();
      setTimeout(onClose, 1000);
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeAgent = async (id: number, newEmail: string) => {
    setActionLoading('changeAgent');
    try {
      await changeAgent(id, newEmail);
      showMessage('success', 'Agent changé avec succès');
      onSuccess();
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendEmail = async (                                         // ✅ renommé + setAgent
    id: number,
    agent: Agent,
    setAgent: (a: Agent) => void,
  ) => {
    setActionLoading('resend');
    try {
      await resendInvitation(id);
      setAgent({
        ...agent,
        profileTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
      showMessage('success', 'Nouveau lien généré et email envoyé avec succès');
    } catch (err: any) {
      showMessage('error', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return {
    actionLoading,   // ✅ au lieu de loadingId
    message,         // ✅ ajouté
    handleToggle,
    handleDelete,
    handleChangeAgent,
    handleResendEmail,  // ✅ au lieu de handleResendInvitation
  };
}
