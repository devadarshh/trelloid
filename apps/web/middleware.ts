import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  const isOnPublicRoute = isPublicRoute(req);
  const isOnSelectOrgPage = req.nextUrl.pathname === "/select-org";

  //  Not logged in and on a private route → redirect to sign-in
  if (!userId && !isOnPublicRoute) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Logged in, no org, and not already on /select-org → redirect to /select-org
  if (userId && !orgId && !isOnSelectOrgPage) {
    const orgSelectionUrl = new URL("/select-org", req.url);
    return NextResponse.redirect(orgSelectionUrl);
  }

  // Logged in and on public route → redirect to org or /select-org
  if (userId && isOnPublicRoute) {
    const destination = orgId ? `/organization/${orgId}` : "/select-org";
    const redirectUrl = new URL(destination, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
