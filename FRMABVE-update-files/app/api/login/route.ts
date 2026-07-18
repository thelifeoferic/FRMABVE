import { NextResponse } from "next/server";
import { createSessionToken, getLockCredentials, SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/auth/lock";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const credentials = getLockCredentials();
  const nextUrl = new URL("/asheville", request.url);

  if (username !== credentials.username || password !== credentials.password || !credentials.password) {
    const loginUrl = new URL("/asheville/login", request.url);
    loginUrl.searchParams.set("error", "1");
    return NextResponse.redirect(loginUrl, 303);
  }

  const response = NextResponse.redirect(nextUrl, 303);
  response.cookies.set({
    name: SESSION_COOKIE,
    value: await createSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/"
  });

  return response;
}
