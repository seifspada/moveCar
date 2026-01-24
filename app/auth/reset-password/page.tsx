"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  AuthLayout,
  AuthFormCard,
  AuthInput,
  AuthButton,
  AuthError,
  AuthSuccess,
} from "@/components/auth";

// Interface pour les props du formulaire
interface ResetPasswordFormProps {
  router: AppRouterInstance;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  success: string;
  setSuccess: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthLayout>
      <Suspense fallback={<div className="flex items-center justify-center p-8">Chargement...</div>}>
        <ResetPasswordForm
          router={router}
          email={email}
          setEmail={setEmail}
          code={code}
          setCode={setCode}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          setError={setError}
          success={success}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
        />
      </Suspense>
    </AuthLayout>
  );
}

function ResetPasswordForm({
  router,
  email,
  setEmail,
  code,
  setCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  setError,
  success,
  setSuccess,
  loading,
  setLoading,
}: ResetPasswordFormProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");

    if (emailParam) setEmail(emailParam);
    if (codeParam) setCode(codeParam);

    // Si pas d'email ou de code, rediriger vers forget-password
    if (!emailParam || !codeParam) {
      router.replace("/forget-password");
    }
  }, [searchParams, router, setEmail, setCode]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Verifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Verifier la longueur minimale
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la reinitialisation");
      }

      setSuccess("Votre mot de passe a ete reinitialise avec succes.");

      // Rediriger vers la page de connexion apres 2 secondes
      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormCard
      title="Nouveau mot de passe"
      subtitle="Creez un nouveau mot de passe pour votre compte"
      footer={
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-blue-700 hover:text-orange-600 font-medium transition underline-offset-4 hover:underline"
          >
            Retour a la connexion
          </Link>
        </div>
      }
    >
      <AuthError message={error} />
      <AuthSuccess message={success} />

      <form className="space-y-6" onSubmit={handleResetPassword} autoComplete="off">
        <div className="space-y-5">
          <AuthInput
            id="newPassword"
            name="newPassword"
            type="password"
            label="Nouveau mot de passe"
            placeholder="Minimum 6 caracteres"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />

          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="Retapez votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <AuthButton loading={loading} loadingText="Reinitialisation...">
          Reinitialiser le mot de passe
        </AuthButton>
      </form>
    </AuthFormCard>
  );
}
