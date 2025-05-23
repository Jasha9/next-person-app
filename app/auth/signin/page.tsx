import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { SignInForm } from "@/app/components/signin-form";

export const metadata: Metadata = {
  title: "Sign In - Person Search App",
  description: "Sign in to your account",
};

export default async function SignInPage({
  searchParams = {},
}: {
  searchParams?: Record<string, string>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  
  const callbackUrl = typeof searchParams?.callbackUrl === 'string' 
    ? searchParams.callbackUrl 
    : undefined;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}