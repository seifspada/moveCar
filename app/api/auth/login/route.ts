// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { backendApi } from '@/lib/axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📧 Login attempt:", body.email);

    const { data } = await backendApi.post('/auth/login', body);

    console.log("📦 Backend response:", JSON.stringify(data, null, 2));

    // Extraire le rôle
    let userRole: string | undefined;

    if (data.user?.role) {
      if (typeof data.user.role === 'object' && data.user.role.name) {
        userRole = data.user.role.name;
      } else if (typeof data.user.role === 'string') {
        userRole = data.user.role;
      }
    }

    console.log("🎭 Extracted role:", userRole);

    if (!userRole) {
      return NextResponse.json(
        { message: "Rôle utilisateur introuvable" },
        { status: 500 }
      );
    }

    // ✅ CRÉER LA RÉPONSE AVEC NEXTRESPONSE
    const response = NextResponse.json({
      access_token: data.accessToken,
      role: userRole,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: userRole
      }
    });

    // ✅ DÉFINIR LE COOKIE ROLE
    response.cookies.set('role', userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // ✅ Changé de 'strict' à 'lax'
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // ✅ DÉFINIR LE COOKIE TOKEN
    if (data.accessToken) {
      response.cookies.set('token', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    console.log("✅ Cookies set - role:", userRole);
    console.log("✅ Response headers:", response.headers.get('set-cookie'));

    return response;

  } catch (error: any) {
    console.error('❌ Login error:', error);

    if (error.response) {
      return NextResponse.json(
        { 
          message: error.response.data.message || 'Erreur de connexion'
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { message: 'Impossible de contacter le serveur' },
      { status: 500 }
    );
  }
}
