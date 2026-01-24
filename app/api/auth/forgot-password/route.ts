// app/api/auth/forget-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NEST_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation basique
    if (!email) {
      return NextResponse.json(
        { message: 'Email requis' },
        { status: 400 }
      );
    }

    console.log('📤 Envoi vers:', `${NEST_API_URL}/auth/forget-password`);
    console.log('📧 Email:', email);

    // Appel à votre API NestJS
    const response = await fetch(`${NEST_API_URL}/auth/forget-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('📥 Status reçu:', response.status);
    console.log('📥 Content-Type:', response.headers.get('content-type'));

    // Vérifier si la réponse est bien du JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Réponse non-JSON:', text.substring(0, 200));
      return NextResponse.json(
        { message: 'Erreur serveur: réponse invalide du backend' },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Erreur lors de l\'envoi du code' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ Erreur forget-password:', error);
    return NextResponse.json(
      { message: 'Erreur serveur: ' + (error instanceof Error ? error.message : 'Inconnue') },
      { status: 500 }
    );
  }
}