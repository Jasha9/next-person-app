import UserSearch from '../components/user-search';
import { TechnicalOverview } from '../components/technical-overview';
import { UserDialogForm } from '../components/user-dialog-form';
import { Button } from '@/components/ui/button';
import { Plus as PlusIcon } from 'lucide-react';
import { auth } from "../auth"
import { redirect } from "next/navigation"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await auth()
  const userId = searchParams.userId as string | undefined
  
  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <UserDialogForm 
          mode="create" 
          trigger={
            <Button size="lg" className="gap-2">
              <PlusIcon className="w-4 h-4" />
              Add User
            </Button>
          }
        />
      </div>
      <div className="grid gap-8">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Search Person</h2>
          <UserSearch searchParams={{ userId }} />
        </div>
        <TechnicalOverview />
      </div>
    </div>
  );
}
