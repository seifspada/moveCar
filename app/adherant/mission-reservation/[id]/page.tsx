'use client';

import { useRouter, useParams } from 'next/navigation';
import { missionsData } from '@/app/data/missions';
import MissionDetails from '@/components/mission-components/MissionDetails';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
export default function Page() {
  const router = useRouter();
  const params = useParams();          // 👈 correct
  const missionId = Number(params.id); // 👈 correct

  const mission = missionsData.find(m => m.id === missionId);

  if (!mission) return <p>Mission introuvable</p>;

  return (
<div className="min-h-screen bg-black">
      {/* Header en plein largeur - reste en haut */}
      <ProfileHeader />
          
    <MissionDetails
      mission={mission}
      onBack={() => router.back()}
      onReserve={() => alert('Réserver')}
    />
    </div>
  );
}
