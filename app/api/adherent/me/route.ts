// app/api/adherent/me/route.ts
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET(req: Request) {
  console.log("🔵 /api/adherent/me appelé");
  
  try {
    const query = `
      query {
        adherentMe {
          nom
          prenom
          email
          photo
          typePack
        }
      }
    `;

    console.log("📤 Envoi vers /api/graphql...");
    console.log("🍪 Cookie header:", req.headers.get("cookie"));

    const resp = await fetch(`${BASE_URL}/api/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    console.log("📥 Response graphql status:", resp.status);

    const json = await resp.json().catch(() => ({}));
    console.log("📥 Response graphql data:", json);

    if (!resp.ok || json?.errors?.length) {
      console.error("❌ Erreur GraphQL:", json?.errors?.[0]?.message);
      return NextResponse.json(
        { message: json?.errors?.[0]?.message ?? "Erreur serveur" },
        { status: resp.status || 500 }
      );
    }

    console.log("✅ Retour de adherentMe:", json.data.adherentMe);
    return NextResponse.json(json.data.adherentMe, { status: 200 });
  } catch (error: any) {
    console.error("❌ Exception dans /api/adherent/me:", error);
    return NextResponse.json(
      { message: error?.message ?? "Erreur interne" },
      { status: 500 }
    );
  }
}
