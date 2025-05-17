'use client'

import { deleteUser } from '@/app/actions/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { Trash } from 'lucide-react'

export default function DeleteButton({
  userId,
  trigger,
}: {
  userId: string
  trigger?: React.ReactNode
}) {
  const handleDelete = async () => {
    try {
      console.log('DeleteButton: Attempting to delete user with ID', userId)
      await deleteUser(userId)
      toast({
        title: 'User Deleted',
        description: `A user with the ID ${userId} has been deleted.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('DeleteButton: Error deleting user', error)
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the user.',
        variant: 'destructive',
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive">
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete user with the ID {userId}? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
