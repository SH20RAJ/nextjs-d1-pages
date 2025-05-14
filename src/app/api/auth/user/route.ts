import { initializeLucia } from "@/auth/lucia";

export const runtime = "edge";

export async function GET(request: Request) {
  const auth = initializeLucia();
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return Response.json({ user: null }, { status: 200 });
  }

  try {
    const { user, session } = await auth.validateSession(sessionId);

    // If session is active but idle, extend it
    if (session && session.fresh) {
      const sessionCookie = auth.createSessionCookie(session.id);

      return new Response(
        JSON.stringify({
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": sessionCookie.serialize()
          }
        }
      );
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Clear the invalid session cookie
    const sessionCookie = auth.createBlankSessionCookie();

    return new Response(
      JSON.stringify({ user: null }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": sessionCookie.serialize()
        }
      }
    );
  }
}
