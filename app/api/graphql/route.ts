// app/api/graphql/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BACKEND_GRAPHQL_URL = `${API_URL}/graphql`;

export async function POST(req: Request) {
  console.log("🟢 /api/graphql route appelée");
  
  try {
    const body = await req.json();
    console.log("📝 Query reçue");
    
    // Récupérer le token depuis les cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    console.log("🍪 Token présent:", token ? "OUI" : "NON");

    // Construire l'Authorization header
    const authorization = token 
      ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`)
      : undefined;

    console.log("📤 Envoi vers backend:", BACKEND_GRAPHQL_URL);

    // Appeler le backend NestJS GraphQL
    const backendResponse = await fetch(BACKEND_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ Majuscule pour Content-Type
        ...(authorization ? { Authorization: authorization } : {}), // ✅ Majuscule pour Authorization
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    console.log("📥 Backend status:", backendResponse.status);
    
    // ✅ Vérifier si la réponse est ok avant de parser
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("❌ Erreur backend:", errorText);
    }
    
    const data = await backendResponse.json().catch(() => ({ 
      errors: [{ message: "Erreur de parsing JSON" }] 
    }));
    
    console.log("📥 Backend data:", JSON.stringify(data).substring(0, 200));
    
    // ✅ Retourner avec le status du backend
    return NextResponse.json(data, { status: backendResponse.status });
    
  } catch (e: any) {
    console.error("❌ Erreur /api/graphql:", e.message);
    console.error("❌ Stack:", e.stack);
    return NextResponse.json(
      { errors: [{ message: e.message }] }, 
      { status: 500 }
    );
  }
}

// Export GET pour éviter "Method not allowed"
export async function GET() {
  return NextResponse.json(
    { message: "Use POST /api/graphql" }, 
    { status: 405 }
  );
}
