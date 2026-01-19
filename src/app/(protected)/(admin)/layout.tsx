// src/app/(protected)/layout.tsx
"use client";

import LoaderElement from "@/app/components/LoaderElement";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      toast.error("Login to continue");
      router.push("/");
    } else if (
      session &&
      (session.user as unknown as { role: string }).role !== "admin"
    ) {
      toast.error("You are not authorized to view this page");
      router.push("/post-list");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderElement />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
