import { PrismaClient } from '@prisma/client'
import path from 'path'

// Set absolute DB path before requiring anything that uses Prisma
process.env.DATABASE_URL = `file:${path.resolve(__dirname, 'dev.db')}`

const prisma = new PrismaClient()

async function main() {
  // Dynamically require data files (avoid TS module resolution issues)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { films } = require('../src/data/films') as { films: Array<{
    slug: string; title: { kk: string; ru: string; en: string }
    year: number; decade: string; genres: string[]; tags: string[]
    synopsis: { kk: string; ru: string; en: string }
    poster: string; banner: string; gallery: string[]
    director: string; cinematographer: string; screenwriter: string
    cast: string[]; studio: { kk: string; ru: string; en: string }
    duration: number; language: string; mediaType: string
    archiveId: string; collections: string[]; relatedFilms: string[]
    featured: boolean; historicalRelevance: number; videoUrl?: string
  }> }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { persons } = require('../src/data/persons') as { persons: Array<{
    slug: string; name: { kk: string; ru: string; en: string }
    role: string; bio: { kk: string; ru: string; en: string }
    birthYear: number; deathYear?: number; photo: string
    films: string[]; featured: boolean
  }> }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { collections } = require('../src/data/collections') as { collections: Array<{
    slug: string; title: { kk: string; ru: string; en: string }
    description: { kk: string; ru: string; en: string }
    curatorNotes: { kk: string; ru: string; en: string }
    cover: string; films: string[]; era: string
  }> }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { timelineEvents } = require('../src/data/timeline') as { timelineEvents: Array<{
    id: string; year: number
    title: { kk: string; ru: string; en: string }
    description: { kk: string; ru: string; en: string }
    type: string; filmSlug?: string; image?: string; era: string
  }> }

  console.log('Seeding films...')
  for (const film of films) {
    await prisma.film.upsert({
      where: { slug: film.slug },
      update: {},
      create: {
        slug: film.slug,
        titleKk: film.title.kk,
        titleRu: film.title.ru,
        titleEn: film.title.en,
        year: film.year,
        decade: film.decade,
        genres: JSON.stringify(film.genres),
        tags: JSON.stringify(film.tags),
        synopsisKk: film.synopsis.kk,
        synopsisRu: film.synopsis.ru,
        synopsisEn: film.synopsis.en,
        poster: film.poster,
        banner: film.banner,
        gallery: JSON.stringify(film.gallery),
        director: film.director,
        cinematographer: film.cinematographer,
        screenwriter: film.screenwriter,
        cast: JSON.stringify(film.cast),
        studioKk: film.studio.kk,
        studioRu: film.studio.ru,
        studioEn: film.studio.en,
        duration: film.duration,
        language: film.language,
        mediaType: film.mediaType,
        archiveId: film.archiveId,
        collections: JSON.stringify(film.collections),
        relatedFilms: JSON.stringify(film.relatedFilms),
        featured: film.featured,
        historicalRelevance: film.historicalRelevance,
        videoUrl: film.videoUrl,
      },
    })
  }
  console.log(`✓ ${films.length} films seeded`)

  console.log('Seeding persons...')
  for (const person of persons) {
    await prisma.person.upsert({
      where: { slug: person.slug },
      update: {},
      create: {
        slug: person.slug,
        nameKk: person.name.kk,
        nameRu: person.name.ru,
        nameEn: person.name.en,
        role: person.role,
        bioKk: person.bio?.kk ?? '',
        bioRu: person.bio?.ru ?? '',
        bioEn: person.bio?.en ?? '',
        birthYear: person.birthYear ?? 0,
        deathYear: person.deathYear,
        photo: person.photo,
        films: JSON.stringify(person.films),
        featured: person.featured,
      },
    })
  }
  console.log(`✓ ${persons.length} persons seeded`)

  console.log('Seeding collections...')
  for (const col of collections) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: {
        slug: col.slug,
        titleKk: col.title.kk,
        titleRu: col.title.ru,
        titleEn: col.title.en,
        descriptionKk: col.description.kk,
        descriptionRu: col.description.ru,
        descriptionEn: col.description.en,
        curatorNotesKk: col.curatorNotes?.kk ?? '',
        curatorNotesRu: col.curatorNotes?.ru ?? '',
        curatorNotesEn: col.curatorNotes?.en ?? '',
        cover: col.cover,
        films: JSON.stringify(col.films),
        era: col.era,
      },
    })
  }
  console.log(`✓ ${collections.length} collections seeded`)

  console.log('Seeding timeline events...')
  for (const evt of timelineEvents) {
    await prisma.timelineEvent.upsert({
      where: { slug: evt.id },
      update: {},
      create: {
        slug: evt.id,
        year: evt.year,
        titleKk: evt.title.kk,
        titleRu: evt.title.ru,
        titleEn: evt.title.en,
        descriptionKk: evt.description.kk,
        descriptionRu: evt.description.ru,
        descriptionEn: evt.description.en,
        type: evt.type,
        filmSlug: evt.filmSlug,
        image: evt.image,
        era: evt.era,
      },
    })
  }
  console.log(`✓ ${timelineEvents.length} timeline events seeded`)

  console.log('\n✅ All content seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
