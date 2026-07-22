"use client";

import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({ loading, disabled, children, className = "", ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`w-full max-w-[384px] rounded-full border border-accent bg-accent px-4 py-3 text-base font-bold text-cream font-sans transition-opacity disabled:opacity-60 ${className}`}
      {...props}
    >
      {loading ? "…" : children}
    </button>
  );
}
