import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbFilmToFilm } from '@/lib/content'
import { requireAdmin, ensureArray, safeInt } from '@/lib/admin-auth'

export async function GET() {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  try {
    const films = await db.film.findMany({ orderBy: { year: 'desc' } })
    return NextResponse.json(films.map(dbFilmToFilm))
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
  if (!body.year) return NextResponse.json({ error: 'year required' }, { status: 400 })

  try {
    const film = await db.film.create({
      data: {
        slug: body.slug,
        titleKk: String((body.title as Record<string,string>)?.kk ?? ''),
        titleRu: String((body.title as Record<string,string>)?.ru ?? ''),
        titleEn: String((body.title as Record<string,string>)?.en ?? ''),
        year: safeInt(body.year),
        decade: String(body.decade ?? ''),
        genres: JSON.stringify(ensureArray(body.genres)),
        tags: JSON.stringify(ensureArray(body.tags)),
        synopsisKk: String((body.synopsis as Record<string,string>)?.kk ?? ''),
        synopsisRu: String((body.synopsis as Record<string,string>)?.ru ?? ''),
        synopsisEn: String((body.synopsis as Record<string,string>)?.en ?? ''),
        poster: String(body.poster ?? ''),
        banner: String(body.banner ?? ''),
        gallery: JSON.stringify(ensureArray(body.gallery)),
        director: String(body.director ?? ''),
        cinematographer: String(body.cinematographer ?? ''),
        screenwriter: String(body.screenwriter ?? ''),
        cast: JSON.stringify(ensureArray(body.cast)),
        studioKk: String((body.studio as Record<string,string>)?.kk ?? ''),
        studioRu: String((body.studio as Record<string,string>)?.ru ?? ''),
        studioEn: String((body.studio as Record<string,string>)?.en ?? ''),
        duration: safeInt(body.duration),
        language: String(body.language ?? 'ru'),
        mediaType: String(body.mediaType ?? 'film'),
        archiveId: String(body.archiveId ?? ''),
        collections: JSON.stringify(ensureArray(body.collections)),
        relatedFilms: JSON.stringify(ensureArray(body.relatedFilms)),
        featured: Boolean(body.featured),
        historicalRelevance: safeInt(body.historicalRelevance, 5),
        videoUrl: body.videoUrl ? String(body.videoUrl) : null,
      },
    })
    return NextResponse.json(dbFilmToFilm(film), { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    if (msg.includes('Unique constraint')) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
