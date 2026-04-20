// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization');

  try {
    const res = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message ?? 'Erreur serveur' },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: 'Impossible de contacter le serveur' },
      { status: 502 },
    );
  }
}