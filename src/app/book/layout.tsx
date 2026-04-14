import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Session",
  description: "Book a personal training session with a verified trainer on AnywherePT.",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
