import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mireika Yomi — Debut",
  description: "Arwah dari alam kegelapan yang menembus batas untuk menemukan kehidupan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
