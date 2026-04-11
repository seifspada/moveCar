'use client';

import { Car, Users, Hash, FileText } from 'lucide-react';
import { Section } from './Section';
import { InfoRow } from './InfoRow';
import { DemandePartenaire } from '@/app/types/partenaire';

interface Props {
  demande: DemandePartenaire;
}

export function InfoActivite({ demande }: Props) {
  return (
    <Section title="Activité" accent="blue">
      <InfoRow icon={Car}      label="Déplacements / mois" value={demande.nombreDeplacements} />
      <InfoRow icon={Users}    label="Nombre d'agences"    value={demande.nombreAgences} />
      {demande.codePartenaire && (
        <InfoRow icon={Hash}     label="Code partenaire"   value={demande.codePartenaire} />
      )}
      {demande.notesInternes && (
        <InfoRow icon={FileText} label="Notes internes"    value={demande.notesInternes} />
      )}
    </Section>
  );
}