import { db } from "@/drizzle/db";
import { user } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    // Use Better Auth's built-in session validation
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session_data || !session_data.user) {
      return Response.json(
        { error: "Unauthorized - No valid session" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session_data.user.role !== "admin") {
      return Response.json(
        { error: "Forbidden! Admin access required" },
        { status: 403 }
      );
    }

    const allUsers = await db.select().from(user);

    return Response.json({
      users: allUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        role: u.role,
        image: u.image,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users. ", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
