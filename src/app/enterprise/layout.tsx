import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise",
  description: "Corporate wellness programs powered by AnywherePT. Reduce sick days, boost productivity, and invest in your team's health.",
};

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
