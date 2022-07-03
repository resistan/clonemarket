import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Interrupted. Be a human", { status: 403 });
  }
  // console.log(req.cookies);
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.clonemarket) {
      return NextResponse.redirect("/enter");
    }
    if (req.url.includes("/enter") && req.cookies.clonemarket) {
      return NextResponse.redirect("/");
    }
  }
  // console.log(req.geo?.country); // not work on localhost
}
