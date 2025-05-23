'use client'

import { updateUser } from '@/app/actions/actions'
import { userFormSchema, User, UserFormData } from '@/app/actions/schemas'
import { UserForm } from './user-form'
import MutableDialog, { ActionState } from '@/components/mutable-dialog'

interface UserEditDialogProps {
  user: User
}

export function UserEditDialog({ user }: UserEditDialogProps) {  
  const handleEditUser = async (data: UserFormData): Promise<ActionState<User>> => {
    try {
      const formData = {
        ...data,
        hasCompletedOnboarding: Boolean(data.hasCompletedOnboarding)
      }
      
      const result = await updateUser(user.id, formData)
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update user')
      }
      return {
        success: true,
        message: `User ${result.data.name} updated successfully`,
        data: result.data
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user',
      }
    }
  }

  return (
    <MutableDialog<UserFormData>
      formSchema={userFormSchema}
      FormComponent={UserForm}
      action={handleEditUser}
      triggerButtonLabel="Edit"
      editDialogTitle={`Edit ${user.name ?? ''}`}
      dialogDescription={`Update the details of ${user.name ?? ''} below.`}
      submitButtonLabel="Save Changes"
      defaultValues={{
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        hasCompletedOnboarding: Boolean(user.hasCompletedOnboarding),
        occupation: user.occupation,
        organization: user.organization,
        preferredLanguage: user.preferredLanguage
      }}
    />
  )
}
