"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: session } = await authClient.getSession();
      if (!session) {
        toast.error("login failed, try again!");
        router.push("/");
      } else if (
        (session?.user as unknown as { role: string }).role === "admin"
      ) {
        toast.success("Welcome Admin!");
        router.push("/admin-dashboard");
      } else {
        toast.success("Login successful!");
        router.push("/post-list");
      }
    };

    checkSession();
  }, [router]);

  return <div>Redirecting...</div>;
}
