import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { D1Adapter } from "@auth/d1-adapter";
import { getRequestContext } from '@cloudflare/next-on-pages';

// Define the authentication configuration
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Configure one or more authentication providers
  providers: [
    // GitHub provider
    GitHub({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // Google provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Use D1 adapter for Cloudflare D1
  adapter: {
    // @ts-ignore - The D1Adapter type doesn't match exactly what NextAuth expects
    // but it works at runtime
    async createAdapter() {
      const { env } = getRequestContext();
      return D1Adapter(env.AUTH_DB);
    }
  },
  // Configure session strategy for edge runtime
  session: {
    strategy: "jwt",
  },
  // Custom pages
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  // Callbacks
  callbacks: {
    // Customize the JWT token
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          userId: user.id,
        };
      }
      return token;
    },
    // Customize the session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});

// Export the auth middleware
export const config = {
  // Match all request paths except for the ones starting with:
  // - api/auth (API routes for authentication)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
