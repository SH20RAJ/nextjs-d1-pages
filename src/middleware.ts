import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { initializeLucia } from "./auth/lucia";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};

export async function middleware(request: NextRequest) {
  const auth = initializeLucia();
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    // If no session and trying to access protected routes, redirect to login
    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/profile");
      
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
  
  try {
    const { user } = await auth.validateSession(sessionId);
    
    // If session is valid but trying to access login/signup pages, redirect to dashboard
    const isAuthRoute = 
      request.nextUrl.pathname === "/login" || 
      request.nextUrl.pathname === "/signup";
      
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Add user info to request headers for use in pages
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // If session is invalid, clear the cookie
    const response = NextResponse.next();
    response.cookies.delete(auth.sessionCookieName);
    return response;
  }
}
