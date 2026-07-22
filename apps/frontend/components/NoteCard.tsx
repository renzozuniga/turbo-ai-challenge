import { formatRelativeDate } from "@/lib/date";
import type { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[246px] w-[303px] flex-col gap-3 overflow-hidden rounded-[11px] border-[3px] p-4 text-left"
      style={{
        backgroundColor: `${note.category.color}80`,
        borderColor: note.category.color,
      }}
    >
      <div className="flex items-center gap-2 font-sans text-xs text-ink">
        <span className="font-bold">{formatRelativeDate(note.created_at)}</span>
        <span className="font-normal">{note.category.name}</span>
      </div>
      <h3 className="font-display text-2xl font-bold text-ink">{note.title || "Untitled"}</h3>
      <p className="whitespace-pre-line font-sans text-xs font-normal text-ink">{note.content}</p>
    </button>
  );
}
