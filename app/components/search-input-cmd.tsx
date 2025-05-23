'use client'

import * as React from "react"
import { SearchCommand } from "@/components/search-command"
import { searchUsers } from '@/app/actions/actions'
import { User } from "../actions/schemas"
import { useToast } from "@/hooks/use-toast"

export default function SearchInput() {
  const { toast } = useToast()

  const handleSearch = React.useCallback(async (value: string) => {
    if (!value) return []
    
    try {
      return await searchUsers(value)
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
          getItemLabel={(user) => user.name || 'Unnamed User'}
          getItemDescription={(user) => user.email || 'No email'}
          placeholder="Search users by name, email, or phone..."
          noResultsText="No users found. Try a different search term."
          className="w-full"
        />
      </div>
    </div>
  )
}