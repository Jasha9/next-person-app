import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

/**
 * Routes that are public and don't require authentication
 */
export const publicRoutes = [
  "/",
  "/landing",
  "/about",
  "/api/auth/error", // Add error route
]

/**
 * Routes that are used for authentication
 */
export const authRoutes = [
  "/landing",
  "/sign-in",
  "/api/auth/signin",
  "/api/auth/callback/google"
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
  debug: true, // Enable debug mode temporarily
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  ],
  pages: {
    signIn: "/landing",
    error: "/api/auth/error", // Add error page
  },
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? null,
              profilePicture: user.image ?? null,
            },
          });
        }
        
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session }) {
      try {
        if (session.user) {
          const user = await prisma.user.findUnique({
            where: { email: session.user.email ?? undefined },
          });
          
          if (user) {
            session.user.id = user.id;
            session.user.name = user.name ?? null;
          }
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return session;
      }
    },
    async authorized({ auth, request: { nextUrl } }) {
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
        const callbackUrl = nextUrl.pathname + nextUrl.search;
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return Response.redirect(new URL(`/landing?callbackUrl=${encodedCallbackUrl}`, nextUrl));
      }

      return true;
    }
  },
} satisfies NextAuthConfig
