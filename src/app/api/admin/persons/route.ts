import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbPersonToPerson } from '@/lib/content'
import { requireAdmin, ensureArray, safeInt } from '@/lib/admin-auth'

export async function GET() {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  try {
    const persons = await db.person.findMany({ orderBy: { nameRu: 'asc' } })
    return NextResponse.json(persons.map(dbPersonToPerson))
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
    const person = await db.person.create({
      data: {
        slug: body.slug,
        nameKk: String((body.name as Record<string,string>)?.kk ?? ''),
        nameRu: String((body.name as Record<string,string>)?.ru ?? ''),
        nameEn: String((body.name as Record<string,string>)?.en ?? ''),
        role: String(body.role ?? 'director'),
        bioKk: String((body.bio as Record<string,string>)?.kk ?? ''),
        bioRu: String((body.bio as Record<string,string>)?.ru ?? ''),
        bioEn: String((body.bio as Record<string,string>)?.en ?? ''),
        birthYear: safeInt(body.birthYear),
        deathYear: body.deathYear ? safeInt(body.deathYear) : null,
        photo: String(body.photo ?? ''),
        films: JSON.stringify(ensureArray(body.films)),
        featured: Boolean(body.featured),
      },
    })
    return NextResponse.json(dbPersonToPerson(person), { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Unique constraint')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
