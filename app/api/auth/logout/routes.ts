// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Supprimer les cookies
  response.cookies.delete('role');
  response.cookies.delete('token');
  
  return response;
}
