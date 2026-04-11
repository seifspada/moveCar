// app/api/adherent/demande-adherent/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    // 👇 log pour débugger
    console.log('🔵 [GET demande-adherent] id:', params.id);
    console.log('🔵 [GET demande-adherent] token:', token);
    console.log('🔵 [GET demande-adherent] backend url:', `${BACKEND}/demandes-adherents/${params.id}`);

    const res = await fetch(
      `${BACKEND}/demandes-adherents/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const responseText = await res.text();

    // 👇 log pour voir la réponse brute du backend
    console.log('🔵 [GET demande-adherent] backend status:', res.status);
    console.log('🔵 [GET demande-adherent] backend response:', responseText);

    if (!res.ok) {
      return NextResponse.json({ error: `Erreur ${res.status}` }, { status: res.status });
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.log('🔴 [GET demande-adherent] catch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const body = await req.json();

    const action = body.action;

    if (!action || !['confirmer', 'refuser'].includes(action)) {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }

    const endpoint =
      action === 'confirmer'
        ? `${BACKEND}/demandes-adherents/${params.id}/accepter`
        : `${BACKEND}/demandes-adherents/${params.id}/refuser`;

    const { action: _, ...bodyWithoutAction } = body;

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyWithoutAction),
    });

    const data = await res.json();
    if (!res.ok)
      return NextResponse.json(
        { error: data.message || `Erreur ${res.status}` },
        { status: res.status }
      );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}