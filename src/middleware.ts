export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/boards/:path*",
    "/settings/:path*",
  ],
};