import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbFilmToFilm } from '@/lib/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const featured = searchParams.get('featured')

  if (slug) {
    const dbFilm = await db.film.findUnique({ where: { slug } }).catch(() => null)
    if (!dbFilm) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbFilmToFilm(dbFilm))
  }

  const dbRows = await db.film.findMany({ orderBy: { year: 'desc' } }).catch(() => [])
  const result = featured === 'true' ? dbRows.filter((f) => f.featured) : dbRows
  return NextResponse.json(result.map(dbFilmToFilm))
}
