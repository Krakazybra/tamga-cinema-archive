import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbPersonToPerson } from '@/lib/content'
import { persons as staticPersons } from '@/data/persons'
import type { Person } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const role = searchParams.get('role')

  if (slug) {
    const dbPerson = await db.person.findUnique({ where: { slug } }).catch(() => null)
    if (dbPerson) return NextResponse.json(dbPersonToPerson(dbPerson))
    const staticPerson = staticPersons.find((p) => p.slug === slug)
    if (!staticPerson) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(staticPerson)
  }

  const dbRows = await db.person.findMany().catch(() => [])
  const dbPersons = dbRows.map(dbPersonToPerson)
  const dbSlugs = new Set(dbPersons.map((p) => p.slug))
  const merged: Person[] = [...dbPersons, ...staticPersons.filter((p) => !dbSlugs.has(p.slug))]

  const result = role ? merged.filter((p) => p.role === role) : merged
  return NextResponse.json(result.sort((a, b) => {
    const an = typeof a.name === 'string' ? a.name : a.name.ru
    const bn = typeof b.name === 'string' ? b.name : b.name.ru
    return an.localeCompare(bn)
  }))
}
