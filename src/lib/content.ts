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
    title: { kk: f.titleKk || f.titleRu, ru: f.titleRu, en: f.titleEn || f.titleRu },
    year: f.year,
    decade: f.decade,
    genres: safeParseArray(f.genres),
    tags: safeParseArray(f.tags),
    synopsis: { kk: f.synopsisKk || f.synopsisRu, ru: f.synopsisRu, en: f.synopsisEn || f.synopsisRu },
    poster: f.poster,
    banner: f.banner,
    gallery: safeParseArray(f.gallery),
    director: f.director,
    cinematographer: f.cinematographer,
    screenwriter: f.screenwriter,
    cast: safeParseArray(f.cast),
    studio: { kk: f.studioKk || f.studioRu, ru: f.studioRu, en: f.studioEn || f.studioRu },
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
    name: { kk: p.nameKk || p.nameRu, ru: p.nameRu, en: p.nameEn || p.nameRu },
    role: p.role as Person['role'],
    bio: { kk: p.bioKk || p.bioRu, ru: p.bioRu, en: p.bioEn || p.bioRu },
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
    title: { kk: c.titleKk || c.titleRu, ru: c.titleRu, en: c.titleEn || c.titleRu },
    description: { kk: c.descriptionKk || c.descriptionRu, ru: c.descriptionRu, en: c.descriptionEn || c.descriptionRu },
    curatorNotes: { kk: c.curatorNotesKk || c.curatorNotesRu, ru: c.curatorNotesRu, en: c.curatorNotesEn || c.curatorNotesRu },
    cover: c.cover,
    films: safeParseArray(c.films),
    era: c.era,
  }
}

export function dbTimelineEventToTimelineEvent(e: DbTimelineEvent): TimelineEvent {
  return {
    id: e.slug,
    year: e.year,
    title: { kk: e.titleKk || e.titleRu, ru: e.titleRu, en: e.titleEn || e.titleRu },
    description: { kk: e.descriptionKk || e.descriptionRu, ru: e.descriptionRu, en: e.descriptionEn || e.descriptionRu },
    type: e.type as TimelineEvent['type'],
    filmSlug: e.filmSlug ?? undefined,
    image: e.image ?? undefined,
    era: e.era as TimelineEvent['era'],
  }
}
