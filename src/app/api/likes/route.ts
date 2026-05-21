import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { filmSlug } = await req.json()
  const existing = await db.like.findUnique({
    where: { filmSlug_userId: { filmSlug, userId: session.user.id! } },
  })
  if (existing) {
    await db.like.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }
  await db.like.create({ data: { filmSlug, userId: session.user.id! } })
  return NextResponse.json({ liked: true })
}

export async function GET(req: Request) {
  const filmSlug = new URL(req.url).searchParams.get('filmSlug')
  if (!filmSlug) return NextResponse.json({ count: 0, liked: false })
  const session = await auth()
  const count = await db.like.count({ where: { filmSlug } })
  const liked = session?.user
    ? !!(await db.like.findUnique({
        where: { filmSlug_userId: { filmSlug, userId: session.user.id! } },
      }))
    : false
  return NextResponse.json({ count, liked })
}
