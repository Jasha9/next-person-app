import { redirect } from "next/navigation"
import { Button } from "../../components/ui/button"
import Link from "next/link"
import { SignInButton } from "../components/signin-button"
import { auth } from "../auth"

export default async function LandingPage() {
  const session = await auth()
  
  if (session?.user) {
    return redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Person Search
        </h1>
        <p className="text-xl text-muted-foreground">
          A modern way to manage your contacts
        </p>
        <div className="flex justify-center gap-4">
          <SignInButton />
          <Button variant="outline" asChild>
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}