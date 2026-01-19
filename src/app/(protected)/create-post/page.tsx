"use client";
import CreatePostForm from "@/app/components/create-post-form";
import LoaderElement from "@/app/components/LoaderElement";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const CreatePost = () => {
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
        <LoaderElement />
      </div>
    );
  }

  if (!session) {
    return null;
  }
  return (
    <div className="min-w-screen md:min-w-fit px-2 mb-5 md:w-150 mt-10 md:mt-20">
      <CreatePostForm />
    </div>
  );
};

export default CreatePost;
