'use client';

import { Building2, User, Phone, Mail, Briefcase } from 'lucide-react';
import { Section } from './Section';
import { InfoRow } from './InfoRow';
import { DemandePartenaire } from '@/app/types/partenaire';

interface Props {
  demande: DemandePartenaire;
}

export function InfoContact({ demande }: Props) {
  return (
    <Section title="Informations contact" accent="orange">
      <InfoRow icon={User}      label="Nom complet" value={demande.nom} />
      <InfoRow icon={Building2} label="Entité"      value={demande.entite} />
      <InfoRow icon={Briefcase} label="Statut"      value={demande.statut} />
      <InfoRow icon={Mail}      label="Email"       value={demande.email} />
      <InfoRow icon={Phone}     label="Téléphone"   value={demande.telephone} />
    </Section>
  );
}