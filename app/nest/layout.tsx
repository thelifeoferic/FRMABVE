import type { Metadata } from "next";
import "./nest.css";

export const metadata: Metadata = {
  title: "The Nest by Hotel Wren",
  description: "A calmer way to spend the day at Hotel Wren."
};

export default function NestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
