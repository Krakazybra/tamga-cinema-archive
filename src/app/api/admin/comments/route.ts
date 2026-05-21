import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminOrModerator } from '@/lib/admin-auth'

export async function GET() {
  const check = await requireAdminOrModerator()
  if ('error' in check) return check.error

  try {
    const comments = await db.comment.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(comments)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const check = await requireAdminOrModerator()
  if ('error' in check) return check.error

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    await db.comment.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Record to delete does not exist')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
