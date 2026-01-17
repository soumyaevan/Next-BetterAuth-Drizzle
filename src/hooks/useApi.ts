import { axiosInstance } from "@/lib/axios-instance";
import { CreatePostRequest, PostRequest } from "@/types/users";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost() {
  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      const { data } = await axiosInstance.post<PostRequest>(
        "/api/posts",
        payload
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate posts cache to refetch
      //   queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("Post Created");
    },
  });
}
