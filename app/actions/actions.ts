//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { prisma } from '../../lib/prisma'
import { User, userSchema } from './schemas'

export const searchUsers = cache(async (query: string) => {
  try {
    // Handle empty query case
    if (!query) {
      return []
    }

    // Ensure prisma client is initialized
    if (!prisma) {
      throw new Error('Database client not initialized')
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phoneNumber: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10, // Limit results to 10
      orderBy: {
        // Order by relevance
        name: 'asc',
      },
      // Return limited fields to reduce payload size
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    })

    return users.map((user) => ({
      ...user,
      name: user.name ?? '',
      email: user.email ?? '',
      phoneNumber: user.phoneNumber ?? '',
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
      where: { email: validatedUser.email },
    })

    if (existingUser) {
      return { success: false, error: 'Email already exists' }
    }

    const user = await prisma.user.create({
      data: {
        name: validatedUser.name,
        email: validatedUser.email,
        phoneNumber: validatedUser.phoneNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
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

    // Format the data for Prisma update
    const updateData = {
      ...(data.name && { name: { set: data.name } }),
      ...(data.email && { email: { set: data.email } }),
      ...(data.phoneNumber && { phoneNumber: { set: data.phoneNumber } }),
      ...(data.profilePicture && {
        profilePicture: { set: data.profilePicture },
      }),
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
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
        profilePicture: user.profilePicture ?? null,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user',
    }
  }
}

export const getUserById = cache(async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return null

  return {
    ...user,
    name: user.name ?? '',
    email: user.email ?? '',
    phoneNumber: user.phoneNumber ?? '',
  }
})

export const getUsers = cache(async (page: number, limit: number) => {
  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    })

    const totalUsers = await prisma.user.count()

    return {
      data: users,
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
