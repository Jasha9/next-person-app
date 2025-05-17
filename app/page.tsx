import { UserDataTable } from '@/app/components/user-data-table'
import { Button } from '@/components/ui/button'
import { Plus as PlusIcon } from 'lucide-react'
import { TechnicalOverview } from './components/technical-overview'
import { UserDialogForm } from './components/user-dialog-form'
import UserSearch from './components/user-search'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <UserDialogForm
          mode="create"
          trigger={
            <Button size="lg" className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add User
            </Button>
          }
        />
      </div>
      <div className="grid gap-8">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Search Person</h2>
          <UserSearch searchParams={searchParams} />
          <UserDataTable searchParams={searchParams} />
        </div>
        <TechnicalOverview />
      </div>
    </div>
  )
}
