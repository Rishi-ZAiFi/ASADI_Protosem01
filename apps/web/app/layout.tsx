import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator OS - Autonomous Content Pipeline",
  description: "Unified AI Engine for Creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-[#06141B] text-[#CCD0CF]">
        {children}
      </body>
    </html>
  );
}
