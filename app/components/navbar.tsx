// app/components/navbar.tsx
'use client'

import Link from 'next/link';
import { Search, Moon, Sun, User, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Search className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="ml-2 text-lg font-semibold text-foreground">User Search</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session?.user ? (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{session.user.name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-foreground">
                  {session.user.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  title="Sign Out"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => signIn('google')}
                className="flex items-center gap-2"
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
