// app/api/adherent/demande-adherent/[id]/documents/[documentId]/dates/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_BAC_URL || 'http://localhost:3000';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const { id, documentId } = await params;
    const body = await req.json();

    console.log(
      '🔵 [PATCH document dates] demandeId:', id,
      '| documentId:', documentId,
      '| body:', body,
    );

    // ✅ demandes-adherents (respecte ton @Controller)
    const res = await fetch(
      `${BACKEND}/demandes-adherents/${id}/documents/${documentId}/dates`,
      {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: req.headers.get('cookie') ?? '',
        },
        body: JSON.stringify(body),
      },
    );

    const data = await res.json();
    console.log('🔵 [PATCH document dates] backend status:', res.status);

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || `Erreur ${res.status}` },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.log('🔴 [PATCH document dates] catch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}