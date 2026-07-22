"use client";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 2v12M2 8h12" strokeLinecap="round" />
    </svg>
  );
}

interface NewNoteButtonProps {
  onClick?: () => void;
}

export function NewNoteButton({ onClick }: NewNoteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative top-[39px] right-[23px] flex h-[43px] w-[133px] shrink-0 items-center justify-center gap-[6px] rounded-[46px] border border-accent bg-[#95713933] px-4 py-3 rotate-0 opacity-100 font-sans text-base font-bold text-accent transition-colors hover:bg-white"
    >
      <PlusIcon />
      New Note
    </button>
  );
}
