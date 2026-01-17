import { db } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { CreatePostRequest, PostRequest } from "@/types/users";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session_data || !session_data.user) {
      return Response.json(
        { error: "Unauthorized - session data" },
        { status: 401 }
      );
    }

    const body: CreatePostRequest = await request.json();
    const userId = body.authorId;

    if (session_data.user.id !== userId) {
      return Response.json(
        { error: "Unauthorized - session user" },
        { status: 401 }
      );
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title: body.title,
        slug: body.slug,
        content: body.content,
        authorId: userId,
      })
      .returning();

    if (!newPost) {
      return Response.json({ error: "Failed to create post" }, { status: 500 });
    }

    return Response.json(
      {
        message: "Post is created successfully",
        post: newPost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session_data || !session_data.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userPosts = await db.select().from(posts);
    return Response.json(
      {
        userPosts,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
