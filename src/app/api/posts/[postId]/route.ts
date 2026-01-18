import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { CreatePostRequest, PostRequest } from "@/types/users";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session_data || !session_data.user) {
      return Response.json(
        { error: "Unauthorized - session data" },
        { status: 401 }
      );
    }

    const result = await db
      .select({ authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, Number(postId)));

    const { authorId } = result[0];

    if (
      session_data.user.id !== authorId &&
      session_data.user.role !== "admin"
    ) {
      return Response.json(
        { error: "Unauthorized - session user" },
        { status: 401 }
      );
    }

    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, Number(postId)))
      .returning();

    if (!deletedPost) {
      return Response.json({ error: "Failed to delete post" }, { status: 500 });
    }

    return Response.json(
      {
        message: "Post is deleted successfully",
        post: deletedPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session_data || !session_data.user) {
      return Response.json(
        { error: "Unauthorized - session data" },
        { status: 401 }
      );
    }
    const result = await db
      .select({ authorId: posts.authorId })
      .from(posts)
      .where(eq(posts.id, Number(postId)));

    const { authorId } = result[0];

    if (session_data.user.id !== authorId) {
      return Response.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const body: CreatePostRequest = await request.json();

    const [updatedPost] = await db
      .update(posts)
      .set({
        title: body.title,
        slug: body.slug,
        content: body.content,
        authorId: authorId,
      })
      .where(eq(posts.id, Number(postId)))
      .returning();
    if (!updatedPost) {
      return Response.json({ error: "Failed to update post" }, { status: 500 });
    }

    return Response.json(
      {
        message: "Post is updated successfully",
        post: updatedPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    console.log(postId);

    const session_data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session_data || !session_data.user) {
      return Response.json(
        { error: "Unauthorized - session data" },
        { status: 401 }
      );
    }

    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.id, Number(postId)));

    const post: PostRequest = result[0];

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json(
      {
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getting post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
