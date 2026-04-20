// app/api/adherent/inscription-formulaire/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization');

  try {
    // FormData (multipart) — on forward directement sans parser
    const formData = await req.formData();

    const res = await fetch(`${BACKEND}/demandes-adherents`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: token } : {}),
        // ⚠️ Ne pas mettre Content-Type — fetch le génère automatiquement pour FormData
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message ?? 'Erreur serveur' },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Impossible de contacter le serveur' },
      { status: 502 },
    );
  }
}