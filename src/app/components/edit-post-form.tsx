"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/app/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePostRequest, PostRequest } from "@/types/users";
import { axiosInstance } from "@/lib/axios-instance";
import { AxiosError } from "axios";

const EditPostForm = ({ post }: { post: PostRequest }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const { data: session, isPending: loading } = authClient.useSession();
  const userId = session?.user.id;
  const formSchema = z.object({
    title: z
      .string()
      .min(5, "Post title must be 5 characters.")
      .max(32, "Post title must be at most 32 characters."),
    description: z
      .string()
      .min(20, "Content must be at least 20 characters.")
      .max(500, "Content must be at most 100 characters."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      description: post.content,
    },
  });

  const mutation = useMutation<
    { message: string; post: PostRequest },
    AxiosError<{ error: string }>,
    CreatePostRequest
  >({
    mutationFn: async (payload: CreatePostRequest) => {
      const { data } = await axiosInstance.put(
        `/api/posts/${post.id}`,
        payload
      );
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("form-rhf-demo-title") as string;
    const content = formData.get("form-rhf-demo-description") as string;
    const slug = title.toLowerCase().replace(/\s/g, "-");
    const authorId = userId;

    const payload: CreatePostRequest = {
      title,
      slug,
      content,
      authorId,
    };

    mutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success("Post updated successfully!");
        setIsLoading(false);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        router.push("/post-list"); // or wherever you want to redirect
      },
      onError: (error: AxiosError<{ error: string }>) => {
        toast.error(error.response?.data?.error || "Failed to update post");
        setIsLoading(false);
      },
    });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Create Post</CardTitle>
        <CardDescription className="text-center">
          Your Thoughts, Your Space
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={handleSubmit}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Post Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    name="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Min 5 chars, Max 32 chars"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Your Thought
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      name="form-rhf-demo-description"
                      placeholder="Min 20 chars, Max 100 chars"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/500 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Your post will be public. Please do not share any private or
                    sensitive information.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" aria-disabled={isLoading}>
          <Button type="submit" form="form-rhf-demo">
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default EditPostForm;
