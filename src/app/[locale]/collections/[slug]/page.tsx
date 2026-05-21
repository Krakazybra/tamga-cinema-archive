import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { FilmCard } from '@/components/films/FilmCard'
import { db } from '@/lib/db'
import { dbCollectionToCollection, dbFilmToFilm } from '@/lib/content'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const dbCol = await db.collection.findUnique({ where: { slug } })
  if (!dbCol) return {}
  const col = dbCollectionToCollection(dbCol)
  const loc = locale as 'kk' | 'ru' | 'en'
  return {
    title: `${col.title[loc]} | Қазақ Киносы`,
    description: col.description[loc],
    openGraph: { images: [col.cover] },
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as 'kk' | 'ru' | 'en'
  const dbCol = await db.collection.findUnique({ where: { slug } })

  if (!dbCol) notFound()
  const collection = dbCollectionToCollection(dbCol)

  const collectionFilms = (await db.film.findMany({ where: { slug: { in: collection.films } } })).map(dbFilmToFilm)

  const labels = {
    kk: { curator: 'Куратордың ескертпелері', era: 'Дәуір', films: 'фильм' },
    ru: { curator: 'Заметки куратора', era: 'Эпоха', films: 'фильмов' },
    en: { curator: "Curator's Notes", era: 'Era', films: 'films' },
  }
  const t = labels[loc]

  return (
      <main className="min-h-screen bg-[rgb(var(--background))] pt-20">
        {/* HERO */}
        <section className="relative h-80 overflow-hidden">
          <Image
            src={collection.cover}
            alt={collection.title[loc]}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/90 text-black text-sm font-bold mb-4">
              {collection.era}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {collection.title[loc]}
            </h1>
            <p className="text-zinc-300 text-lg">
              {collectionFilms.length} {t.films}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* DESCRIPTION */}
          <AnimatedSection>
            <p className="text-[rgb(var(--muted))] text-lg leading-relaxed max-w-4xl">
              {collection.description[loc]}
            </p>
          </AnimatedSection>

          {/* CURATOR NOTES */}
          <AnimatedSection>
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-8">
              <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <span>◈</span> {t.curator}
              </h2>
              <p className="text-[rgb(var(--muted))] leading-relaxed italic">
                {collection.curatorNotes[loc]}
              </p>
            </div>
          </AnimatedSection>

          {/* FILMS GRID */}
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-8">
              {loc === 'kk' ? 'Фильмдер' : loc === 'en' ? 'Films' : 'Фильмы'}
              <span className="ml-3 text-[rgb(var(--muted))] text-lg">({collectionFilms.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {collectionFilms.map((film) => (
                <FilmCard key={film.id} film={film} locale={loc} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </main>
  )
}
