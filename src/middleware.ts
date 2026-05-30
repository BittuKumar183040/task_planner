export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/boards/:path*",
    "/teamboard/:path*",
    "/settings/:path*",
  ],
};