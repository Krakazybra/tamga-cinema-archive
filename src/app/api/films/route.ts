import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbFilmToFilm } from '@/lib/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const featured = searchParams.get('featured')

  if (slug) {
    const film = await db.film.findUnique({ where: { slug } })
    if (!film) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbFilmToFilm(film))
  }

  const where = featured === 'true' ? { featured: true } : {}
  const films = await db.film.findMany({ where, orderBy: { year: 'desc' } })
  return NextResponse.json(films.map(dbFilmToFilm))
}
