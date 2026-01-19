import { db } from "@/drizzle/db";
import { posts, user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session_data || !session_data.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "3");
    const skip = (page - 1) * pageSize;

    // const allPosts = await db.select().from(posts);
    // const totalItems = allPosts.length;

    const userPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        content: posts.content,
        authorId: posts.authorId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
      .from(posts)
      .where(eq(posts.authorId, session_data.user.id))
      .leftJoin(user, eq(posts.authorId, user.id))
      .orderBy(desc(posts.id))
      .limit(pageSize)
      .offset(skip);
    const totalItems = userPosts.length;
    return Response.json(
      {
        userPosts,
        totalItems,
        page,
        pageSize,
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
