import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbCollectionToCollection } from '@/lib/content'
import { requireAdmin, ensureArray } from '@/lib/admin-auth'

export async function GET() {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  try {
    const collections = await db.collection.findMany({ orderBy: { titleRu: 'asc' } })
    return NextResponse.json(collections.map(dbCollectionToCollection))
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  if (!body.slug || typeof body.slug !== 'string' || !/^[a-z0-9-]+$/.test(body.slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  try {
    const col = await db.collection.create({
      data: {
        slug: body.slug,
        titleKk: String((body.title as Record<string,string>)?.kk ?? ''),
        titleRu: String((body.title as Record<string,string>)?.ru ?? ''),
        titleEn: String((body.title as Record<string,string>)?.en ?? ''),
        descriptionKk: String((body.description as Record<string,string>)?.kk ?? ''),
        descriptionRu: String((body.description as Record<string,string>)?.ru ?? ''),
        descriptionEn: String((body.description as Record<string,string>)?.en ?? ''),
        curatorNotesKk: String((body.curatorNotes as Record<string,string>)?.kk ?? ''),
        curatorNotesRu: String((body.curatorNotes as Record<string,string>)?.ru ?? ''),
        curatorNotesEn: String((body.curatorNotes as Record<string,string>)?.en ?? ''),
        cover: String(body.cover ?? ''),
        films: JSON.stringify(ensureArray(body.films)),
        era: String(body.era ?? ''),
      },
    })
    return NextResponse.json(dbCollectionToCollection(col), { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Unique constraint')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
