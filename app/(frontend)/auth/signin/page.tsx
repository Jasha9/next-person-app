import { auth } from '@/actions/auth/auth';
import { SignInForm } from '@/app/(frontend)/components/signin-form';
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
