// app/api/auth/verify-reset-code/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NEST_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email et code requis' },
        { status: 400 }
      );
    }

    console.log('📤 Vérification code pour:', email);
    console.log('🔗 URL Backend:', NEST_API_URL); // ✅ Debug

    const response = await fetch(`${NEST_API_URL}/auth/verify-reset-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    console.log('📡 Status:', response.status); // ✅ Debug
    console.log('📡 Headers:', response.headers.get('content-type')); // ✅ Debug

    const contentType = response.headers.get('content-type');
    
    // ✅ Lire le corps de la réponse une seule fois
    const text = await response.text();
    console.log('📦 Réponse brute:', text.substring(0, 500)); // ✅ Debug

    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ Réponse non-JSON:', text.substring(0, 200));
      return NextResponse.json(
        { message: 'Erreur serveur: réponse invalide du backend' },
        { status: 502 }
      );
    }

    // ✅ Parser le JSON depuis le texte
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      console.error('❌ Texte reçu:', text);
      return NextResponse.json(
        { message: 'Erreur serveur: impossible de parser la réponse' },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Code invalide ou expiré' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('❌ Erreur verify-reset-code:', error);
    
    // ✅ Erreur de connexion réseau
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { message: 'Impossible de contacter le serveur backend' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: 'Erreur serveur: ' + error.message },
      { status: 500 }
    );
  }
}
