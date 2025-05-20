import { Metadata } from "next";
import { getProviders, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In - Person Search App",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const providers = await getProviders();

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {providers && Object.values(providers).map((provider) => (
            <div key={provider.id}>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn(provider.id)}
              >
                {provider.id === 'google' && (
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                  </svg>
                )}
                Sign in with {provider.name}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}