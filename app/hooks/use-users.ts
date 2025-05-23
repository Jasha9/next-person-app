'use client'

import { getUsers } from '@/app/actions/actions'
import { useEffect, useState } from 'react'

type Result = Awaited<ReturnType<typeof getUsers>>
type User = Result['data'][number]

export function useUsers(page: number, limit: number, refreshKey: number = 0) {
  const [data, setData] = useState<User[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getUsers(page, limit)
      .then((res) => {
        setData(res.data)
        setTotal(res.total)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, limit, refreshKey])

  return { data, total, loading }
}
