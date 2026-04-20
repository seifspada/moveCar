// app/api/adherent/demande-adherent/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = req.headers.get('authorization');

  try {
    console.log('🔵 [GET demande-adherent] id:', id);
    console.log('🔵 [GET demande-adherent] backend url:', `${BACKEND}/demandes-adherents/${id}`);

    const res = await fetch(`${BACKEND}/demandes-adherents/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
    });

    const responseText = await res.text();

    console.log('🔵 [GET demande-adherent] backend status:', res.status);
    console.log('🔵 [GET demande-adherent] backend response:', responseText);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Erreur ${res.status}` },
        { status: res.status },
      );
    }

    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    console.log('🔴 [GET demande-adherent] catch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = req.headers.get('authorization');

  try {
    const body = await req.json();
    const { action, ...bodyWithoutAction } = body;

    if (!action || !['confirmer', 'refuser'].includes(action)) {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }

    const endpoint =
      action === 'confirmer'
        ? `${BACKEND}/demandes-adherents/${id}/accepter`
        : `${BACKEND}/demandes-adherents/${id}/refuser`;

    console.log('🔵 [PATCH demande-adherent] action:', action);
    console.log('🔵 [PATCH demande-adherent] endpoint:', endpoint);

    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(bodyWithoutAction),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || `Erreur ${res.status}` },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.log('🔴 [PATCH demande-adherent] catch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}