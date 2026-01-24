// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NEST_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { message: 'Email, code et nouveau mot de passe requis' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    console.log('📤 Réinitialisation mot de passe pour:', email);

    const response = await fetch(`${NEST_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, newPassword }),
    });

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
        { message: data.message || 'Erreur lors de la réinitialisation' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('❌ Erreur reset-password:', error);
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}