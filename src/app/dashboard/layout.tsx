"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || user.role !== "client") return null;

  return <DashboardLayout role="client">{children}</DashboardLayout>;
}
