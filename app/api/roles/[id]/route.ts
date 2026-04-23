import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/roles/${id}`, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ message: 'Rôle non trouvé' }, { status: 404 });
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/roles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/roles/${id}`, { method: 'DELETE' });
    if (!res.ok) return NextResponse.json({ message: 'Erreur suppression' }, { status: res.status });
    return NextResponse.json({ message: 'Rôle supprimé' });
  } catch {
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}