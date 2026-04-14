import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Trainers",
  description: "Grow your personal training business with AnywherePT. Get more clients, easy scheduling, secure payments, and a professional profile.",
};

export default function ForTrainersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
