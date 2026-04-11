'use client';

import { useEffect, useState } from 'react';
import { Agent } from '@/app/types/agences';
import { fetchAgentByAgence } from '@/app/utils/agenceApi';

export function useAgenceAgent(agenceId: number | null, isOpen: boolean) {
  const [agent, setAgent]               = useState<Agent | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);

  useEffect(() => {
    if (!agenceId || !isOpen) return;
    setAgent(null);
    setLoadingAgent(true);

    fetchAgentByAgence(agenceId)
      .then(setAgent)
      .catch(() => setAgent(null))
      .finally(() => setLoadingAgent(false));
  }, [agenceId, isOpen]);

  return { agent, setAgent, loadingAgent };
}
