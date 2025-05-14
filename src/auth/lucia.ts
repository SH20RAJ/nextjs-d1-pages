import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { d1 } from "@lucia-auth/adapter-sqlite";
import { getRequestContext } from '@cloudflare/next-on-pages';

// Initialize Lucia with D1 adapter
export const initializeLucia = () => {
  const { env } = getRequestContext();
  
  const auth = lucia({
    env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
    middleware: nextjs_future(),
    sessionCookie: {
      expires: false, // for edge runtime
    },
    adapter: d1(env.DB, {
      user: "auth_user",
      key: "user_key",
      session: "user_session"
    }),
    getUserAttributes: (data) => {
      return {
        name: data.name,
        email: data.email
      };
    }
  });

  return auth;
};

export type Auth = ReturnType<typeof initializeLucia>;
