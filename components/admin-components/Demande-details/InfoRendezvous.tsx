'use client';

import { Phone, MapPin, Video, Calendar, Clock, Hash } from 'lucide-react';
import { Section } from './Section';
import { InfoRow } from './InfoRow';
import { formatDate, RDV_CONFIG, Rendezvous } from '@/app/types/partenaire';

interface Props {
  rendezvous: Rendezvous;
}

const RDV_ICONS = {
  TELEPHONIQUE: Phone,
  PHYSIQUE:     MapPin,
  VISIO:        Video,
};

export function InfoRendezvous({ rendezvous }: Props) {
  const config  = RDV_CONFIG[rendezvous.typeRdv];
  const RdvIcon = RDV_ICONS[rendezvous.typeRdv] ?? Phone;

  return (
    <Section title="Rendez-vous" accent="violet">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <InfoRow icon={RdvIcon}   label="Type"       value={config?.label ?? rendezvous.typeRdv} className={config?.color} />
        <InfoRow icon={Calendar}  label="Date"       value={formatDate(rendezvous.dateRdv)} />
        <InfoRow icon={Clock}     label="Créneau"    value={rendezvous.creneau} />
        <InfoRow icon={Hash}      label="Statut RDV" value={rendezvous.statut} />
        {rendezvous.lienVisio && (
          <InfoRow icon={Video}   label="Lien visio" value={rendezvous.lienVisio} />
        )}
        {rendezvous.adresse && (
          <InfoRow icon={MapPin}  label="Adresse"    value={rendezvous.adresse} />
        )}
      </div>
    </Section>
  );
}