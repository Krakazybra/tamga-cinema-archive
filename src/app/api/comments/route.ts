import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const filmSlug = new URL(req.url).searchParams.get('filmSlug')
  if (!filmSlug) return NextResponse.json([], { status: 400 })
  const comments = await db.comment.findMany({
    where: { filmSlug },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(comments)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { filmSlug, content } = await req.json()
  if (!filmSlug || !content?.trim())
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (content.length > 2000)
    return NextResponse.json({ error: 'Comment too long (max 2000 chars)' }, { status: 400 })
  const comment = await db.comment.create({
    data: { filmSlug, content: content.trim(), userId: session.user.id! },
    include: { user: { select: { name: true } } },
  })
  return NextResponse.json(comment)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const comment = await db.comment.findUnique({ where: { id } })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const role = (session.user as { role?: string }).role
  const isOwner = comment.userId === session.user.id
  const isMod = role === 'MODERATOR' || role === 'ADMIN'
  if (!isOwner && !isMod) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await db.comment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
