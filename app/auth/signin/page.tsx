import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { SignInForm } from "@/app/components/signin-form";

export const metadata: Metadata = {
  title: "Sign In - Person Search App",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <SignInForm />
    </div>
  );
}