"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function EnterpriseDashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "enterprise")) {
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

  if (!user || user.role !== "enterprise") return null;

  return <DashboardLayout role="enterprise">{children}</DashboardLayout>;
}
