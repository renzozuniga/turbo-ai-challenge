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
  const [notesLoading, setNotesLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const refreshCategories = useCallback(async () => {
    if (!user) return;
    try {
      setCategories(await api.get<Category[]>("/categories/"));
    } catch {
      setDataError("Couldn't load your categories.");
    }
  }, [user]);

  const refreshNotes = useCallback(async () => {
    if (!user) return;
    setNotesLoading(true);
    try {
      const query = activeCategoryId ? `?category=${activeCategoryId}` : "";
      setNotes(await api.get<Note[]>(`/notes/${query}`));
      setDataError(null);
    } catch {
      setDataError("Couldn't load your notes.");
    } finally {
      setNotesLoading(false);
    }
  }, [user, activeCategoryId]);

  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

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

      <div className="mt-10 flex flex-col gap-8 md:flex-row">
        <Sidebar categories={categories} activeCategoryId={activeCategoryId} onSelectCategory={setActiveCategoryId} />

        {dataError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="font-sans text-sm text-ink/70">{dataError}</p>
            <button
              type="button"
              onClick={() => {
                refreshCategories();
                refreshNotes();
              }}
              className="font-sans text-sm font-semibold text-accent underline"
            >
              Try again
            </button>
          </div>
        ) : notesLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-sans text-sm text-ink/60">Loading notes…</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyNotesState />
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-[repeat(auto-fill,303px)] justify-center gap-[13px] md:justify-start">
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
