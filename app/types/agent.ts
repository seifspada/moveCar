export interface AgentNavbar {
  nom: string;
  prenom: string;
  email: string;
  photo: string | null;
}

export interface AgentNavbarData {
  agentMe: AgentNavbar | null;
}
