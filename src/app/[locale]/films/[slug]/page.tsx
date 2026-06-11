import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { FilmCard } from '@/components/films/FilmCard'
import { ShareButton } from '@/components/shared/ShareButton'
import { CommentsSection } from '@/components/comments/CommentsSection'
import { db } from '@/lib/db'
import { dbFilmToFilm, dbPersonToPerson } from '@/lib/content'
import { getGenreLabel } from '@/lib/genres'
import type { Film } from '@/types'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

async function getFilm(slug: string): Promise<Film | null> {
  const dbFilm = await db.film.findUnique({ where: { slug } }).catch(() => null)
  if (!dbFilm) return null
  return dbFilmToFilm(dbFilm)
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const film = await getFilm(slug)
  if (!film) return {}
  const loc = locale as 'kk' | 'ru' | 'en'
  return {
    title: `${film.title[loc] || film.title.ru} | Қазақ Киносы`,
    description: film.synopsis[loc] || film.synopsis.ru,
    openGraph: {
      images: [film.banner],
    },
  }
}

export default async function FilmDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as 'kk' | 'ru' | 'en'
  const film = await getFilm(slug)

  if (!film) notFound()

  const relatedSlugs = film.relatedFilms.filter((s) => s !== slug)
  const dbRelated = relatedSlugs.length > 0
    ? await db.film.findMany({ where: { slug: { in: relatedSlugs } } }).catch(() => [])
    : []
  const relatedFilms = dbRelated.map(dbFilmToFilm)

  const crewSlugs = [film.director, film.cinematographer, film.screenwriter, ...film.cast].filter(Boolean)
  const dbPersons = crewSlugs.length > 0
    ? await db.person.findMany({ where: { slug: { in: crewSlugs } } }).catch(() => [])
    : []
  const personMap = new Map(dbPersons.map(dbPersonToPerson).map((p) => [p.slug, p]))

  const labels = {
    kk: {
      director: 'Режиссер',
      cinematographer: 'Оператор-қоюшы',
      screenwriter: 'Сценарист',
      cast: 'Рөлдерде',
      studio: 'Киностудия',
      year: 'Жыл',
      duration: 'Ұзақтығы',
      archiveId: 'Мұрағат нөмірі',
      language: 'Тіл',
      synopsis: 'Синопсис',
      crew: 'Түсіру тобы',
      gallery: 'Галерея',
      archiveInfo: 'Мұрағат ақпараты',
      related: 'Ұқсас фильмдер',
      min: 'мин',
    },
    ru: {
      director: 'Режиссёр',
      cinematographer: 'Оператор',
      screenwriter: 'Сценарист',
      cast: 'В ролях',
      studio: 'Киностудия',
      year: 'Год выпуска',
      duration: 'Продолжительность',
      archiveId: 'Архивный номер',
      language: 'Язык',
      synopsis: 'Синопсис',
      crew: 'Съёмочная группа',
      gallery: 'Галерея',
      archiveInfo: 'Архивная информация',
      related: 'Похожие фильмы',
      min: 'мин',
    },
    en: {
      director: 'Director',
      cinematographer: 'Cinematographer',
      screenwriter: 'Screenwriter',
      cast: 'Cast',
      studio: 'Studio',
      year: 'Release Year',
      duration: 'Duration',
      archiveId: 'Archive Number',
      language: 'Language',
      synopsis: 'Synopsis',
      crew: 'Film Crew',
      gallery: 'Gallery',
      archiveInfo: 'Archive Info',
      related: 'Related Films',
      min: 'min',
    },
  }
  const t = labels[loc]

  const languageLabel: Record<Film['language'], Record<string, string>> = {
    kk: { kk: 'Қазақша', ru: 'Казахский', en: 'Kazakh' },
    ru: { kk: 'Орысша', ru: 'Русский', en: 'Russian' },
    mixed: { kk: 'Аралас', ru: 'Смешанный', en: 'Mixed' },
  }

  return (<>

      {/* HERO */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {film.banner && (
          <Image
            src={film.banner}
            alt={film.title[loc]}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 flex gap-8 items-end max-w-7xl mx-auto">
          <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-2xl shrink-0 hidden md:block">
            {film.poster && <Image src={film.poster} alt={film.title[loc]} fill className="object-cover" />}
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              {(loc === 'kk' && film.genresKk?.length ? film.genresKk : loc === 'ru' && film.genresRu?.length ? film.genresRu : film.genres.map(g => getGenreLabel(g, loc))).slice(0, 3).map((g) => (
                <span key={g} className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {film.title[loc]}
            </h1>
            <p className="text-[rgb(var(--muted))] text-lg">{film.year} · {film.duration} {t.min}</p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* METADATA ROW */}
        <AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-6 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
            {[
              { label: t.year, value: String(film.year) },
              { label: t.duration, value: `${film.duration} ${t.min}` },
              { label: t.language, value: languageLabel[film.language][loc] },
              { label: t.studio, value: film.studio[loc] },
              { label: t.archiveId, value: film.archiveId },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-[rgb(var(--foreground))] font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* SYNOPSIS */}
        <AnimatedSection>
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">{t.synopsis}</h2>
          <p className="text-[rgb(var(--muted))] text-lg leading-relaxed max-w-4xl">
            {film.synopsis[loc]}
          </p>
        </AnimatedSection>

        {/* VIDEO PLAYER */}
        {film.videoUrl && (
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">
              {loc === 'kk' ? 'Бейне' : loc === 'en' ? 'Video' : 'Видео'}
            </h2>
            <div className="rounded-xl overflow-hidden bg-black shadow-2xl">
              <video
                controls
                width="100%"
                className="rounded-lg"
                poster={film.poster}
              >
                <source src={film.videoUrl} type="video/mp4" />
                <track
                  kind="subtitles"
                  src="/subtitles/sample-ru.vtt"
                  srcLang="ru"
                  label="Русский"
                  default
                />
                <track
                  kind="subtitles"
                  src="/subtitles/sample-kk.vtt"
                  srcLang="kk"
                  label="Қазақша"
                />
                <track
                  kind="subtitles"
                  src="/subtitles/sample-en.vtt"
                  srcLang="en"
                  label="English"
                />
              </video>
            </div>
          </AnimatedSection>
        )}

        {/* CREW */}
        <div>
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">{t.crew}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { role: t.director, slug: film.director },
              { role: t.cinematographer, slug: film.cinematographer },
              { role: t.screenwriter, slug: film.screenwriter },
            ].map(({ role, slug }) => {
              const person = personMap.get(slug)
              const displayName = person
                ? (person.name[loc] || person.name.ru || person.name.en || slug.replace(/-/g, ' '))
                : slug.replace(/-/g, ' ')
              return (
                <div key={role} className="p-5 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]">
                  <p className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider mb-2">{role}</p>
                  {person ? (
                    <Link
                      href={`/${loc}/persons/${slug}`}
                      className="text-amber-400 font-semibold capitalize hover:text-amber-300 transition-colors"
                    >
                      {displayName}
                    </Link>
                  ) : (
                    <p className="text-[rgb(var(--foreground))] font-semibold capitalize">{displayName}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CAST */}
        {film.cast.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-4">{t.cast}</h2>
            <div className="flex flex-wrap gap-3">
              {film.cast.map((slug) => {
                const p = personMap.get(slug)
                const name = p ? (p.name as Record<string, string>)[loc] ?? p.name.ru : slug.replace(/-/g, ' ')
                return (
                  <span
                    key={slug}
                    className="px-4 py-2 rounded-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--muted))] text-sm capitalize"
                  >
                    {name}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {film.gallery.length > 0 && (
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">{t.gallery}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {film.gallery.filter(Boolean).map((src, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                  <Image src={src} alt={`${film.title[loc]} — ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* ARCHIVE INFO */}
        <div>
          <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">{t.archiveInfo}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-[rgb(var(--card))]/50 border border-[rgb(var(--border))]">
            <div>
              <p className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider mb-1">{t.archiveId}</p>
              <p className="text-amber-400 font-mono font-bold">{film.archiveId}</p>
            </div>
            <div>
              <p className="text-[rgb(var(--muted))] text-xs uppercase tracking-wider mb-1">
                {loc === 'kk' ? 'Жинақтар' : loc === 'en' ? 'Collections' : 'Коллекции'}
              </p>
              <div className="flex flex-wrap gap-2">
                {film.collections.map((c) => (
                  <Link key={c} href={`/${loc}/collections/${c}`} className="text-sm text-amber-400 hover:underline">
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${loc}/films?director=${film.director}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/10 transition-colors"
          >
            {loc === 'kk'
              ? `Режиссердің басқа фильмдері`
              : loc === 'en'
              ? `More films by this director`
              : `Другие фильмы режиссёра`}
          </Link>
          <Link
            href={`/${loc}/films?decade=${film.decade}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgb(var(--border))] text-[rgb(var(--muted))] text-sm hover:bg-[rgb(var(--card))] transition-colors"
          >
            {loc === 'kk'
              ? `${film.decade} фильмдері`
              : loc === 'en'
              ? `Films from the ${film.decade}`
              : `Фильмы ${film.decade}`}
          </Link>
        </div>

        {/* SHARE */}
        <div className="flex items-center gap-4">
          <ShareButton
            title={film.title[loc]}
            url={`/${loc}/films/${film.slug}`}
            locale={loc}
          />
        </div>

        {/* COMMENTS */}
        <CommentsSection filmSlug={film.slug} locale={loc} />

        {/* RELATED FILMS */}
        {relatedFilms.length > 0 && (
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">{t.related}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedFilms.map((f) => (
                <FilmCard key={f.id} film={f} locale={loc} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </main>
  </>)
}
