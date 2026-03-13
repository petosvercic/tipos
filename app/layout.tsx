import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos Analyzer",
  description: "eKeno analysis, history and tip panel"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}