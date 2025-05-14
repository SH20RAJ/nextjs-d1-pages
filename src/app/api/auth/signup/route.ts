import { initializeLucia } from "@/auth/lucia";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

export const runtime = "edge";

export async function POST(request: Request) {
  const auth = initializeLucia();
  const formData = await request.json();
  const { name, email, password } = formData;

  // Validate input
  if (
    typeof name !== "string" ||
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
    // Hash the password
    const hasher = new Argon2id();
    const hashedPassword = await hasher.hash(password);
    const userId = generateId(15);

    // Create user
    await auth.createUser({
      userId,
      attributes: {
        name,
        email
      }
    });

    // Create key for the user (email + password)
    await auth.createKey({
      userId,
      providerId: "email",
      providerUserId: email,
      password: hashedPassword
    });

    // Create session
    const session = await auth.createSession({
      userId,
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
    console.error("Error creating user:", error);
    return Response.json(
      { error: "An error occurred while creating the user" },
      { status: 500 }
    );
  }
}
