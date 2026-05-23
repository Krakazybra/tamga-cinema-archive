import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { films } from '../src/data/films'
import { persons } from '../src/data/persons'
import { collections } from '../src/data/collections'
import { timelineEvents } from '../src/data/timeline'

const db = new PrismaClient()

function locStr(val: unknown): { ru: string; kk: string; en: string } {
  if (typeof val === 'string') return { ru: val, kk: val, en: val }
  const v = val as Record<string, string>
  return { ru: v?.ru ?? '', kk: v?.kk ?? '', en: v?.en ?? '' }
}

async function main() {
  // ── Users ──────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12)
  const userPassword = await bcrypt.hash('user123', 12)
  const modPassword = await bcrypt.hash('mod123', 12)

  await db.user.upsert({
    where: { email: 'admin@kazfilm.kz' },
    update: {},
    create: { email: 'admin@kazfilm.kz', name: 'Администратор', password: adminPassword, role: 'ADMIN' },
  })
  await db.user.upsert({
    where: { email: 'user@test.kz' },
    update: {},
    create: { email: 'user@test.kz', name: 'Тестовый пользователь', password: userPassword, role: 'USER' },
  })
  await db.user.upsert({
    where: { email: 'moderator@kazfilm.kz' },
    update: {},
    create: { email: 'moderator@kazfilm.kz', name: 'Модератор', password: modPassword, role: 'MODERATOR' },
  })

  // ── Films ──────────────────────────────────────────────────────────
  for (const film of films) {
    const title = locStr(film.title)
    const synopsis = locStr(film.synopsis)
    const studio = locStr(film.studio)
    await db.film.upsert({
      where: { slug: film.slug },
      update: {},
      create: {
        slug: film.slug,
        titleKk: title.kk, titleRu: title.ru, titleEn: title.en,
        year: film.year,
        decade: film.decade,
        director: film.director ?? '',
        cinematographer: film.cinematographer ?? '',
        screenwriter: film.screenwriter ?? '',
        studioKk: studio.kk, studioRu: studio.ru, studioEn: studio.en,
        synopsisKk: synopsis.kk, synopsisRu: synopsis.ru, synopsisEn: synopsis.en,
        genres: JSON.stringify(film.genres ?? []),
        tags: JSON.stringify(film.tags ?? []),
        cast: JSON.stringify(film.cast ?? []),
        poster: film.poster ?? '',
        banner: film.banner ?? '',
        gallery: JSON.stringify(film.gallery ?? []),
        mediaType: film.mediaType ?? 'film',
        language: film.language ?? 'ru',
        duration: film.duration ?? 0,
        featured: film.featured ?? false,
        archiveId: film.archiveId ?? '',
        collections: JSON.stringify(film.collections ?? []),
        relatedFilms: JSON.stringify(film.relatedFilms ?? []),
        videoUrl: film.videoUrl ?? null,
        historicalRelevance: film.historicalRelevance ?? 5,
      },
    })
  }

  // ── Persons ────────────────────────────────────────────────────────
  for (const person of persons) {
    const name = locStr(person.name)
    const bio = locStr(person.bio)
    await db.person.upsert({
      where: { slug: person.slug },
      update: {},
      create: {
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
  }

  // ── Collections ────────────────────────────────────────────────────
  for (const col of collections) {
    const title = locStr(col.title)
    const description = locStr(col.description)
    const curatorNotes = locStr(col.curatorNotes)
    await db.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: {
        slug: col.slug,
        titleKk: title.kk, titleRu: title.ru, titleEn: title.en,
        descriptionKk: description.kk, descriptionRu: description.ru, descriptionEn: description.en,
        curatorNotesKk: curatorNotes.kk, curatorNotesRu: curatorNotes.ru, curatorNotesEn: curatorNotes.en,
        cover: col.cover ?? '',
        films: JSON.stringify(col.films ?? []),
        era: col.era ?? '',
      },
    })
  }

  // ── Timeline Events ────────────────────────────────────────────────
  for (const event of timelineEvents) {
    const title = locStr(event.title)
    const description = locStr(event.description)
    await db.timelineEvent.upsert({
      where: { slug: event.id },
      update: {},
      create: {
        slug: event.id,
        year: event.year,
        titleKk: title.kk, titleRu: title.ru, titleEn: title.en,
        descriptionKk: description.kk, descriptionRu: description.ru, descriptionEn: description.en,
        type: event.type ?? 'event',
        filmSlug: event.filmSlug ?? null,
        image: event.image ?? null,
        era: event.era ?? '',
      },
    })
  }

  console.log(`Seeded: ${films.length} films, ${persons.length} persons, ${collections.length} collections, ${timelineEvents.length} timeline events`)
  console.log('Admin:     admin@kazfilm.kz      / admin123')
  console.log('Moderator: moderator@kazfilm.kz  / mod123')
  console.log('User:      user@test.kz          / user123')
}

main().finally(() => db.$disconnect())
