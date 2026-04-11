import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

function guardId(id: string) {
  return !id || id === 'undefined' || isNaN(Number(id));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
  const { id } = await params;  // ✅ await
  if (guardId(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const res = await fetch(`${BACKEND}/demandes-partenaire/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const responseText = await res.text();
    if (!res.ok) return NextResponse.json({ error: `Erreur ${res.status}` }, { status: res.status });
    return NextResponse.json(JSON.parse(responseText));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
  const { id } = await params;  // ✅ await
  if (guardId(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }
  try {
    const token  = req.headers.get('authorization')?.replace('Bearer ', '');
    const body   = await req.json();
    const action = body.action;

    if (!action || !['confirmer', 'refuser', 'reporter'].includes(action)) {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }

    const endpoints: Record<string, string> = {
      confirmer: `${BACKEND}/demandes-partenaire/${id}/confirmer-rdv`,
      refuser:   `${BACKEND}/demandes-partenaire/${id}/refuser`,
      reporter:  `${BACKEND}/demandes-partenaire/${id}/reporter`,
    };

    const { action: _, ...bodyWithoutAction } = body;

    const res = await fetch(endpoints[action], {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyWithoutAction),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || `Erreur ${res.status}` }, { status: res.status });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST — Accepter la demande avec contrat PDF (multipart/form-data)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
  const { id } = await params;  // ✅ await
  if (guardId(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }
  try {
    const token    = req.headers.get('authorization')?.replace('Bearer ', '');
    const formData = await req.formData();

    const res = await fetch(
      `${BACKEND}/demandes-partenaire/${id}/accepter`,
      {
        method: 'PATCH',  // ✅ NestJS @Patch(':id/accepter')
        headers: {
          Authorization: `Bearer ${token}`,
          // ⚠️ Pas de Content-Type — fetch gère le boundary multipart
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || `Erreur ${res.status}` }, { status: res.status });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE — Supprimer la demande
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
  const { id } = await params;  // ✅ await
  if (guardId(id)) {
    return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
  }
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    const res = await fetch(
      `${BACKEND}/demandes-partenaire/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.message || `Erreur ${res.status}` }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: 'Demande supprimée' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}