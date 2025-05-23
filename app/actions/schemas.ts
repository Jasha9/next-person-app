// app/actions/schemas.ts

import { z } from 'zod'

export const languageEnum = z.enum(['en', 'es', 'fr', 'de', 'zh', 'ja'])

// Schema for form input
export const userFormSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email({ message: "Invalid email address." }).nullable(),
  phoneNumber: z.string().regex(/^04\d{8}$/, { 
    message: "Phone number must be a valid Australian mobile number (e.g., 0422018632)." 
  }).nullable(),
  profilePicture: z.string().nullable(),
  hasCompletedOnboarding: z.boolean(),
  occupation: z.string().nullable(),
  organization: z.string().nullable(),
  preferredLanguage: languageEnum.nullable(),
}).required({
  hasCompletedOnboarding: true
})

// Schema for database model
export const userSchema = userFormSchema.extend({
  id: z.string()
})

export type User = z.infer<typeof userSchema>
export type UserFormData = z.infer<typeof userFormSchema>
