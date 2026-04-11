// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRoutes: Record<string, string> = {
  adherent: "adherent",
  partenaire: "partenaire",
  admin: "admin",
  agent: "agent", 
};

const roleRedirects: Record<string, string> = {
  adherent: "/adherent/mission-page",
  partenaire: "/partenaire/demande-mission",
  admin: "/admin/overview",
  agent: "/agent/overview",      
};

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  console.log("=== MIDDLEWARE ===");
  console.log("Path:", pathname);
  console.log("Role:", role);

  // ✅ 1. Si sur /login et connecté → rediriger vers dashboard
  if (pathname === "/auth/login") {
    if (role && roleRedirects[role]) {
      console.log("→ Déjà connecté, redirection vers:", roleRedirects[role]);
      return NextResponse.redirect(new URL(roleRedirects[role], request.url));
    }
    console.log("→ Accès à /login autorisé");
    return NextResponse.next();
  }

  // ✅ 2. Vérifier si c'est une route protégée
  const protectedPaths = ['/adherent', '/partenaire', '/admin', '/agent']; // ✅ Ajouté
  const matchedPath = protectedPaths.find(path => pathname.startsWith(path));

  if (matchedPath) {
    console.log("Route protégée détectée:", matchedPath);

    // ✅ 2a. Pas de rôle → rediriger vers /login
    if (!role) {
      console.log("🔒 Pas de rôle - Redirection vers /login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // ✅ 2b. Extraire le rôle requis depuis le path
    const requiredRole = matchedPath.substring(1);

    console.log("Rôle requis:", requiredRole);
    console.log("Rôle utilisateur:", role);

    // ✅ 2c. Vérifier si le rôle correspond
    if (role !== requiredRole) {
      console.log("❌ Mauvais rôle - Redirection");

      if (roleRedirects[role]) {
        return NextResponse.redirect(new URL(roleRedirects[role], request.url));
      }

      // Fallback vers /login si rôle inconnu
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    console.log("✅ Rôle correct - Accès autorisé");
  }

  console.log("→ NextResponse.next()");
  return NextResponse.next();
}

// 🔴 ESSENTIEL : Exclure les fichiers statiques
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ]
};
