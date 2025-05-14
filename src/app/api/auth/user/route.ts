import { initializeLucia } from "@/auth/lucia";

export const runtime = "edge";

export async function GET(request: Request) {
  const auth = initializeLucia();
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;
  
  if (!sessionId) {
    return Response.json({ user: null }, { status: 200 });
  }
  
  try {
    const { user } = await auth.validateSession(sessionId);
    return Response.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ user: null }, { status: 200 });
  }
}
