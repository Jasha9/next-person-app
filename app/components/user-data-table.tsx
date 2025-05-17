'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Edit, Eye, Trash } from 'lucide-react'

import { deleteMultipleUsers, getUsers } from '@/app/actions/actions'
import DeleteButton from '@/app/components/delete-button'
import { UserDialogForm } from '@/app/components/user-dialog-form'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { useCallback, useEffect, useState } from 'react'

type User = Awaited<ReturnType<typeof getUsers>>['data'][number]

export function UserDataTable({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [data, setData] = useState<User[]>([])
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  const [userId, setUserId] = useState<string | null>(null)

  const totalPages = Math.ceil(total / limit)

  const columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Avatar>
            {row.original.profilePicture ? (
              <AvatarImage
                src={row.original.profilePicture}
                alt={row.original.name || 'User'}
              />
            ) : (
              <AvatarFallback>
                {row.original.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('') || 'U'}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="font-bold capitalize">{row.getValue('name')}</div>
        </div>
      ),
      maxSize: 50,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      cell: ({ row }) => <p>{row.getValue('phoneNumber')}</p>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="cursor-pointer"
              onClick={() => handleSelect(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <UserDialogForm
              mode="edit"
              user={{
                ...user,
                name: user.name ?? '',
                email: user.email ?? '',
                phoneNumber: user.phoneNumber ?? '',
              }}
              trigger={
                <Button
                  variant="secondary"
                  size="icon"
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              }
              onSuccess={() => {
                fetchData()
              }}
            />
            <DeleteButton
              userId={user.id}
              trigger={
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        )
      },
    },
  ]

  const handleSelect = useCallback((user: User) => {
    // Update URL
    const url = new URL(window.location.href)
    url.searchParams.set('userId', user.id)
    window.history.pushState({}, '', url.toString())

    // Refresh the page to show the selected user
    window.location.reload()
  }, [])

  const handleDeleteMultipleUser = async () => {
    try {
      await deleteMultipleUsers(
        table.getSelectedRowModel().rows.map((row) => row.original.id)
      )
      fetchData()
      toast({
        title: 'User Deleted',
        description: `Selected users have been deleted.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('Error deleting users:', error)
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the selected users.',
        variant: 'destructive',
      })
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await getUsers(page, limit)
      setData(res.data)
      setTotal(res.total)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  useEffect(() => {
    const fetchUserId = async () => {
      const params = await searchParams
      setUserId(params.userId || null)
    }
    fetchUserId()
  }, [searchParams])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="mt-4 rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead>
                  {flexRender(
                    headerGroup.headers[0].column.columnDef.header,
                    headerGroup.headers[0].getContext()
                  )}
                </TableHead>
                {table.getSelectedRowModel().rows.length > 0 ? (
                  <>
                    <TableHead className="font-medium">
                      {table.getSelectedRowModel().rows.length} selected
                    </TableHead>
                    <TableHead colSpan={headerGroup.headers.length - 3} />
                    <TableHead className="flex items-center justify-center">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="m-8 h-8"
                          >
                            <Trash className="h-3 w-3 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete selected users?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteMultipleUser}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableHead>
                  </>
                ) : (
                  headerGroup.headers.slice(1).map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                {Array.from({ length: columns.length }).map((_, index) => (
                  <TableCell key={index}>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="w-1/2 space-y-2">
                        <Skeleton className="h-4" />
                        <Skeleton className="h-4" />
                      </div>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    (row.getIsSelected() || row.original.id === userId) &&
                    'selected'
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
