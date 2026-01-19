"use client";
import { authClient } from "@/lib/auth-client";
import { ResetPasswordForm } from "../components/reset-password-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import LoaderElement from "../components/LoaderElement";

const ResetPasswordPage = () => {
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
        <LoaderElement />
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 my-5 flex flex-col justify-center">
      <header className="px-2 my-4">
        <h1 className="text-3xl text-center">Reset Password</h1>
      </header>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
