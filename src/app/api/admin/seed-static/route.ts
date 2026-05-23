import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { films } from '@/data/films'
import { persons } from '@/data/persons'
import { collections } from '@/data/collections'
import { timelineEvents } from '@/data/timeline'

function locStr(val: unknown): { ru: string; kk: string; en: string } {
  if (typeof val === 'string') return { ru: val, kk: val, en: val }
  const v = val as Record<string, string>
  return { ru: v?.ru ?? '', kk: v?.kk ?? '', en: v?.en ?? '' }
}

export async function POST() {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  let filmCount = 0, personCount = 0, collectionCount = 0, timelineCount = 0

  for (const film of films) {
    const title = locStr(film.title)
    const synopsis = locStr(film.synopsis)
    const studio = locStr(film.studio)
    const existing = await db.film.findUnique({ where: { slug: film.slug } })
    if (!existing) {
      await db.film.create({
        data: {
          slug: film.slug,
          titleKk: title.kk, titleRu: title.ru, titleEn: title.en,
          year: film.year, decade: film.decade,
          director: film.director ?? '',
          cinematographer: film.cinematographer ?? '',
          screenwriter: film.screenwriter ?? '',
          studioKk: studio.kk, studioRu: studio.ru, studioEn: studio.en,
          synopsisKk: synopsis.kk, synopsisRu: synopsis.ru, synopsisEn: synopsis.en,
          genres: JSON.stringify(film.genres ?? []),
          tags: JSON.stringify(film.tags ?? []),
          cast: JSON.stringify(film.cast ?? []),
          poster: film.poster ?? '', banner: film.banner ?? '',
          gallery: JSON.stringify(film.gallery ?? []),
          mediaType: film.mediaType ?? 'film', language: film.language ?? 'ru',
          duration: film.duration ?? 0, featured: film.featured ?? false,
          archiveId: film.archiveId ?? '',
          collections: JSON.stringify(film.collections ?? []),
          relatedFilms: JSON.stringify(film.relatedFilms ?? []),
          videoUrl: film.videoUrl ?? null,
          historicalRelevance: film.historicalRelevance ?? 5,
        },
      })
      filmCount++
    }
  }

  for (const person of persons) {
    const name = locStr(person.name)
    const bio = locStr(person.bio)
    const existing = await db.person.findUnique({ where: { slug: person.slug } })
    if (!existing) {
      await db.person.create({
        data: {
          slug: person.slug,
          nameKk: name.kk, nameRu: name.ru, nameEn: name.en,
          role: person.role,
          bioKk: bio.kk, bioRu: bio.ru, bioEn: bio.en,
          birthYear: person.birthYear ?? 0,
          deathYear: person.deathYear ?? null,
          photo: person.photo ?? '',
          films: JSON.stringify(person.films ?? []),
          featured: person.featured ?? false,
        },
      })
      personCount++
    }
  }

  for (const col of collections) {
    const title = locStr(col.title)
    const description = locStr(col.description)
    const curatorNotes = locStr(col.curatorNotes)
    const existing = await db.collection.findUnique({ where: { slug: col.slug } })
    if (!existing) {
      await db.collection.create({
        data: {
          slug: col.slug,
          titleKk: title.kk, titleRu: title.ru, titleEn: title.en,
          descriptionKk: description.kk, descriptionRu: description.ru, descriptionEn: description.en,
          curatorNotesKk: curatorNotes.kk, curatorNotesRu: curatorNotes.ru, curatorNotesEn: curatorNotes.en,
          cover: col.cover ?? '', films: JSON.stringify(col.films ?? []), era: col.era ?? '',
        },
      })
      collectionCount++
    }
  }

  for (const event of timelineEvents) {
    const title = locStr(event.title)
    const description = locStr(event.description)
    const existing = await db.timelineEvent.findUnique({ where: { slug: event.id } })
    if (!existing) {
      await db.timelineEvent.create({
        data: {
          slug: event.id, year: event.year,
          titleKk: title.kk, titleRu: title.ru, titleEn: title.en,
          descriptionKk: description.kk, descriptionRu: description.ru, descriptionEn: description.en,
          type: event.type ?? 'event',
          filmSlug: event.filmSlug ?? null, image: event.image ?? null, era: event.era ?? '',
        },
      })
      timelineCount++
    }
  }

  return NextResponse.json({
    ok: true,
    seeded: { films: filmCount, persons: personCount, collections: collectionCount, timeline: timelineCount },
  })
}
