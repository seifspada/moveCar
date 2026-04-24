import { NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;
    const typeDocument = formData.get('typeDocument') as string | null;

    if (!file) {
      return NextResponse.json({ message: 'Fichier requis' }, { status: 400 });
    }

    if (!typeDocument) {
      return NextResponse.json({ message: 'typeDocument requis' }, { status: 400 });
    }

    // ✅ kbis supprimé
    const typesAcceptes = ['assuranceRcPro', 'assuranceRcCirculation'];
    if (!typesAcceptes.includes(typeDocument)) {
      return NextResponse.json(
        { message: `typeDocument invalide. Valeurs acceptées : ${typesAcceptes.join(', ')}` },
        { status: 400 },
      );
    }

    const backendForm = new FormData();
    backendForm.append('file', file);
    backendForm.append('typeDocument', typeDocument);

    const backendRes = await fetch(
      `${NEXT_PUBLIC_API_URL}/document-processing/extract-dates`,
      { method: 'POST', body: backendForm },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message ?? 'Erreur extraction dates' },
        { status: backendRes.status },
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (err: any) {
    console.error('[extract-date] Erreur :', err.message);
    return NextResponse.json({ message: 'Erreur serveur interne' }, { status: 500 });
  }
}
