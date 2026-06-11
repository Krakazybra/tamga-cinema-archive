import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbPersonToPerson } from '@/lib/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const role = searchParams.get('role')

  if (slug) {
    const dbPerson = await db.person.findUnique({ where: { slug } }).catch(() => null)
    if (!dbPerson) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbPersonToPerson(dbPerson))
  }

  const dbRows = await db.person.findMany().catch(() => [])
  const persons = dbRows.map(dbPersonToPerson)
  const result = role ? persons.filter((p) => p.role === role) : persons
  return NextResponse.json(result.sort((a, b) => {
    const an = typeof a.name === 'string' ? a.name : a.name.ru
    const bn = typeof b.name === 'string' ? b.name : b.name.ru
    return an.localeCompare(bn)
  }))
}
