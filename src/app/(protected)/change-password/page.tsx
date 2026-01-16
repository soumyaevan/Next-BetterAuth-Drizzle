"use client";
import { ChangePasswordForm } from "@/app/components/change-password-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ChangePassword = () => {
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
      <div>
        <p>Loading</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }
  return (
    <div className="min-w-screen md:min-w-fit px-2 mb-5 md:w-150 mt-10 md:mt-20">
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePassword;
