import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbTimelineEventToTimelineEventAdminAdmin } from '@/lib/content'
import { requireAdmin, safeInt } from '@/lib/admin-auth'

export async function GET() {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  try {
    const events = await db.timelineEvent.findMany({ orderBy: { year: 'asc' } })
    return NextResponse.json(events.map(dbTimelineEventToTimelineEventAdmin))
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const slug = String(body.slug ?? body.id ?? '')
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug/id' }, { status: 400 })
  }
  if (!body.year) return NextResponse.json({ error: 'year required' }, { status: 400 })

  try {
    const evt = await db.timelineEvent.create({
      data: {
        slug,
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
    return NextResponse.json(dbTimelineEventToTimelineEventAdmin(evt), { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Unique constraint')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
