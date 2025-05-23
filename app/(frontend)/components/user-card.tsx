'use client'

import { User } from '@/actions/schemas'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Edit, Mail, Phone } from 'lucide-react'
import { UserDialogForm } from './user-dialog-form'
import DeleteButton from '@/app/(frontend)/components/delete-button'

interface UserCardProps {
  user: User
}

export default function UserCard({ user }: UserCardProps) {
  if (!user || !user.name) {
    return <p>Error: Invalid user data</p>
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.profilePicture ? (
            <AvatarImage
              src={user.profilePicture}
              alt={user.name}
              className="aspect-square h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <Badge variant="secondary" className="mt-1 w-fit">
            ID: {user.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{user.phoneNumber}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <UserDialogForm
          mode="edit"
          user={user}
          trigger={
            <Button variant="secondary">
              <Edit className="h-4 w-4" /> Edit
            </Button>
          }
        />

        <DeleteButton userId={user.id} />
      </CardFooter>
    </Card>
  )
}
