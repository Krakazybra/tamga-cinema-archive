import { NextResponse } from 'next/server'
import { persons } from '@/data/persons'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const role = searchParams.get('role')

  if (slug) {
    const person = persons.find((p) => p.slug === slug)
    if (!person) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(person)
  }

  const result = role ? persons.filter((p) => p.role === role) : persons
  return NextResponse.json([...result].sort((a, b) => {
    const an = typeof a.name === 'string' ? a.name : a.name.ru
    const bn = typeof b.name === 'string' ? b.name : b.name.ru
    return an.localeCompare(bn)
  }))
}
