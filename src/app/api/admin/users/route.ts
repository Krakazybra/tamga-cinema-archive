import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || role !== 'ADMIN') return null
  return session
}

export async function GET() {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}

export async function PATCH(req: Request) {
  const session = await checkAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, role } = await req.json()
  if (!id || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const allowed = ['USER', 'MODERATOR']
  if (!allowed.includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

  if (id === session.user.id) return NextResponse.json({ error: 'Cannot change own role' }, { status: 400 })

  const user = await db.user.update({ where: { id }, data: { role } })
  return NextResponse.json({ ok: true, role: user.role })
}
