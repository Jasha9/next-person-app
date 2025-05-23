'use client'

import * as React from "react"
import { SearchCommand } from "@/components/search-command"
import { searchUsers } from '@/actions/actions'
import { useToast } from "@/hooks/use-toast"
import { User } from '@/actions/schemas'

export default function SearchInput() {
  const { toast } = useToast()

  const handleSearch = React.useCallback(async (value: string) => {
    if (!value) return []
    
    try {
      const users = await searchUsers(value)
      // Ensure all required fields are non-null strings
      return users.map((user: User) => ({
        id: user.id,
        name: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? ""
      }))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: error instanceof Error ? error.message : 'Failed to search users'
      })
      return []
    }
  }, [toast])

  const handleSelect = React.useCallback((user: User) => {
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('userId', user.id)
    window.history.pushState({}, '', url.toString())
    
    // Refresh the page to show the selected user
    window.location.reload()
  }, [])

  return (
    <div className="w-full">
      <div className="relative">
        <SearchCommand<User>
          onSearch={handleSearch}
          onItemSelect={handleSelect}
          getItemId={(user) => user.id}
          getItemLabel={(user) => user.name}
          getItemDescription={(user) => user.email}
          placeholder="Search users by name, email, or phone..."
          noResultsText="No users found. Try a different search term."
          className="w-full"
        />
      </div>
    </div>
  )
}
