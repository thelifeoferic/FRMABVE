import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "From Above — AI Marketing Solutions",
  description: "Practical AI systems for sharper campaigns, calmer operations and better customer experiences."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
