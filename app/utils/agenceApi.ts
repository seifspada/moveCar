import { Agence, Agent } from '@/app/types/agences';

// ✅ GET — liste des agences
export async function fetchAgences(): Promise<Agence[]> {
  const res = await fetch('/api/partenaire/agencies');  // ✅ bon chemin
  if (!res.ok) throw new Error('Erreur chargement agences');
  return res.json();
}

// ✅ POST — créer une agence
export async function createAgence(dto: Partial<Agence>): Promise<Agence> {
  const res = await fetch('/api/partenaire/agencies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Erreur création agence');
  return res.json();
}

export async function updateAgence(id: number, dto: Partial<Agence>): Promise<Agence> {
  const res = await fetch(`/api/partenaire/agencies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Erreur mise à jour agence');
  return res.json();
}

export async function deleteAgence(id: number): Promise<Agence> {
  const res = await fetch(`/api/partenaire/agencies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur suppression agence');
  return res.json();
}

export async function toggleAgence(id: number): Promise<Agence> {
  const res = await fetch(`/api/partenaire/agencies/agence-toggle/${id}`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Erreur toggle agence');
  return res.json();
}

export async function changeAgent(id: number, newEmail: string): Promise<void> {
  const res = await fetch(`/api/partenaire/agencies/change-agent/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newEmail }),
  });
  if (!res.ok) throw new Error('Erreur changement agent');
}

export async function resendInvitation(id: number): Promise<{ message: string }> {
  const res = await fetch(`/api/partenaire/agencies/resend-invitation/${id}`, { method: 'POST' });
  if (!res.ok) throw new Error('Erreur renvoi invitation');
  return res.json();
}


export async function fetchAgentByAgence(agenceId: number): Promise<Agent | null> {
  const res = await fetch(`/api/partenaire/agencies/${agenceId}/agent`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Erreur chargement agent');
  return res.json();
}

