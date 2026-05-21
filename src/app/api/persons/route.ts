import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbPersonToPerson } from '@/lib/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const role = searchParams.get('role')

  if (slug) {
    const person = await db.person.findUnique({ where: { slug } })
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbPersonToPerson(person))
  }

  const where = role ? { role } : {}
  const persons = await db.person.findMany({ where, orderBy: { nameRu: 'asc' } })
  return NextResponse.json(persons.map(dbPersonToPerson))
}
