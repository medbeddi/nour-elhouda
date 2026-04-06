import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const writeRoutes = ["/dashboard/entrees/new", "/dashboard/paiements/new", "/dashboard/achats/new"];
    const isWriteRoute = writeRoutes.some((r) => path.includes(r));

    if (isWriteRoute && token?.role === "PROPRIETAIRE") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/api/(clients|entrees|paiements|achats)/:path*"],
};
