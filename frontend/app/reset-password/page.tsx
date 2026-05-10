"use client";
import React, { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Failed to reset password.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, newPassword, confirmPassword, router]);

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-10">
        <Link href="/">
          <Image src="/findea1.png" alt="Findea" width={140} height={46} className="object-contain" priority />
        </Link>
      </div>

      <h1 className="text-[28px] font-serif font-bold tracking-wider text-black mb-2 text-center">
        Nouveau mot de passe
      </h1>
      <p className="text-[14px] font-serif text-gray-600 text-center mb-10">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      {success ? (
        <div className="text-center space-y-4">
          <p className="text-green-700 font-serif text-[15px]">
            Mot de passe mis à jour avec succès. Redirection vers la connexion…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {!token && (
            <p className="text-red-600 font-serif text-[14px] text-center">
              Lien de réinitialisation invalide ou expiré.{" "}
              <Link href="/lost-password" className="underline">Demander un nouveau lien</Link>
            </p>
          )}

          <div className="space-y-2">
            <label className="text-[14px] font-serif font-bold text-black tracking-tight">
              Nouveau mot de passe*
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={!token}
              className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[14px] font-serif font-bold text-black tracking-tight">
              Confirmer le mot de passe*
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={!token}
              className="w-full bg-[#e5e1da] border border-[#aba8a1] py-4 px-5 focus:outline-none text-[16px] font-serif font-bold text-black disabled:opacity-50"
            />
          </div>

          {error && <p className="text-red-600 text-[14px] font-serif">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-[#f2e6cf] text-black font-serif font-bold py-5 px-8 text-[15px] border border-[#d3c7ad] shadow-sm transition-all hover:bg-[#e9dab9] disabled:opacity-50"
          >
            {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
          </button>

          <p className="text-center text-[13px] font-serif text-gray-600">
            <Link href="/login" className="underline hover:text-black">
              Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="font-serif text-gray-500">Chargement…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
