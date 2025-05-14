import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { getRequestContext } from '@cloudflare/next-on-pages';

// Initialize Lucia with D1 adapter
export const initializeLucia = () => {
  const { env } = getRequestContext();

  // Create D1 adapter
  const adapter = new D1Adapter(
    env.DB,
    {
      user: "auth_user",
      session: "user_session",
      key: "user_key"
    }
  );

  // Initialize Lucia
  const auth = new Lucia(adapter, {
    sessionCookie: {
      // This sets cookies with super long expiration
      // since Next.js edge runtime doesn't support
      // "expires" in cookies
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production"
      }
    },
    getUserAttributes: (attributes) => {
      return {
        name: attributes.name,
        email: attributes.email
      };
    }
  });

  return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;
