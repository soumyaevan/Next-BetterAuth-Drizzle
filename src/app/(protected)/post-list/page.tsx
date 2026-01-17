"use client";
import PostCard from "@/app/components/post-card";
import { authClient } from "@/lib/auth-client"; // import the auth client
import { PostRequest } from "@/types/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const PostListPage = () => {
  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();
  const { data, isPending, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch posts");
      }
      const result = await response.json();
      return result.userPosts as PostRequest[];
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
        <p>Loading</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const posts = data;
  return (
    <div className="flex flex-col justify-center">
      <div>
        <p className="text-center">Welcome to landing page</p>
      </div>
      <div className="flex flex-col items-center">
        {posts ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="mt-5">
            <p>No Post available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostListPage;
