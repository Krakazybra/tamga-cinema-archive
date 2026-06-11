import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbPersonToPersonAdmin } from '@/lib/content'
import { requireAdmin, ensureArray, safeInt } from '@/lib/admin-auth'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Ctx) {
  const check = await requireAdmin()
  if ('error' in check) return check.error
  const { id } = await params
  try {
    const person = await db.person.findUnique({ where: { id } })
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbPersonToPersonAdmin(person))
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

  if (body.slug && (typeof body.slug !== 'string' || !/^[a-z0-9-]+$/.test(body.slug as string))) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  try {
    const person = await db.person.update({
      where: { id },
      data: {
        slug: String(body.slug ?? ''),
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
    return NextResponse.json(dbPersonToPersonAdmin(person))
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
    await db.person.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Record to delete does not exist')) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
