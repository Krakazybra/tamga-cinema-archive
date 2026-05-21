'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface Notification {
  id: string
  message: string
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<Notification[]>([])

  const fetchNotifications = async () => {
    if (!session?.user) return
    const res = await fetch('/api/notifications')
    if (res.ok) {
      const data = await res.json()
      setCount(data.count)
      setItems(data.items)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [session])

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' })
    setCount(0)
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!session?.user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[rgb(var(--primary))]">
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="font-semibold text-sm">Уведомления</span>
          {count > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-auto py-1">
              Прочитать все
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <div className="px-3 py-4 text-sm text-center text-[rgb(var(--muted))]">
            Нет новых уведомлений
          </div>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start gap-1 px-3 py-2 ${!n.read ? 'bg-[rgb(var(--surface))]' : ''}`}
            >
              <span className="text-sm">{n.message}</span>
              <span className="text-xs text-[rgb(var(--muted))]">
                {new Date(n.createdAt).toLocaleDateString('ru')}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
