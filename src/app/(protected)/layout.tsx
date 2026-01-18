// src/app/(protected)/layout.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import ProfileSection from "../components/profile-section";

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
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = session.user.name;
  const email = session.user.email;
  return (
    <div className="flex flex-col md:flex-row grow overflow-hidden">
      <div className="md:absolute pt-15 md:pt-10">
        <ProfileSection name={userName} email={email} />
      </div>
      <main className="mt-20 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
