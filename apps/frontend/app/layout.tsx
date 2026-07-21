import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turbo AI Challenge",
  description: "Django + Next.js starter for the Turbo AI Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
