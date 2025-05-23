'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { addUser, updateUser } from '../actions/actions'
import { User, UserFormData, userFormSchema } from '../actions/schemas'
import { UserForm } from './user-form'

interface UserDialogFormProps {
  mode: 'create' | 'edit'
  user?: User
  trigger?: React.ReactNode
  onSuccess?: (user: User) => void
}

export function UserDialogForm({
  mode,
  user,
  trigger,
  onSuccess,
}: UserDialogFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues:
      mode === 'edit' && user
        ? {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
          }
        : {
            name: '',
            email: '',
            phoneNumber: '',
            profilePicture: '',
          },
  })

  const onSubmit = async (data: UserFormData) => {
    try {
      const result =
        mode === 'create'
          ? await addUser(data)
          : await updateUser(user!.id, data)

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Something went wrong',
        })
        return
      }

      toast({
        title: 'Success',
        description: `User ${mode === 'create' ? 'created' : 'updated'} successfully`,
      })

      setOpen(false)
      form.reset()

      if (result.data && onSuccess) {
        onSuccess(result.data)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={mode === 'create' ? 'default' : 'secondary'}>
            {mode === 'create' ? 'Add User' : 'Edit User'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-auto max-h-[85vh] flex-col sm:max-w-[425px]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === 'create' ? 'Create User' : 'Edit User'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new user to the system.'
              : 'Edit user information.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserForm form={form} />
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? 'Saving...'
                  : mode === 'create'
                    ? 'Create User'
                    : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
