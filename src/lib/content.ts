import type { Film, Person, Collection, TimelineEvent } from '@/types'
import type { Film as DbFilm, Person as DbPerson, Collection as DbCollection, TimelineEvent as DbTimelineEvent } from '@prisma/client'

function safeParseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function dbFilmToFilm(f: DbFilm): Film {
  return {
    id: f.id,
    slug: f.slug,
    title: { kk: f.titleKk, ru: f.titleRu, en: f.titleEn },
    year: f.year,
    decade: f.decade,
    genres: safeParseArray(f.genres),
    tags: safeParseArray(f.tags),
    synopsis: { kk: f.synopsisKk, ru: f.synopsisRu, en: f.synopsisEn },
    poster: f.poster,
    banner: f.banner,
    gallery: safeParseArray(f.gallery),
    director: f.director,
    cinematographer: f.cinematographer,
    screenwriter: f.screenwriter,
    cast: safeParseArray(f.cast),
    studio: { kk: f.studioKk, ru: f.studioRu, en: f.studioEn },
    duration: f.duration,
    language: f.language as Film['language'],
    mediaType: f.mediaType as Film['mediaType'],
    archiveId: f.archiveId,
    collections: safeParseArray(f.collections),
    relatedFilms: safeParseArray(f.relatedFilms),
    featured: f.featured,
    historicalRelevance: f.historicalRelevance,
    videoUrl: f.videoUrl ?? undefined,
  }
}

export function dbPersonToPerson(p: DbPerson): Person {
  return {
    id: p.id,
    slug: p.slug,
    name: { kk: p.nameKk, ru: p.nameRu, en: p.nameEn },
    role: p.role as Person['role'],
    bio: { kk: p.bioKk, ru: p.bioRu, en: p.bioEn },
    birthYear: p.birthYear,
    deathYear: p.deathYear ?? undefined,
    photo: p.photo,
    films: safeParseArray(p.films),
    featured: p.featured,
  }
}

export function dbCollectionToCollection(c: DbCollection): Collection {
  return {
    id: c.id,
    slug: c.slug,
    title: { kk: c.titleKk, ru: c.titleRu, en: c.titleEn },
    description: { kk: c.descriptionKk, ru: c.descriptionRu, en: c.descriptionEn },
    curatorNotes: { kk: c.curatorNotesKk, ru: c.curatorNotesRu, en: c.curatorNotesEn },
    cover: c.cover,
    films: safeParseArray(c.films),
    era: c.era,
  }
}

export function dbTimelineEventToTimelineEvent(e: DbTimelineEvent): TimelineEvent {
  return {
    id: e.slug,
    year: e.year,
    title: { kk: e.titleKk, ru: e.titleRu, en: e.titleEn },
    description: { kk: e.descriptionKk, ru: e.descriptionRu, en: e.descriptionEn },
    type: e.type as TimelineEvent['type'],
    filmSlug: e.filmSlug ?? undefined,
    image: e.image ?? undefined,
    era: e.era as TimelineEvent['era'],
  }
}
