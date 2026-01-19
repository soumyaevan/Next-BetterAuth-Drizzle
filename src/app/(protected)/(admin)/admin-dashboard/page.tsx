"use client";
import LoaderElement from "@/app/components/LoaderElement";
import UserTable from "@/app/components/user-table";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();

  if (loading) {
    return (
      <div>
        <LoaderElement />
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
    <main className="max-w-6xl mx-auto p-6">
      <div>
        <p className="text-3xl font-bold text-center">Admin Dashboard</p>
      </div>
      <div className="mt-5">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Welcome, {session.user.name}
        </h1>
      </div>
      <div className="mt-8">
        <UserTable />
      </div>
    </main>
  );
};

export default AdminDashboard;
