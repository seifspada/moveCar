// app/api/graphql/route.ts
import { NextRequest, NextResponse } from "next/server";

// ✅ Utiliser vos variables d'environnement
const BACKEND_GRAPHQL_URL = process.env.BACKEND_GRAPHQL_URL || "http://localhost:3000/graphql";

export async function POST(req: NextRequest) {
  console.log("🟢 /api/graphql route appelée");
  console.log("🌐 Backend GraphQL URL:", BACKEND_GRAPHQL_URL);
  
  try {
    const body = await req.json();
    console.log("📝 Query:", body.query?.substring(0, 100));
    
    // ✅ Récupérer le token depuis Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log("🔑 Token présent:", !!token);
    if (token) {
      console.log("🔑 Token (20 premiers chars):", token.substring(0, 20) + "...");
    }

    if (!token) {
      console.warn("⚠️ Pas de token dans Authorization header");
      return NextResponse.json(
        { errors: [{ message: "Non autorisé", extensions: { code: "UNAUTHENTICATED" } }] },
        { status: 401 }
      );
    }

    console.log("📤 Envoi vers backend GraphQL...");

    // ✅ Appeler le backend NestJS GraphQL
    const backendResponse = await fetch(BACKEND_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    console.log("📥 Backend status:", backendResponse.status);
    console.log("📥 Backend statusText:", backendResponse.statusText);
    
    // ✅ Lire le body (même en cas d'erreur)
    const responseText = await backendResponse.text();
    console.log("📦 Backend response (raw):", responseText.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Erreur parsing JSON:", parseError);
      return NextResponse.json(
        { errors: [{ message: "Le backend n'a pas retourné du JSON valide", extensions: { code: "PARSE_ERROR" } }] },
        { status: 500 }
      );
    }
    
    // ✅ Log les erreurs GraphQL pour debug
    if (data.errors) {
      console.error("❌ Erreurs GraphQL du backend:");
      data.errors.forEach((error: any, index: number) => {
        console.error(`\n--- Erreur GraphQL ${index + 1} ---`);
        console.error("Message:", error.message);
        console.error("Extensions:", JSON.stringify(error.extensions, null, 2));
        console.error("Path:", error.path);
        console.error("Locations:", error.locations);
      });
    } else if (data.data) {
      console.log("✅ Data reçue avec succès:", Object.keys(data.data));
    }
    
    return NextResponse.json(data, { status: backendResponse.status });
    
  } catch (e: any) {
    console.error("❌ Exception /api/graphql:", e.message);
    console.error("❌ Stack:", e.stack);
    
    // ✅ Vérifier si c'est une erreur réseau
    if (e.message?.includes('fetch failed') || 
        e.message?.includes('ECONNREFUSED') || 
        e.cause?.code === 'ECONNREFUSED') {
      console.error("🔴 Backend GraphQL inaccessible! Vérifiez que NestJS est démarré sur le port 3000");
      return NextResponse.json(
        { errors: [{ 
          message: "Backend GraphQL inaccessible. Vérifiez que le serveur NestJS est démarré sur http://localhost:3000", 
          extensions: { code: "NETWORK_ERROR" } 
        }] }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { errors: [{ 
        message: e.message || "Erreur interne du proxy GraphQL", 
        extensions: { code: "INTERNAL_ERROR" } 
      }] }, 
      { status: 500 }
    );
  }
}

// Export GET pour éviter "Method not allowed"
export async function GET() {
  return NextResponse.json(
    { 
      message: "GraphQL endpoint. Use POST method.", 
      backendUrl: BACKEND_GRAPHQL_URL,
      status: "ready"
    }, 
    { status: 200 }
  );
}
