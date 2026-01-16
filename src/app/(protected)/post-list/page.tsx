"use client";
import { authClient } from "@/lib/auth-client"; // import the auth client
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const PostListPage = () => {
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
    <div className="">
      <div>
        <p>Welcome to landing page</p>
      </div>
    </div>
  );
};

export default PostListPage;
