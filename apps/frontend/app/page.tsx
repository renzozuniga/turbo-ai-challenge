"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmptyNotesState } from "@/components/EmptyNotesState";
import { NewNoteButton } from "@/components/NewNoteButton";
import { NoteCard } from "@/components/NoteCard";
import { NoteEditor } from "@/components/NoteEditor";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Category, Note } from "@/lib/types";

type EditorMode = "create" | Note | null;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const refreshCategories = useCallback(() => {
    if (!user) return;
    api.get<Category[]>("/categories/").then(setCategories);
  }, [user]);

  const refreshNotes = useCallback(() => {
    if (!user) return;
    const query = activeCategoryId ? `?category=${activeCategoryId}` : "";
    api.get<Note[]>(`/notes/${query}`).then(setNotes);
  }, [user, activeCategoryId]);

  useEffect(refreshCategories, [refreshCategories]);
  useEffect(refreshNotes, [refreshNotes]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  function closeEditor() {
    setEditorMode(null);
    refreshCategories();
    refreshNotes();
  }

  return (
    <main className="min-h-screen p-5">
      <div className="flex justify-end">
        <NewNoteButton onClick={() => setEditorMode("create")} />
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
              <NoteCard key={note.id} note={note} onClick={() => setEditorMode(note)} />
            ))}
          </div>
        )}
      </div>

      {editorMode !== null && (
        <NoteEditor
          categories={categories}
          note={editorMode === "create" ? null : editorMode}
          onClose={closeEditor}
        />
      )}
    </main>
  );
}
