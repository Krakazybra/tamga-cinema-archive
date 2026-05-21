import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { FilmCardLandscape } from '@/components/home/FilmCardLandscape'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { db } from '@/lib/db'
import { dbFilmToFilm, dbCollectionToCollection } from '@/lib/content'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [dbFilms, dbCollections] = await Promise.all([
    db.film.findMany({ orderBy: { year: 'desc' } }),
    db.collection.findMany({ orderBy: { titleRu: 'asc' } }),
  ])
  const films = dbFilms.map(dbFilmToFilm)
  const collections = dbCollections.map(dbCollectionToCollection)

  const featured = films.filter((f) => f.featured)

  const byEra = [
    {
      label: { kk: 'Алтын дәуір · 1960–1979', ru: 'Золотой век · 1960–1979', en: 'Golden Age · 1960–1979' },
      films: films.filter((f) => f.year >= 1960 && f.year < 1980),
    },
    {
      label: { kk: 'Жаңа толқын · 1980–1999', ru: 'Новая волна · 1980–1999', en: 'New Wave · 1980–1999' },
      films: films.filter((f) => f.year >= 1980 && f.year < 2000),
    },
    {
      label: { kk: 'Қазіргі заман · 2000+', ru: 'Современность · 2000+', en: 'Modern Era · 2000+' },
      films: films.filter((f) => f.year >= 2000),
    },
  ].filter((era) => era.films.length > 0)

  const spotlightCollection = collections[1] ?? collections[0]
  const featureCollections = collections.slice(0, 3)

  const collectionsLabel = locale === 'kk' ? 'Барлық жинақтар →' : locale === 'en' ? 'All collections →' : 'Все коллекции →'
  const collectionLabel = locale === 'kk' ? 'Таңдаулы жинақ' : locale === 'en' ? 'Featured Collection' : 'Избранная коллекция'
  const watchCollectionLabel = locale === 'kk' ? 'Жинақты ашу →' : locale === 'en' ? 'Open collection →' : 'Открыть коллекцию →'
  const collectionsTitle = locale === 'kk' ? 'Жинақтар' : locale === 'en' ? 'Collections' : 'Коллекции'
  const collectionsSubtitle = locale === 'kk' ? 'Тематикалық іріктемелер' : locale === 'en' ? 'Thematic selections' : 'Тематические подборки'
  const exploreLabel = locale === 'kk' ? 'Ашу →' : locale === 'en' ? 'Explore →' : 'Открыть →'

  return (
    <div className="min-h-screen">
      <HeroCarousel films={featured} locale={locale} />

      {/* Films by Era — horizontal scroll */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {byEra.map((era) => (
          <AnimatedSection key={era.label.ru} className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl font-bold text-[rgb(var(--foreground))]">
                {(era.label as Record<string, string>)[locale] ?? era.label.ru}
              </h2>
              <Link
                href={`/${locale}/films`}
                className="text-[rgb(var(--accent))] hover:underline text-sm font-medium"
              >
                {locale === 'kk' ? 'Барлығы →' : locale === 'en' ? 'All →' : 'Все →'}
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-none">
              {era.films.map((film) => (
                <div key={film.slug} className="snap-start flex-shrink-0 w-64 sm:w-72">
                  <FilmCardLandscape film={film} locale={locale} />
                </div>
              ))}
            </div>
          </AnimatedSection>
        ))}
      </section>

      {/* Spotlight collection — arkaader style */}
      {spotlightCollection && (
        <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium">
                {collectionLabel}
              </p>
              <Link href={`/${locale}/collections`} className="text-[rgb(var(--accent))] hover:underline text-sm font-medium">
                {collectionsLabel}
              </Link>
            </div>
            <Link href={`/${locale}/collections/${spotlightCollection.slug}`}>
              <div className="relative rounded-2xl overflow-hidden h-[320px] md:h-[420px] group">
                {spotlightCollection.cover && (
                  <Image
                    src={spotlightCollection.cover}
                    alt={(spotlightCollection.title as Record<string, string>)[locale] ?? spotlightCollection.title.ru}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full border border-[rgb(var(--accent))]/40 text-[rgb(var(--accent))]">
                      {spotlightCollection.era}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/70">
                      {spotlightCollection.films.length} {locale === 'kk' ? 'фильм' : locale === 'en' ? 'films' : 'фильмов'}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-4xl text-white font-bold mb-3 leading-tight">
                    {(spotlightCollection.title as Record<string, string>)[locale] ?? spotlightCollection.title.ru}
                  </h2>
                  <p className="text-zinc-300 max-w-2xl text-sm md:text-base line-clamp-2 mb-6">
                    {(spotlightCollection.description as Record<string, string>)[locale] ?? spotlightCollection.description.ru}
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[rgb(var(--accent))] text-black font-semibold text-sm transition-colors group-hover:bg-[rgb(var(--accent))]/90">
                    {watchCollectionLabel}
                  </span>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        </section>
      )}

      {/* Collections grid — arkaader style */}
      {featureCollections.length > 0 && (
        <section className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-[rgb(var(--foreground))]">{collectionsTitle}</h2>
                <p className="text-[rgb(var(--muted))] text-sm mt-1">{collectionsSubtitle}</p>
              </div>
              <Link href={`/${locale}/collections`} className="text-[rgb(var(--accent))] hover:underline text-sm font-medium">
                {collectionsLabel}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featureCollections.map((col) => (
                <Link key={col.slug} href={`/${locale}/collections/${col.slug}`} className="group">
                  <div className="relative rounded-xl overflow-hidden h-48 mb-3 bg-[rgb(var(--card))]">
                    {col.cover && (
                      <Image
                        src={col.cover}
                        alt={(col.title as Record<string, string>)[locale] ?? col.title.ru}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs px-2 py-0.5 rounded-full border border-[rgb(var(--accent))]/40 text-[rgb(var(--accent))]">
                        {col.era}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--accent))] transition-colors">
                    {(col.title as Record<string, string>)[locale] ?? col.title.ru}
                  </h3>
                  <p className="text-[rgb(var(--muted))] text-sm mt-1 line-clamp-2">
                    {(col.description as Record<string, string>)[locale] ?? col.description.ru}
                  </p>
                  <p className="text-[rgb(var(--accent))] text-sm mt-2 font-medium">{exploreLabel}</p>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        </section>
      )}

    </div>
  )
}
