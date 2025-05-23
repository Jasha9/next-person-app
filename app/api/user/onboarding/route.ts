import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { updateUser } from '@/app/actions/actions'

export async function PUT(request: NextRequest) {
  try {
    // Get current user from session
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Update user with onboarding data
    const result = await updateUser(session.user.id, {
      ...body,
      hasCompletedOnboarding: true // Mark onboarding as complete
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}