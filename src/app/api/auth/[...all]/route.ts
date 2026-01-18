import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

// Helper to add CORS headers
function addCorsHeaders(response: Response, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const response = await handler.GET(request);
  return addCorsHeaders(response, origin);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const response = await handler.POST(request);
  return addCorsHeaders(response, origin);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "http://localhost:3000";
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response, origin);
}
