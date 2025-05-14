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
    const { session } = await auth.validateSession(sessionId);
    
    if (session) {
      await auth.invalidateSession(session.id);
    }
    
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
    return Response.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
