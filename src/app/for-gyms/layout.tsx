import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Gyms",
  description: "Partner your gym with AnywherePT. Increase foot traffic, earn additional revenue, and manage trainer access with zero upfront cost.",
};

export default function ForGymsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
