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
  AuthSuccess,
} from "@/components/auth";

type Step = "email" | "code";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Etape 1 : Envoyer le code par email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Vérifier le code de statut 404
      if (response.status === 404) {
        setError("cette user n'existe pas");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du code");
      }

      setSuccess("Un code de vérification a été envoyé à votre adresse email.");
      setStep("code");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Etape 2 : Vérifier le code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      // Vérifier le code de statut 404
      if (response.status === 404) {
        setError("L'endpoint API n'existe pas (404)");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Code invalide ou expiré");
      }

      // Code vérifié, rediriger vers la page de reset-password
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer le code
  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      // Vérifier le code de statut 404
      if (response.status === 404) {
        setError("L'endpoint API n'existe pas (404)");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du code");
      }

      setSuccess("Un nouveau code a été envoyé à votre adresse email.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthFormCard
        title={step === "email" ? "Mot de passe oublié" : "Vérification du code"}
        subtitle={
          step === "email"
            ? "Entrez votre adresse email pour recevoir un code de vérification"
            : `Un code à 6 chiffres a été envoyé à ${email}`
        }
        footer={
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-blue-700 hover:text-orange-600 font-medium transition underline-offset-4 hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        }
      >
        <AuthError message={error} />
        <AuthSuccess message={success} />

        {step === "email" ? (
          <form className="space-y-6" onSubmit={handleSendCode} autoComplete="off">
            <AuthInput
              id="email"
              name="email"
              type="email"
              label="Adresse e-mail"
              placeholder="votre.email@domaine.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <AuthButton loading={loading} loadingText="Envoi en cours...">
              Envoyer le code
            </AuthButton>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleVerifyCode} autoComplete="off">
            <AuthInput
              id="code"
              name="code"
              type="text"
              label="Code de vérification"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={loading}
            />

            <AuthButton loading={loading} loadingText="Vérification...">
              Vérifier le code
            </AuthButton>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition underline-offset-4 hover:underline disabled:opacity-50"
              >
                Renvoyer le code
              </button>
            </div>
          </form>
        )}
      </AuthFormCard>
    </AuthLayout>
  );
}
