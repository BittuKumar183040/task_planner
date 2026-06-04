export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/boards/:path*",
    "/teamboard/:path*",
    "/team-member/:path*",
    "/settings/:path*",
    "/chat/:path*",
  ],
};