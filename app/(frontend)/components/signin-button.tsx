'use client';

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  callbackUrl?: string;
  children?: React.ReactNode;
}

export function SignInButton({ callbackUrl, children }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleSignIn = () => {
    signIn('google', {
      callbackUrl: callbackUrl || '/dashboard',
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Button size="lg" className="text-lg px-8" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="text-lg px-8"
      onClick={handleSignIn}
    >
      <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
      </svg>
      Sign in with Google
    </Button>
  );
}
