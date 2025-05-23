import { authConfig } from "@/actions/auth/auth.config";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
