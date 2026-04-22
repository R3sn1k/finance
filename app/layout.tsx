import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance Dresi",
  description: "Pregled prodaje, prihodkov, odhodkov in ciljev.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl">
      <body>{children}</body>
    </html>
  );
}
