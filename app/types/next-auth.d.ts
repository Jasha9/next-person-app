import "next-auth"
import { Language } from '@prisma/client'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      phoneNumber: string | null
      profilePicture: string | null
      hasCompletedOnboarding: boolean
      occupation: string | null
      organization: string | null
      preferredLanguage: Language | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name: string | null
    email: string | null
    phoneNumber: string | null
    profilePicture: string | null
    hasCompletedOnboarding: boolean
    occupation: string | null
    organization: string | null
    preferredLanguage: Language | null
  }
}
