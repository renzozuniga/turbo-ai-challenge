"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptyNotesState } from "@/components/EmptyNotesState";
import { NewNoteButton } from "@/components/NewNoteButton";
import { NoteCard } from "@/components/NoteCard";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Category, Note } from "@/lib/types";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    api.get<Category[]>("/categories/").then(setCategories);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const query = activeCategoryId ? `?category=${activeCategoryId}` : "";
    api.get<Note[]>(`/notes/${query}`).then(setNotes);
  }, [user, activeCategoryId]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-5">
      <div className="flex justify-end">
        <NewNoteButton />
      </div>

      <div className="mt-10 flex gap-8">
        <Sidebar categories={categories} activeCategoryId={activeCategoryId} onSelectCategory={setActiveCategoryId} />

        {notes.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyNotesState />
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-[repeat(auto-fill,303px)] gap-[13px]">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
