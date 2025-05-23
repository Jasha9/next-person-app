'use client'

import * as React from "react"
import { SearchCommand } from "@/components/search-command"
import { searchUsers } from '@/app/actions/actions'
import { User } from "../actions/schemas"
import UserActions from './user-actions'

export default function SearchInput() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

  const handleSearch = React.useCallback(async (value: string) => {
    if (!value?.trim()) {
      return []
    }
    
    try {
      const users = await searchUsers(value)
      if (!users || !Array.isArray(users)) {
        console.error('Invalid response format:', users)
        return []
      }
      
      return users.map(user => ({
        ...user,
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        profilePicture: user.profilePicture ?? null,
        hasCompletedOnboarding: user.hasCompletedOnboarding
      })) as User[]
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }, [])

  const handleSelect = React.useCallback((user: User) => {
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('userId', user.id)
    window.history.pushState({}, '', url.toString())
    setSelectedUser(user)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <SearchCommand<User>
        onSearch={handleSearch}
        onItemSelect={handleSelect}
        getItemId={(user) => user.id}
        getItemLabel={(user) => user.name ?? ""}
        placeholder="Search users..."
        noResultsText="No users found."
      />
      {selectedUser && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">User Details</h2>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
          <UserActions userId={selectedUser.id} />
        </div>
      )}
    </div>
  )
}