import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

export default NextAuth(authConfig).auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const ownerPaths = ["/dashboard", "/listings", "/inquiries"];
  const isOwnerPath = ownerPaths.some((p) => pathname.startsWith(p));

  if (isOwnerPath) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (session.user.role !== "OWNER") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ถ้า login แล้วไม่ต้องไป register/login อีก
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/listings/:path*", "/inquiries/:path*", "/login", "/register"],
};
