import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { collections as staticCollections } from '@/data/collections'

interface Props {
  params: Promise<{ locale: string }>
}

const titles = {
  kk: { title: 'Жинақтар', subtitle: 'Қазақ киносының тақырыптық іріктемелері' },
  ru: { title: 'Коллекции', subtitle: 'Тематические подборки казахского кино' },
  en: { title: 'Collections', subtitle: 'Thematic selections of Kazakh cinema' },
}

export default async function CollectionsPage({ params }: Props) {
  const { locale } = await params
  const loc = locale as 'kk' | 'ru' | 'en'
  const { title, subtitle } = titles[loc] || titles.ru
  const collections = [...staticCollections].sort((a, b) => {
    const at = typeof a.title === 'string' ? a.title : a.title.ru
    const bt = typeof b.title === 'string' ? b.title : b.title.ru
    return at.localeCompare(bt)
  })

  const labels = {
    kk: { films: 'фильм', view: 'Жинақты қарау', collectionsCount: 'жинақ' },
    ru: { films: 'фильмов', view: 'Смотреть коллекцию', collectionsCount: 'коллекций' },
    en: { films: 'films', view: 'View Collection', collectionsCount: 'collections' },
  }
  const t = labels[loc] || labels.ru

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] pt-20">

      {/* HERO */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-4">
            TAMGA · {collections.length} {t.collectionsCount}
          </p>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-[rgb(var(--foreground))] mb-3">{title}</h1>
          <p className="text-[rgb(var(--muted))] text-lg max-w-2xl">{subtitle}</p>
        </AnimatedSection>
      </section>

      {/* COLLECTIONS GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <AnimatedSection key={col.id}>
              <Link
                href={`/${loc}/collections/${col.slug}`}
                className="group block rounded-2xl overflow-hidden bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 hover:border-[rgb(var(--accent))]/40 transition-all duration-300"
              >
                {/* COVER */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={col.cover}
                    alt={col.title[loc]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--card))] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[rgb(var(--accent))]/90 text-black text-xs font-bold">
                      {col.era}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-3">
                  <h2 className="text-xl font-display font-bold text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--accent))] transition-colors">
                    {col.title[loc]}
                  </h2>
                  <p className="text-[rgb(var(--muted))] text-sm leading-relaxed line-clamp-3">
                    {col.description[loc]}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[rgb(var(--accent))] font-semibold text-sm">
                      {col.films.length} {t.films}
                    </span>
                    <span className="text-[rgb(var(--muted))] text-sm group-hover:text-[rgb(var(--accent))] transition-colors">
                      {t.view} →
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </main>
  )
}
