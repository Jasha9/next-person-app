// app/components/navbar.tsx
import { auth } from "@/actions/auth/auth";
import { syncUser } from "@/actions/payload/users";
import { SignInButton } from "@/app/(frontend)/components/signin-button";
import SignoutButton from "@/app/(frontend)/components/signout-button";
import ThemeToggle from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  if (session?.user) {
    await syncUser(session.user);
  }

  return (
    <nav className="bg-background shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center">
              <Search className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="ml-2 text-lg font-semibold text-foreground">
                User Search
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {session.user.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {session.user.name}
                </span>

                <SignoutButton />
              </div>
            ) : (
              <SignInButton />
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
