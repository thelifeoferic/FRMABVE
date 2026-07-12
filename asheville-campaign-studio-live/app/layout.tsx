import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campaign Studio",
  description: "Build Klaviyo-ready campaigns from audience, product, and brand data."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="site-footer">frm.abve &copy; 2026</footer>
      </body>
    </html>
  );
}
