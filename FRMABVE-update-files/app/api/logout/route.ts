import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/lock";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/asheville/login", request.url), 303);
  response.cookies.delete(SESSION_COOKIE);

  return response;
}
