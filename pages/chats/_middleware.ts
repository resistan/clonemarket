import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // console.log(req.ua);
  console.log("chat ONLY middleware works");
}
