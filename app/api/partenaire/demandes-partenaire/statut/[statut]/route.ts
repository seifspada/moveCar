// app/api/partenaire/demandes-partenaire/statut/[statut]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export async function GET(
  req: NextRequest,
  { params }: { params: { statut: string } }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    const res = await fetch(
      `${BACKEND}/demandes-partenaire/statut/${params.statut}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: `Erreur ${res.status}` }, { status: res.status });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}