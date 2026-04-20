// app/api/graphql/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_GRAPHQL_URL = process.env.BACKEND_GRAPHQL_URL || "http://localhost:3000/graphql";

// ✅ Queries publiques qui ne nécessitent pas de token
const PUBLIC_OPERATIONS = [
  'getMissionsForCardsByAgence',
  'missionsForCards',
  'searchMissions',
  'searchMissionsByPosition',
  'searchMissionsByTrajet',
  'GetMissionsForCardsByAgence', // variantes avec majuscule
];

function isPublicOperation(body: any): boolean {
  const query: string = body?.query || '';
  const operationName: string = body?.operationName || '';
  return PUBLIC_OPERATIONS.some(
    (op) => query.includes(op) || operationName.includes(op)
  );
}

export async function POST(req: NextRequest) {
  console.log("🟢 /api/graphql route appelée");

  try {
    const body = await req.json();
    console.log("📝 Query:", body.query?.substring(0, 100));

    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log("🔑 Token présent:", !!token);

    // ✅ Bloquer uniquement si pas de token ET opération privée
    if (!token && !isPublicOperation(body)) {
      console.warn("⚠️ Pas de token pour une opération privée");
      return NextResponse.json(
        { errors: [{ message: "Non autorisé", extensions: { code: "UNAUTHENTICATED" } }] },
        { status: 401 }
      );
    }

    console.log("📤 Envoi vers backend GraphQL...");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // ✅ Ajouter le token seulement s'il existe
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendResponse = await fetch(BACKEND_GRAPHQL_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    console.log("📥 Backend status:", backendResponse.status);

    const responseText = await backendResponse.text();
    console.log("📦 Backend response (raw):", responseText.substring(0, 200));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { errors: [{ message: "Le backend n'a pas retourné du JSON valide" }] },
        { status: 500 }
      );
    }

    if (data.errors) {
      console.error("❌ Erreurs GraphQL:", data.errors);
    } else {
      console.log("✅ Data reçue:", Object.keys(data.data || {}));
    }

    return NextResponse.json(data, { status: backendResponse.status });

  } catch (e: any) {
    console.error("❌ Exception:", e.message);

    if (e.message?.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { errors: [{ message: "Backend inaccessible", extensions: { code: "NETWORK_ERROR" } }] },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { errors: [{ message: e.message || "Erreur interne" }] },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "GraphQL endpoint. Use POST.", status: "ready" },
    { status: 200 }
  );
}