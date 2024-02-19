import { NextResponse } from "next/server";

import { authMiddleware } from "@clerk/nextjs";

import { env } from "@/env.mjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/sso-callback",

    "/api",
    "/api/(.*)",
    "/api/webhooks(.*)",
  ],
  debug: env.NODE_ENV === "development",
  // afterAuth: (auth, req) => {
  //   if (!auth.userId && !["/"].includes(req.nextUrl.pathname)) {
  //     return NextResponse.redirect(new URL("/sign-up", req.nextUrl.origin));
  //   }
  // },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
