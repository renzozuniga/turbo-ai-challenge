import type { Metadata } from "next";
import { Inria_Serif, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inria-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Notes",
  description: "A cozy little notes app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inriaSerif.variable} ${inter.variable}`}>
      <body className="bg-cream text-ink font-sans min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
