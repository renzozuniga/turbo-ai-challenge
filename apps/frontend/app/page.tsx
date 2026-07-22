"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptyNotesState } from "@/components/EmptyNotesState";
import { NewNoteButton } from "@/components/NewNoteButton";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Category, Note } from "@/lib/types";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api.get<Category[]>("/categories/").then(setCategories);
    api.get<Note[]>("/notes/").then(setNotes);
  }, [user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen gap-10 p-5">
      <Sidebar categories={categories} />

      <div className="flex flex-1 flex-col">
        <div className="flex justify-end">
          <NewNoteButton />
        </div>

        <div className="flex flex-1 items-center justify-center">
          {notes.length === 0 ? (
            <EmptyNotesState />
          ) : (
            <ul className="w-full max-w-2xl space-y-2 self-start">
              {notes.map((note) => (
                <li key={note.id} className="rounded-lg border border-accent/20 p-3 text-sm">
                  {note.title || "Untitled"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
