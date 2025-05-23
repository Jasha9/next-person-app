'use client'

interface UserSearchWrapperProps {
  children: React.ReactNode
}

export function UserSearchWrapper({ children }: UserSearchWrapperProps) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  )
}
