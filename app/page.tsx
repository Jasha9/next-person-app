import { auth } from "./auth"
import { redirect } from "next/navigation"

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: Props) {
  const session = await auth()
  
  if (session?.user) {
    redirect("/dashboard")
  }
  
  redirect("/landing")
}
