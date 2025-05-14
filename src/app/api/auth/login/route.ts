import { initializeLucia } from "@/auth/lucia";
import { LuciaError } from "lucia";

export const runtime = "edge";

export async function POST(request: Request) {
  const auth = initializeLucia();
  const formData = await request.json();
  const { email, password } = formData;

  // Validate input
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.includes("@") ||
    password.length < 6
  ) {
    return Response.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  try {
    // Find user by email and verify password
    const key = await auth.useKey("email", email, password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {}
    });

    const sessionCookie = auth.createSessionCookie(session.id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
        "Set-Cookie": sessionCookie.serialize()
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error instanceof LuciaError &&
      (error.message === "AUTH_INVALID_KEY_ID" ||
       error.message === "AUTH_INVALID_PASSWORD")
    ) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return Response.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
