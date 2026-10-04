import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "sevre_session";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get(COOKIE)?.value) {
    const token =
      crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    response.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 120,
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)"],
};
