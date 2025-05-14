import { initializeLucia } from "@/auth/lucia";

export const runtime = "edge";

export async function POST(request: Request) {
  const auth = initializeLucia();
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login"
      }
    });
  }

  try {
    // Validate the session
    const { session } = await auth.validateSession(sessionId);

    if (session) {
      // Invalidate the session
      await auth.invalidateSession(session.id);
    }

    // Create a blank session cookie to clear the current one
    const sessionCookie = auth.createBlankSessionCookie();

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": sessionCookie.serialize()
      }
    });
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, try to clear the cookie
    const sessionCookie = auth.createBlankSessionCookie();

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": sessionCookie.serialize()
      }
    });
  }
}
