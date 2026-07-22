import type { ReactNode } from "react";

interface AuthCardProps {
  illustrationSrc: string;
  illustrationAlt: string;
  illustrationWidth: number;
  illustrationHeight: number;
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({
  illustrationSrc,
  illustrationAlt,
  illustrationWidth,
  illustrationHeight,
  title,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={illustrationSrc}
        alt={illustrationAlt}
        width={illustrationWidth}
        height={illustrationHeight}
      />
      <h1 className="text-center font-display text-[48px] font-bold leading-none text-heading">{title}</h1>
      <div className="flex w-full max-w-[384px] flex-col items-center gap-3.5">{children}</div>
      {footer}
    </main>
  );
}
