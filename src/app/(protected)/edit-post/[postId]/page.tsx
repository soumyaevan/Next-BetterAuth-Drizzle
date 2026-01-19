"use client";
import EditPostForm from "@/app/components/edit-post-form";
import LoaderElement from "@/app/components/LoaderElement";
import { authClient } from "@/lib/auth-client";
import { PostRequest } from "@/types/users";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const EditPost = () => {
  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.postId;
  const { data, isPending, error } = useQuery({
    queryKey: ["single-post"],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch the post");
      }
      const result = await response.json();
      return result as { post: PostRequest };
    },
  });
  useEffect(() => {
    if (!loading && !session) {
      toast.error("Login to continue");
      router.push("/");
    }
  }, [session, loading, router]);
  if (loading || isPending) {
    return (
      <div>
        <LoaderElement />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const postDetails = data?.post;

  return (
    <div className="min-w-screen md:min-w-fit px-2 mb-5 md:w-150 mt-10 md:mt-20">
      {postDetails ? (
        <EditPostForm post={postDetails} />
      ) : (
        <h2 className="mt-5 text-2xl text-center">No Post Found</h2>
      )}
    </div>
  );
};

export default EditPost;
