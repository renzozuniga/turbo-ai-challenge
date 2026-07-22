"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-12">
      <h1 className="font-display text-3xl">Notes</h1>
      <p className="mt-4">Signed in as {user.email}</p>
      <button
        onClick={() => logout()}
        className="mt-6 rounded-full border border-ink/30 px-4 py-2 text-sm font-semibold"
      >
        Log out
      </button>
    </main>
  );
}
