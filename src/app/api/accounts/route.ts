import { db } from "@/drizzle/db";
import { account } from "@/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

// GET /api/accounts?userId=USER_ID
export async function GET(request: Request) {
  try {
    const session_data = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session_data || !session_data.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session_data.user.id;

    // Only allow users to see their own accounts unless admin
    if (userId !== session_data.user.id && session_data.user.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const userAccounts = await db
      .select({
        id: account.id,
        providerId: account.providerId,
        accountId: account.accountId,
        createdAt: account.createdAt,
      })
      .from(account)
      .where(eq(account.userId, userId));

    return Response.json({
      accounts: userAccounts,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
