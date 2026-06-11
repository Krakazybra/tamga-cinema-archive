import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbTimelineEventToTimelineEventAdmin } from '@/lib/content'
import { requireAdmin, safeInt } from '@/lib/admin-auth'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  const { id } = await params
  try {
    const evt = await db.timelineEvent.findUnique({ where: { slug: id } })
    if (!evt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbTimelineEventToTimelineEventAdmin(evt))
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  const { id } = await params

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const slug = String(body.slug ?? body.id ?? '')
  if (slug && !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  try {
    const evt = await db.timelineEvent.update({
      where: { slug: id },
      data: {
        slug: slug || undefined,
        year: safeInt(body.year),
        titleKk: String((body.title as Record<string,string>)?.kk ?? ''),
        titleRu: String((body.title as Record<string,string>)?.ru ?? ''),
        titleEn: String((body.title as Record<string,string>)?.en ?? ''),
        descriptionKk: String((body.description as Record<string,string>)?.kk ?? ''),
        descriptionRu: String((body.description as Record<string,string>)?.ru ?? ''),
        descriptionEn: String((body.description as Record<string,string>)?.en ?? ''),
        type: String(body.type ?? 'event'),
        filmSlug: body.filmSlug ? String(body.filmSlug) : null,
        image: body.image ? String(body.image) : null,
        era: String(body.era ?? ''),
      },
    })
    return NextResponse.json(dbTimelineEventToTimelineEventAdmin(evt))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Record to update not found')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (msg.includes('Unique constraint')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  const { id } = await params
  try {
    await db.timelineEvent.delete({ where: { slug: id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Record to delete does not exist')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
