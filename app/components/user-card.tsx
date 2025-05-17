'use client'

import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Phone, Mail } from 'lucide-react'
import { User } from '@/app/actions/schemas'
import { UserDialogForm } from './user-dialog-form'
import { deleteUser } from '../actions/actions'
import { useToast } from '@/hooks/use-toast'
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
} from "@/components/ui/alert-dialog"

interface UserCardProps {
  user: User
  onDelete?: () => void
  onUpdate?: (updatedUser: User) => void
}

export default function UserCard({ user, onDelete, onUpdate }: UserCardProps) {
  const { toast } = useToast()

  if (!user || !user.name) {
    return <p>Error: Invalid user data</p>;
  }

  const handleDelete = async () => {
    try {
      const result = await deleteUser(user.id)
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || 'Failed to delete user'
        })
        return
      }

      toast({
        title: "Success",
        description: "User deleted successfully"
      })

      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete user'
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">      
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          {user.profilePicture ? (
            <AvatarImage 
              src={user.profilePicture} 
              alt={user.name}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback>{user.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mt-1">ID: {user.id}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <UserDialogForm 
          mode="edit" 
          user={user}
          onSuccess={onUpdate}
          trigger={<Button variant="secondary">Edit</Button>}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {user.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}