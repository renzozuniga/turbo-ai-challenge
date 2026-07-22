"use client";

import type { InputHTMLAttributes } from "react";

export function TextField({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full max-w-[384px] rounded-lg border border-accent/40 bg-cream px-4 py-2.5 font-sans text-xs text-ink placeholder:text-ink/50 outline-none focus:border-accent ${className}`}
      {...props}
    />
  );
}
