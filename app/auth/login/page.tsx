"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthLayout,
  AuthFormCard,
  AuthInput,
  AuthButton,
  AuthError,
} from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      // ✅ Token
      const token = data.access_token || data.accessToken;
      if (!token) throw new Error("Token manquant dans la réponse");
      localStorage.setItem("token", token);

      // ✅ User
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Role
      const userRole = data.role?.toLowerCase();
      if (!userRole || typeof userRole !== "string") {
        throw new Error("Rôle utilisateur invalide ou manquant");
      }
      localStorage.setItem("role", userRole);

      // ✅ Décoder le JWT pour extraire agentId / agenceId / adherentId / partenaireId
      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        console.log("🔑 JWT Payload:", tokenPayload);

        if (userRole === "agent") {
          if (tokenPayload.agentId) {
            localStorage.setItem("agentId", String(tokenPayload.agentId));
            console.log("✅ agentId sauvegardé:", tokenPayload.agentId);
          }
          if (tokenPayload.agenceId) {
            localStorage.setItem("agenceId", String(tokenPayload.agenceId));
            console.log("✅ agenceId sauvegardé:", tokenPayload.agenceId);
          }
        }

        if (userRole === "adherent" && tokenPayload.adherentId) {
          localStorage.setItem("adherentId", String(tokenPayload.adherentId));
          console.log("✅ adherentId sauvegardé:", tokenPayload.adherentId);
        }

        if (userRole === "partenaire" && tokenPayload.partenaireId) {
          localStorage.setItem(
            "partenaireId",
            String(tokenPayload.partenaireId)
          );
          console.log(
            "✅ partenaireId sauvegardé:",
            tokenPayload.partenaireId
          );
        }
      } catch (jwtErr) {
        console.warn("⚠️ Impossible de décoder le JWT:", jwtErr);
      }

      // ✅ Nettoyer ancien currentUser corrompu
      localStorage.removeItem("currentUser");

      // ✅ Redirection
      const roleRoutes: Record<string, string> = {
        adherent: "/adherent/mission-page",
        partenaire: "/partenaire/acceuil",
        admin: "/admin/demande-liste",
        agent: "/agent/acceuil",
      };

      const redirectPath = roleRoutes[userRole];
      if (!redirectPath) throw new Error(`Rôle non autorisé: ${userRole}`);

      window.location.href = redirectPath;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthLayout>
      <AuthFormCard
        title="Connexion à votre espace"
        footer={
          <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 space-y-3 sm:space-y-0">
            <Link
              href="/auth/forget-password"
              className="text-blue-700 hover:text-orange-600 font-medium transition underline-offset-4 hover:underline"
            >
              J&apos;ai oublié mon mot de passe
            </Link>
            <Link
              href="/inscription"
              className="text-orange-600 hover:text-blue-700 font-medium transition underline-offset-4 hover:underline"
            >
              Je n&apos;ai pas de compte ? Inscrivez-vous
            </Link>
          </div>
        }
      >
        <AuthError message={error} />

        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-5">
            <AuthInput
              id="email"
              name="email"
              type="email"
              label="Adresse e-mail"
              placeholder="votre.email@domaine.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-email"
            />

            {/* Champ mot de passe avec icône œil */}
            <div className="relative">
              <AuthInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Mot de passe"
                placeholder="Entrer votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                tabIndex={-1}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <AuthButton loading={loading} loadingText="Connexion en cours...">
            Se connecter
          </AuthButton>
        </form>
      </AuthFormCard>
    </AuthLayout>
  );
}