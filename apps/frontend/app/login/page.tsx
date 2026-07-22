"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/Button";
import { PasswordField } from "@/components/PasswordField";
import { TextField } from "@/components/TextField";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof ApiError && typeof err.body === "object" && err.body && "detail" in err.body
          ? String((err.body as { detail: unknown }).detail)
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      illustrationSrc="/illustrations/login-cactus.png"
      illustrationAlt=""
      illustrationWidth={96}
      illustrationHeight={114}
      title="Yay, You're Back!"
      footer={
        <Link href="/register" className="text-xs font-normal text-accent underline">
          Oops! I&apos;ve never been here before
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-3.5">
        <TextField
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordField
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="w-full text-xs text-red-700">{error}</p>}
        <Button type="submit" loading={submitting} className="mt-2.5">
          Login
        </Button>
      </form>
    </AuthCard>
  );
}
