"use client";

import { useState, type InputHTMLAttributes } from "react";

function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.24 4.24M6.5 6.6C3.9 8.2 2 12 2 12s4 7 11 7c1.7 0 3.2-.4 4.5-1.06M9.9 5.2A10.6 10.6 0 0 1 12 5c7 0 11 7 11 7a13.6 13.6 0 0 1-2.4 3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PasswordField({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full max-w-[384px]">
      <input
        type={visible ? "text" : "password"}
        className={`w-full rounded-lg border border-accent/40 bg-cream px-4 py-2.5 pr-10 font-sans text-xs text-ink placeholder:text-ink/50 outline-none focus:border-accent ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/60 hover:text-ink"
      >
        {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </button>
    </div>
  );
}
