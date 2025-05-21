import { getUsers } from '@/app/actions/actions'
import { UserDataTable } from '@/app/components/user-data-table'
import { Button } from '@/components/ui/button'
import { Plus as PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { auth } from '../auth'
import { TechnicalOverview } from '../components/technical-overview'
import { UserDialogForm } from '../components/user-dialog-form'
import UserSearch from '../components/user-search'

type SearchParams = {
  userId?: string
  page?: string
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const session = await auth()
  const userId = searchParams.userId as string | undefined
  const page = searchParams.page ? parseInt(searchParams.page) : 1

  if (!session?.user) {
    redirect('/')
  }

  const limit = 10

  const { data, total } = await getUsers(page, limit)

  console.log(data)

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
          <UserSearch searchParams={{ userId }} />
          <UserDataTable
            selectedUserId={userId}
            data={data}
            total={total}
            page={page}
            limit={limit}
          />
        </div>
        <TechnicalOverview />
      </div>
    </div>
  )
}
