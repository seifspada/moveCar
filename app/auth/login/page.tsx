"use client";

import React from "react"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthLayout,
  AuthFormCard,
  AuthInput,
  AuthButton,
  AuthError,
} from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur de connexion");
    }

    const token = data.access_token || data.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    // ✅ Utiliser data.role directement (c'est déjà une string)
    const userRole = data.role?.toLowerCase();

    if (!userRole || typeof userRole !== "string") {
      throw new Error("Rôle utilisateur invalide ou manquant");
    }

    localStorage.setItem("role", userRole);

    const roleRoutes: Record<string, string> = {
      adherent: "/adherent/mission-page",
      partenaire: "/partenaire/demande-mission",
      admin: "/admin/overview",
      manager: "/manager/home",
    };

    const redirectPath = roleRoutes[userRole];

    if (!redirectPath) {
      throw new Error(`Rôle non autorisé: ${userRole}`);
    }

    router.replace(redirectPath);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

            <AuthInput
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              placeholder="Entrer votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <AuthButton loading={loading} loadingText="Connexion en cours...">
            Se connecter
          </AuthButton>
        </form>
      </AuthFormCard>
    </AuthLayout>
  );
}
