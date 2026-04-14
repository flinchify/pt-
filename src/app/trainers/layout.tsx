import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Personal Trainers",
  description: "Browse verified personal trainers across Australia. Filter by specialisation, location, price, and rating. Book your first session today.",
};

export default function TrainersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
