import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const { searchParams } = new URL(req.url);
    const statut = searchParams.get('statut');

    const url = new URL(`${BACKEND}/demandes-partenaire/rendezvous`);
    if (statut) url.searchParams.set('statut', statut);

    console.log('🔵 Fetching:', url.toString());

    const res = await fetch(url.toString(), {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const text = await res.text();
    console.log('🔵 Status:', res.status);
    console.log('🔵 Body:', text.slice(0, 300));

    if (!res.ok) {
      return NextResponse.json({ error: `Erreur ${res.status}` }, { status: res.status });
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    console.error('❌ Route rendezvous error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}