import { NextRequest, NextResponse } from 'next/server';

// ⚠️ This file exists for historical reasons. All exports have been moved to @/lib/api/partenaire-api.
// Keep this file with empty handlers to prevent Next.js routing errors.

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
}

