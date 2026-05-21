import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ count: 0, items: [] })
  const notifications = await db.notification.findMany({
    where: { userId: session.user.id! },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  const unread = notifications.filter((n) => !n.read).length
  return NextResponse.json({ count: unread, items: notifications })
}

export async function PATCH() {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await db.notification.updateMany({
    where: { userId: session.user.id!, read: false },
    data: { read: true },
  })
  return NextResponse.json({ ok: true })
}
