import { NextResponse } from 'next/server'
import { films } from '@/data/films'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const featured = searchParams.get('featured')

  if (slug) {
    const film = films.find((f) => f.slug === slug)
    if (!film) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(film)
  }

  const result = featured === 'true' ? films.filter((f) => f.featured) : films
  return NextResponse.json([...result].sort((a, b) => b.year - a.year))
}
