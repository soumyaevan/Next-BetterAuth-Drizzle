"use client";
import { PostRequest } from "@/types/users";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios-instance";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

const PostCard = ({
  post,
  isAuthor,
  isAdmin,
}: {
  post: PostRequest;
  isAuthor: boolean;
  isAdmin: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete(`/api/posts/${post.id}`);
      return data;
    },
    onSuccess: () => {
      toast.success(`${post.title} - post is deleted successfully`);
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/post-list");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data.error || "Failed to delete post");
      setIsLoading(false);
    },
  });

  const handleDelete = async () => {
    setIsLoading(true);
    mutation.mutate();
  };

  const handleEdit = () => {
    router.push(`/edit-post/${post.id}`);
  };

  return (
    <div className="bg-blue-200 flex flex-col my-5 px-6 py-5 gap-4 w-[300px] md:w-[600px] rounded">
      <div className="">
        <h3 className="font-bold text-xl text-blue-600">{post.title}</h3>
        <p className="text-sm text-black">
          Written by <span className="font-bold">{post.author?.name}</span>
        </p>
      </div>
      <div className="bg-blue-300 p-2 border border-blue-700 w-full rounded shadow-md">
        <p className="px-2 py-1 text-blue-500 font-semibold">{post.content}</p>
      </div>
      {isAuthor && (
        <div className="mt-5 flex gap-4">
          <Button onClick={handleDelete} variant="destructive">
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
          <Button className="" variant="secondary" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      )}
      {!isAuthor && isAdmin && (
        <div className="mt-5 flex gap-4">
          <Button onClick={handleDelete} variant="destructive">
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
