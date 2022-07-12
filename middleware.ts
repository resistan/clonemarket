import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // console.log(req.cookies);
  // if (req.ua?.isBot) {
  //   return new Response("Interrupted. Be a human", { status: 403 });
  // }
  // console.log(req.cookies.get("clonemarket"));
  // if (!req.nextUrl.pathname.startsWith("/api")) {
  //   if (
  //     !req.nextUrl.pathname.startsWith("/enter") &&
  //     !req.cookies.get("clonemarket")
  //   ) {
  //     return NextResponse.redirect(new URL("/enter", req.url));
  //   }
  //   if (
  //     !req.nextUrl.pathname.startsWith("/") &&
  //     req.cookies.get("clonemarket")
  //   ) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }
  // console.log(req.geo?.country); // not work on localhost
}

// Supports both a single string value or an array of matchers
// export const config = {
//   // matcher: ["/about/:path*", "/dashboard/:path*"],
// };
