import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:300';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = req.headers.get('authorization');
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ message: data?.message ?? 'Rôle introuvable' }, { status: res.status });
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Impossible de contacter le serveur' }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = req.headers.get('authorization');
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ message: data?.message ?? 'Erreur mise à jour' }, { status: res.status });
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Impossible de contacter le serveur' }, { status: 502 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const token = req.headers.get('authorization');
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ message: data?.message ?? 'Erreur suppression' }, { status: res.status });
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Impossible de contacter le serveur' }, { status: 502 });
  }
}