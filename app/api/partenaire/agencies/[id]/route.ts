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

  const res = await fetch(`${API}/agencies/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ✅
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

  const body = await req.json();
  const res = await fetch(`${API}/agencies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  // ✅
  const token = (await cookies()).get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });

  const res = await fetch(`${API}/agencies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
