import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { FilmCard } from '@/components/films/FilmCard'
import { db } from '@/lib/db'
import { dbPersonToPerson, dbFilmToFilm } from '@/lib/content'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const dbPerson = await db.person.findUnique({ where: { slug } })
  if (!dbPerson) return {}
  const person = dbPersonToPerson(dbPerson)
  const loc = locale as 'kk' | 'ru' | 'en'
  return {
    title: `${person.name[loc]} | Қазақ Киносы`,
    description: person.bio[loc].slice(0, 160),
  }
}

export default async function PersonDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as 'kk' | 'ru' | 'en'
  const dbPerson = await db.person.findUnique({ where: { slug } })

  if (!dbPerson) notFound()
  const person = dbPersonToPerson(dbPerson)

  const personFilms = (await db.film.findMany({ where: { slug: { in: person.films } } })).map(dbFilmToFilm)

  const roleLabel: Record<string, Record<string, string>> = {
    kk: { director: 'Режиссер', actor: 'Актер', cinematographer: 'Оператор', writer: 'Сценарист', producer: 'Продюсер' },
    ru: { director: 'Режиссёр', actor: 'Актёр', cinematographer: 'Оператор', writer: 'Сценарист', producer: 'Продюсер' },
    en: { director: 'Director', actor: 'Actor', cinematographer: 'Cinematographer', writer: 'Screenwriter', producer: 'Producer' },
  }

  const labels = {
    kk: { bio: 'Өмірбаяны', filmography: 'Фильмография', born: 'Туған жылы', died: 'Қайтыс болған жылы', noFilms: 'Фильмдер жоқ' },
    ru: { bio: 'Биография', filmography: 'Фильмография', born: 'Год рождения', died: 'Год смерти', noFilms: 'Фильмы не найдены' },
    en: { bio: 'Biography', filmography: 'Filmography', born: 'Birth Year', died: 'Death Year', noFilms: 'No films found' },
  }
  const t = labels[loc]

  return (
      <main className="min-h-screen bg-zinc-950 pt-20">
        {/* PERSON HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row gap-10">
              {/* PHOTO */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0 mx-auto md:mx-0">
                <Image
                  src={person.photo}
                  alt={person.name[loc]}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* INFO */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30 mb-3">
                    {roleLabel[loc][person.role]}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white">{person.name[loc]}</h1>
                </div>

                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-zinc-500 uppercase tracking-wider text-xs mb-1">{t.born}</p>
                    <p className="text-white font-semibold">{person.birthYear}</p>
                  </div>
                  {person.deathYear && (
                    <div>
                      <p className="text-zinc-500 uppercase tracking-wider text-xs mb-1">{t.died}</p>
                      <p className="text-white font-semibold">{person.deathYear}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* BIOGRAPHY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-white mb-6">{t.bio}</h2>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-4xl">{person.bio[loc]}</p>
          </AnimatedSection>
        </section>

        {/* FILMOGRAPHY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-white mb-8">
              {t.filmography}
              <span className="ml-3 text-lg text-zinc-500">({personFilms.length})</span>
            </h2>
            {personFilms.length === 0 ? (
              <p className="text-zinc-500">{t.noFilms}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {personFilms.map((film) => (
                  <FilmCard key={film.id} film={film} locale={loc} />
                ))}
              </div>
            )}
          </AnimatedSection>
        </section>
      </main>
  )
}
