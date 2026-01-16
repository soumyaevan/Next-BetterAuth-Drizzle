"use client";
import { SignupForm } from "@/app/components/signup-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Page() {
  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!loading && session) {
      toast.info("You are already logged in");
      router.push("/post-list");
    }
  }, [loading, session, router]);
  if (loading) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 my-5 flex flex-col justify-center">
      <header className="px-2 my-4">
        <h1 className="text-3xl text-center">Sign Up</h1>
      </header>
      <SignupForm />
    </div>
  );
}
