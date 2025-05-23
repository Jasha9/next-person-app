//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { prisma } from '../../lib/prisma'
import { User, userSchema } from './schemas'

export const searchUsers = cache(async (query: string) => {
  try {
    // Handle empty query case
    if (!query) return []
    // Ensure prisma client is initialized
    if (!prisma) throw new Error('Database client not initialized')

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10, // Limit results to 10
<<<<<<< HEAD
      orderBy: { name: 'asc' },
      // Return limited fields to reduce payload size
=======
      orderBy: {
        // Order by relevance
        name: 'asc',
      }, // Return limited fields to reduce payload size
>>>>>>> d9a03011bb34b8887525a2353b1e12ec9ec55b57
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        hasCompletedOnboarding: true,
      },
    })

    return users.map((user) => ({
      ...user,
      name: user.name ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
      profilePicture: user.profilePicture,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    }))
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
})

export async function addUser(
  data: Omit<User, 'id'>
): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    // Validate data with schema
    const validatedUser = userSchema.parse({ ...data, id: crypto.randomUUID() })

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedUser.email ?? undefined },
    })

    if (existingUser) {
      return { success: false, error: 'Email already exists' }
    }

    const user = await prisma.user.create({
      data: {
<<<<<<< HEAD
        name: validatedUser.name ?? null,
        email: validatedUser.email ?? null,
        phoneNumber: validatedUser.phoneNumber ?? null,
        hasCompletedOnboarding: validatedUser.hasCompletedOnboarding,
        occupation: validatedUser.occupation ?? null,
        organization: validatedUser.organization ?? null,
        preferredLanguage: validatedUser.preferredLanguage ?? null,
=======
        name: validatedUser.name,
        email: validatedUser.email,
        phoneNumber: validatedUser.phoneNumber,
        profilePicture: validatedUser.profilePicture,
>>>>>>> d9a03011bb34b8887525a2353b1e12ec9ec55b57
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        hasCompletedOnboarding: true,
        occupation: true,
        organization: true,
        preferredLanguage: true,
      },
    })

    revalidatePath('/')
<<<<<<< HEAD
=======
    
>>>>>>> d9a03011bb34b8887525a2353b1e12ec9ec55b57
    return {
      success: true,
      data: {
        ...user,
        name: user.name ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        profilePicture: user.profilePicture,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        occupation: user.occupation ?? '',
        organization: user.organization ?? '',
        preferredLanguage: user.preferredLanguage,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
    }
  }
}

export async function deleteUser(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user',
    }
  }
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, 'id'>>
): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    // If email is being updated, check if it already exists
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [{ email: data.email }, { id: { not: id } }],
        },
      })

      if (existingUser) {
        return { success: false, error: 'Email already exists' }
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
        ...(data.profilePicture !== undefined && { profilePicture: data.profilePicture }),
        ...(data.hasCompletedOnboarding !== undefined && { hasCompletedOnboarding: data.hasCompletedOnboarding }),
        ...(data.occupation !== undefined && { occupation: data.occupation }),
        ...(data.organization !== undefined && { organization: data.organization }),
        ...(data.preferredLanguage !== undefined && { preferredLanguage: data.preferredLanguage }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        hasCompletedOnboarding: true,
        occupation: true,
        organization: true,
        preferredLanguage: true,
      },
    })

    revalidatePath('/')
    return {
      success: true,
      data: {
        ...user,
        name: user.name ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        profilePicture: user.profilePicture,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        occupation: user.occupation ?? '',
        organization: user.organization ?? '',
        preferredLanguage: user.preferredLanguage,
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    }
  }
}

export const getUserById = cache(async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      profilePicture: true,
      hasCompletedOnboarding: true,
      occupation: true,
      organization: true,
      preferredLanguage: true,
    },
  })
  
  if (!user) return null

  return {
    ...user,
    name: user.name ?? '',
    email: user.email ?? '',
    phoneNumber: user.phoneNumber ?? '',
    profilePicture: user.profilePicture,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
    occupation: user.occupation ?? '',
    organization: user.organization ?? '',
    preferredLanguage: user.preferredLanguage,
  }
})

export const getUsers = cache(async (page: number, limit: number) => {
  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        hasCompletedOnboarding: true,
        occupation: true,
        organization: true,
        preferredLanguage: true,
      },
    })

    const totalUsers = await prisma.user.count()

    return {
      data: users.map(user => ({
        ...user,
        name: user.name ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        profilePicture: user.profilePicture,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        occupation: user.occupation ?? '',
        organization: user.organization ?? '',
        preferredLanguage: user.preferredLanguage,
      })),
      total: totalUsers,
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      data: [],
      total: 0,
    }
  }
})

export const deleteMultipleUsers = async (ids: string[]) => {
  try {
    await prisma.user.deleteMany({ where: { id: { in: ids } } })
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting users:', error)
  }
}
