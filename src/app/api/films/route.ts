import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbFilmToFilm } from '@/lib/content'
import { films as staticFilms } from '@/data/films'
import type { Film } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const featured = searchParams.get('featured')

  if (slug) {
    const dbFilm = await db.film.findUnique({ where: { slug } }).catch(() => null)
    if (dbFilm) return NextResponse.json(dbFilmToFilm(dbFilm))
    const staticFilm = staticFilms.find((f) => f.slug === slug)
    if (!staticFilm) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(staticFilm)
  }

  const dbRows = await db.film.findMany({ orderBy: { year: 'desc' } }).catch(() => [])
  const dbFilms = dbRows.map(dbFilmToFilm)
  const dbSlugs = new Set(dbFilms.map((f) => f.slug))
  const merged: Film[] = [...dbFilms, ...staticFilms.filter((f) => !dbSlugs.has(f.slug))]
  merged.sort((a, b) => b.year - a.year)

  const result = featured === 'true' ? merged.filter((f) => f.featured) : merged
  return NextResponse.json(result)
}
