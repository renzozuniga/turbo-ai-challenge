"use client";

import { useEffect, useRef, useState } from "react";

import type { Category } from "@/lib/types";

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onChange: (id: number) => void;
}

function ChevronDownIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryDropdown({ categories, selectedCategoryId, onChange }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = categories.find((c) => c.id === selectedCategoryId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const otherCategories = categories.filter((c) => c.id !== selectedCategoryId);

  return (
    <div ref={containerRef} className="relative w-[225px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[39px] w-[225px] items-center justify-between gap-[7px] rounded-lg border border-accent bg-cream px-3"
      >
        <span className="flex items-center gap-[7px]">
          {selected && (
            <span
              className="h-[11px] w-[11px] shrink-0 rounded-full"
              style={{ backgroundColor: selected.color }}
              aria-hidden
            />
          )}
          <span className="font-sans text-xs font-normal text-ink">{selected?.name}</span>
        </span>
        <ChevronDownIcon />
      </button>

      {open && (
        <div className="absolute left-0 top-[45px] z-10 w-[225px] rounded-lg bg-cream p-2 shadow-md">
          {otherCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                onChange(category.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-[7px] rounded px-2 py-2 text-left hover:bg-accent/10"
            >
              <span
                className="h-[11px] w-[11px] shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
                aria-hidden
              />
              <span className="font-sans text-xs font-normal text-ink">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
