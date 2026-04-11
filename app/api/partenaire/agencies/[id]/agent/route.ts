import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ✅
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

  const res = await fetch(`${API}/agencies/${id}/agent`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) return NextResponse.json(null, { status: 404 });
  if (!res.ok) return NextResponse.json({ message: 'Erreur serveur' }, { status: res.status });

  return NextResponse.json(await res.json());
}
