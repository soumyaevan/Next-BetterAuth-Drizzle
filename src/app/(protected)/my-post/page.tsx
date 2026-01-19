"use client";

import MyPostPagination from "@/app/components/MyPostPagination";
import Pagination from "@/app/components/Pagination";
import PostCard from "@/app/components/post-card";
import { authClient } from "@/lib/auth-client"; // import the auth client
import { PostRequest } from "@/types/users";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import { toast } from "sonner";

const UserPostListPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "3";
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  const { data: session, isPending: loading } = authClient.useSession();
  const router = useRouter();
  const { data, isPending, error } = useQuery({
    queryKey: ["my-posts", pageNum, pageSizeNum],
    queryFn: async () => {
      const response = await fetch(
        `/api/posts/myposts?page=${pageNum}&pageSize=${pageSizeNum}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch posts");
      }
      const result = await response.json();
      return result as {
        userPosts: PostRequest[];
        totalItems: number;
        page: number;
        pageSize: number;
      };
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

  const posts = data?.userPosts;
  const totalItems = data?.totalItems || 0;
  const currentUserId = session.user.id;
  const isAdmin: boolean = session.user.role === "admin";

  return (
    <div className="flex flex-col justify-center">
      <div>
        <p className="text-center">Welcome to landing page</p>
      </div>
      <div className="flex flex-col items-center">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isAuthor={post.authorId === currentUserId}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="mt-5">
            <p>No Post available</p>
          </div>
        )}
      </div>
      {posts && posts.length > 0 && (
        <div className="mt-8 mb-6">
          <MyPostPagination
            page={pageNum}
            pageSize={pageSizeNum}
            totalItems={totalItems}
          />
        </div>
      )}
    </div>
  );
};

export default UserPostListPage;
