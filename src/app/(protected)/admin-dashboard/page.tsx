"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const AdminDashboard = () => {
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
      <div>
        <p>Loading</p>
      </div>
    );
  }

  if (
    session &&
    (session.user as unknown as { role: string }).role !== "admin"
  ) {
    return null;
  }

  if (!session) {
    return null;
  }
  return (
    <main className="max-w-6xl mx-auto">
      <div>
        <p>Admin Dashboard</p>
      </div>
      <div className="mt-5">{session && <h1>{session.user.name}</h1>}</div>
    </main>
  );
};

export default AdminDashboard;
