"use client";

import { useState } from "react";

import { CategoryDropdown } from "@/components/CategoryDropdown";
import { api } from "@/lib/api";
import { formatEditedTimestamp } from "@/lib/date";
import type { Category, Note } from "@/lib/types";

interface NoteEditorProps {
  categories: Category[];
  note: Note | null;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function NoteEditor({ categories, note, onClose }: NoteEditorProps) {
  const isCreate = note === null;
  const [categoryId, setCategoryId] = useState<number | null>(note?.category.id ?? categories[0]?.id ?? null);
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? note?.category;

  async function handleClose() {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (isCreate) {
      if (trimmedTitle || trimmedContent) {
        await api.post("/notes/", { title: trimmedTitle, content: trimmedContent, category_id: categoryId });
      }
    } else if (note && (trimmedTitle !== note.title || trimmedContent !== note.content)) {
      await api.patch(`/notes/${note.id}/`, { title: trimmedTitle, content: trimmedContent });
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-cream p-5">
      <div className="flex items-center justify-between">
        {isCreate ? (
          <CategoryDropdown categories={categories} selectedCategoryId={categoryId} onChange={setCategoryId} />
        ) : (
          <span />
        )}
        <button type="button" onClick={handleClose} className="text-ink" aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      <div className="relative mt-2 flex flex-1 flex-col">
        <div
          className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-[11px] border-[3px] p-8 pt-10"
          style={{
            backgroundColor: selectedCategory ? `${selectedCategory.color}80` : undefined,
            borderColor: selectedCategory?.color,
          }}
        >
          <p className="text-right font-sans text-xs font-normal text-ink">
            Last Edited: {formatEditedTimestamp(note?.updated_at ?? new Date().toISOString())}
          </p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="bg-transparent font-display text-2xl font-bold text-ink outline-none placeholder:text-ink/50"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Pour your heart out..."
            className="flex-1 resize-none bg-transparent font-sans text-base leading-[27px] text-ink outline-none placeholder:text-ink/50"
          />
        </div>
      </div>
    </div>
  );
}
