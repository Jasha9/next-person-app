import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

/**
 * Routes that are public and don't require authentication
 */
export const publicRoutes = [
  "/",
  "/landing",
  "/about",
]

/**
 * Routes that are used for authentication
 */
export const authRoutes = [
  "/landing"
]

/**
 * The prefix for API authentication routes
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard"

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: "/landing",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user data to token
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Add token data to session
        session.user.id = token.id as string
        session.user.name = (token.name as string) ?? ''
        session.user.email = (token.email as string) ?? ''
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isOnAuthRoute = authRoutes.includes(nextUrl.pathname);
      const isOnApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

      if (isOnApiAuthRoute) return true;
      
      if (isOnAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return true;
      }

      if (isOnPublicRoute) return true;

      if (!isLoggedIn) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
          callbackUrl += nextUrl.search;
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(new URL(`/landing?callbackUrl=${encodedCallbackUrl}`, nextUrl));
      }

      return true;
    }
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig
