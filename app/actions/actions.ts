//app/actions/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'
import { User, userSchema } from './schemas'
import { cache } from 'react'

export const searchUsers = cache(async (query: string) => {
  // Handle empty query case
  if (!query) {
    return []
  }

  return prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phoneNumber: { contains: query, mode: 'insensitive' } },
      ],
    },
    // Return limited fields to reduce payload size
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
    },
  })
})

export async function addUser(data: Omit<User, 'id'>): Promise<{ success: boolean; data?: User; error?: string }> {
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
    })
    
    revalidatePath('/')
    return { success: true, data: user }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create user' 
    }
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete user' 
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
          AND: [
            { email: data.email },
            { id: { not: id } }
          ]
        }
      })
      
      if (existingUser) {
        return { success: false, error: 'Email already exists' }
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    })
    
    revalidatePath('/')
    return { success: true, data: user }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update user' 
    }
  }
}

export const getUserById = cache(async (id: string) => {
  return prisma.user.findUnique({ where: { id } })
})