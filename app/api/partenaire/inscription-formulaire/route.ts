// app/api/partenaire/inscription-formulaire/route.ts

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileToken = searchParams.get("profileToken");
    const codePartenaire = searchParams.get("code");

    if (!profileToken) {
      return NextResponse.json(
        { message: "profileToken manquant" },
        { status: 400 },
      );
    }

    if (!codePartenaire) {
      return NextResponse.json(
        { message: "code partenaire manquant" },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const response = await fetch(
      `${API_URL}/partenaire/creer-profil/${profileToken}?code=${encodeURIComponent(
        codePartenaire,
      )}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : (data?.message ?? "Erreur lors de la création du profil partenaire");

      return NextResponse.json({ message }, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error: any) {
    console.error("❌ Erreur API route partenaire inscription:", error);
    return NextResponse.json(
      { message: error?.message ?? "Erreur serveur interne" },
      { status: 500 },
    );
  }
}