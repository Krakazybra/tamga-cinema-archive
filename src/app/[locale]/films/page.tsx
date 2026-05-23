'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import Fuse from 'fuse.js'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { FilmCard } from '@/components/films/FilmCard'
import { FiltersPanel } from '@/components/films/FiltersPanel'
import { EmptyState } from '@/components/shared/EmptyState'
import { FilmGridSkeleton } from '@/components/shared/Skeletons'
import { useFiltersStore } from '@/store'
import type { Film, LocalizedString } from '@/types'

const ITEMS_PER_PAGE = 12

const GENRE_SLUGS = ['drama', 'thriller', 'historical', 'comedy', 'documentary', 'animation', 'epic', 'romance', 'action', 'art-house', 'folk', 'war', 'crime', 'adventure', 'spy', 'neo-noir', 'psychological', 'biography', 'children', 'fantasy', 'melodrama'] as const
const DECADES = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']

function FilmsContent() {
  const locale = useLocale()
  const t = useTranslations('films')
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [fuse, setFuse] = useState<Fuse<Film> | null>(null)
  const [sort, setSort] = useState<'year-desc' | 'year-asc' | 'title'>('year-desc')
  const [page, setPage] = useState(1)
  const [allFilms, setAllFilms] = useState<Film[]>([])
  const [personNameMap, setPersonNameMap] = useState<Map<string, LocalizedString>>(new Map())
  const { decade, genres, mediaType, language, director, studio, yearFrom, yearTo, setFilter, resetFilters } = useFiltersStore()

  useEffect(() => {
    Promise.all([
      fetch('/api/films').then((r) => r.json()),
      fetch('/api/persons').then((r) => r.json()),
    ]).then(([films, persons]) => {
      setAllFilms(films)
      setPersonNameMap(new Map((persons as Array<{ slug: string; name: LocalizedString }>).map((p) => [p.slug, p.name])))
      setFuse(new Fuse(films, {
        keys: [
          { name: 'title.ru', weight: 2 },
          { name: 'title.kk', weight: 2 },
          { name: 'title.en', weight: 2 },
          { name: 'director', weight: 1 },
          { name: 'studio.ru', weight: 0.5 },
          { name: 'tags', weight: 0.5 },
        ],
        threshold: 0.4,
        includeScore: true,
      }))
    })
  }, [])

  useEffect(() => {
    resetFilters()
    const urlDecade = searchParams.get('decade')
    const urlDirector = searchParams.get('director')
    if (urlDecade) setFilter('decade', [urlDecade])
    if (urlDirector) setFilter('director', urlDirector)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasActiveFilters = decade.length > 0 || genres.length > 0 || !!mediaType || !!language || !!director || yearFrom > 0 || yearTo > 0

  const toggleDecade = (d: string) =>
    setFilter('decade', decade.includes(d) ? decade.filter((x) => x !== d) : [...decade, d])

  const filtered = useMemo(() => {
    let result: Film[] = [...allFilms]

    if (query) {
      if (fuse) {
        const fuseResults = fuse.search(query)
        const matchedSlugs = new Set(fuseResults.map((r) => r.item.slug))
        result = result.filter((f) => matchedSlugs.has(f.slug))
      } else {
        const q = query.toLowerCase()
        result = result.filter((f) =>
          f.title.ru.toLowerCase().includes(q) ||
          f.title.kk.toLowerCase().includes(q) ||
          f.title.en.toLowerCase().includes(q) ||
          f.director.toLowerCase().includes(q) ||
          f.studio.ru.toLowerCase().includes(q)
        )
      }
    }

    if (decade.length > 0) result = result.filter((f) => decade.includes(f.decade))
    if (genres.length > 0) result = result.filter((f) => f.genres.some((g) => genres.includes(g)))
    if (mediaType) result = result.filter((f) => f.mediaType === mediaType)
    if (language) result = result.filter((f) => f.language === language)

    if (director) {
      const dq = director.toLowerCase()
      result = result.filter((f) => {
        const readableName = personNameMap.get(f.director)
        return (
          f.director === dq ||
          f.director.toLowerCase().includes(dq) ||
          (readableName?.ru ?? '').toLowerCase().includes(dq) ||
          (readableName?.kk ?? '').toLowerCase().includes(dq) ||
          (readableName?.en ?? '').toLowerCase().includes(dq)
        )
      })
    }

    if (studio) {
      const sq = studio.toLowerCase()
      result = result.filter((f) =>
        f.studio.ru.toLowerCase().includes(sq) ||
        f.studio.kk.toLowerCase().includes(sq) ||
        f.studio.en.toLowerCase().includes(sq)
      )
    }

    if (yearFrom > 0) result = result.filter((f) => f.year >= yearFrom)
    if (yearTo > 0) result = result.filter((f) => f.year <= yearTo)

    result.sort((a, b) => {
      if (sort === 'year-desc') return b.year - a.year
      if (sort === 'year-asc') return a.year - b.year
      const aTitle = (a.title as Record<string, string>)[locale] ?? a.title.ru
      const bTitle = (b.title as Record<string, string>)[locale] ?? b.title.ru
      return aTitle.localeCompare(bTitle)
    })

    return result
  }, [query, fuse, decade, genres, mediaType, language, director, studio, yearFrom, yearTo, sort, locale, allFilms, personNameMap])

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = paginated.length < filtered.length

  const pageTitle = locale === 'kk' ? 'Фильмдер' : locale === 'en' ? 'Films' : 'Фильмы'
  const totalLabel = allFilms.length > 0 ? filtered.length : '...'
  const pageSubtitle = locale === 'kk'
    ? `${totalLabel} фильм табылды`
    : locale === 'en'
    ? `${totalLabel} films found`
    : `Найдено ${totalLabel} фильмов`

  return (
    <div>
      {/* Cinematic header — theme-aware */}
      <section className="relative py-14 overflow-hidden bg-[rgb(var(--surface))]">
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <svg viewBox="0 0 240 64" className="w-full h-full text-[rgb(var(--foreground))]" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
            <defs>
              <pattern id="films-pattern" x="0" y="0" width="240" height="64" patternUnits="userSpaceOnUse">
                <path d="M0,32 C50,8 90,8 120,32 C150,56 190,56 240,32" strokeWidth="2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#films-pattern)"/>
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-[rgb(var(--foreground))] mb-3">{pageTitle}</h1>
          <p className="text-[rgb(var(--muted))]">{pageSubtitle}</p>
          <p className="text-[rgb(var(--muted))] text-sm italic mt-1">
            {locale === 'kk' ? 'Жады жолдары ретінде фильмдер' : locale === 'en' ? 'Films as lines of memory' : 'Фильмы как линии памяти'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search + sort + filters row */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              className="pl-10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="px-3 py-2 rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--card))] text-sm"
          >
            <option value="year-desc">{t('filter.sortYear')} ↓</option>
            <option value="year-asc">{t('filter.sortYear')} ↑</option>
            <option value="title">{t('filter.sortTitle')}</option>
          </select>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                {locale === 'kk' ? 'Сүзгілер' : locale === 'en' ? 'Filters' : 'Фильтры'}
                {(decade.length > 0 || genres.length > 0 || mediaType || language || !!director || yearFrom > 0 || yearTo > 0) && (
                  <span className="w-2 h-2 rounded-full bg-[rgb(var(--accent))]" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto">
              <div className="mt-6">
                <FiltersPanel />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex gap-1">
            <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Genre chips — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 mb-3">
          {GENRE_SLUGS.map((g) => (
            <button
              key={g}
              onClick={() => {
                setPage(1)
                setFilter('genres', genres.includes(g) ? genres.filter((x) => x !== g) : [...genres, g])
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                genres.includes(g)
                  ? 'bg-[rgb(var(--accent))] text-black'
                  : 'bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]/50 hover:text-[rgb(var(--foreground))]'
              }`}
            >
              {t(`genres.${g}`)}
            </button>
          ))}
        </div>

        {/* Decade chips — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 mb-4">
          {DECADES.map((d) => (
            <button
              key={d}
              onClick={() => { setPage(1); toggleDecade(d) }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                decade.includes(d)
                  ? 'bg-[rgb(var(--accent))]/20 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/50'
                  : 'bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]/30'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Active filters bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-[rgb(var(--muted))]">
              {locale === 'kk' ? 'Белсенді сүзгілер:' : locale === 'en' ? 'Active filters:' : 'Активные фильтры:'}
            </span>
            <button
              onClick={() => { resetFilters(); setPage(1) }}
              className="text-xs text-[rgb(var(--accent))] hover:underline"
            >
              {locale === 'kk' ? 'Барлығын тазалау' : locale === 'en' ? 'Clear all' : 'Сбросить все'}
            </button>
          </div>
        )}

        {/* Film grid — full width */}
        {allFilms.length === 0 ? (
          <FilmGridSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState title={t('noResults')} description={t('noResultsHint')} />
        ) : (
          <>
            <div className={
              view === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                : 'flex flex-col gap-4'
            }>
              {paginated.map((film) => (
                <FilmCard key={film.slug} film={film} locale={locale} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)} className="px-8">
                  {t('filter.loadMore')} ({filtered.length - paginated.length})
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function FilmsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><FilmGridSkeleton /></div>}>
      <FilmsContent />
    </Suspense>
  )
}
