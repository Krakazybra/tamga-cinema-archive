'use client'
import { useEffect, useState, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSearchStore } from '@/store'
import { buildSearchIndex, search } from '@/lib/search'
import type { Film, Person, Collection } from '@/types'
import { EmptyState } from '@/components/shared/EmptyState'

type ResultItem = {
  type: 'film' | 'person' | 'collection'
  slug: string
  titleRu: string
  titleKk: string
  titleEn: string
  subtitle: string
  image: string
}

export default function SearchPage() {
  const locale = useLocale()
  const t = useTranslations('search')
  const { query, setQuery, recentSearches, addRecentSearch, clearRecent } = useSearchStore()
  const [results, setResults] = useState<ResultItem[]>([])
  const [debounced, setDebounced] = useState('')
  const [indexReady, setIndexReady] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/films').then((r) => r.json()),
      fetch('/api/persons').then((r) => r.json()),
      fetch('/api/collections').then((r) => r.json()),
    ]).then(([films, persons, collections]: [Film[], Person[], Collection[]]) => {
      buildSearchIndex(films, persons, collections)
      setIndexReady(true)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!indexReady) return
    if (debounced) {
      const res = search(debounced) as ResultItem[]
      setResults(res)
    } else {
      setResults([])
    }
  }, [debounced, indexReady])

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
    if (q.trim()) addRecentSearch(q.trim())
  }, [setQuery, addRecentSearch])

  const typeHref = (type: string, slug: string) => {
    if (type === 'film') return `/${locale}/films/${slug}`
    if (type === 'person') return `/${locale}/persons/${slug}`
    return `/${locale}/collections/${slug}`
  }

  const typeLabel = (type: string) => {
    if (type === 'film') return t('searchIn.films')
    if (type === 'person') return t('searchIn.persons')
    return t('searchIn.collections')
  }

  const filmResults = results.filter((r) => r.type === 'film')
  const personResults = results.filter((r) => r.type === 'person')
  const collectionResults = results.filter((r) => r.type === 'collection')

  const titleField = locale === 'kk' ? 'titleKk' : locale === 'en' ? 'titleEn' : 'titleRu'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-6">{t('title')}</h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--muted))]" />
        <Input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('placeholder')}
          className="pl-12 pr-12 py-4 text-lg h-14"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!query && recentSearches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-[rgb(var(--muted))]">
              <Clock className="w-4 h-4" /> {t('recent')}
            </h2>
            <Button variant="ghost" size="sm" onClick={clearRecent} className="text-xs">
              {t('clear')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((r) => (
              <Badge
                key={r}
                variant="outline"
                className="cursor-pointer"
                onClick={() => handleSearch(r)}
              >
                {r}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && debounced === query && (
        <EmptyState title={t('noResults')} description={t('noResultsHint')} />
      )}

      {results.length > 0 && (
        <div className="space-y-8">
          {[
            { label: t('searchIn.films'), items: filmResults },
            { label: t('searchIn.persons'), items: personResults },
            { label: t('searchIn.collections'), items: collectionResults },
          ].filter((g) => g.items.length > 0).map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-semibold text-[rgb(var(--muted))] uppercase tracking-wide mb-3">
                {group.label} ({group.items.length})
              </h2>
              <div className="space-y-2">
                {group.items.slice(0, 5).map((item) => (
                  <Link
                    key={item.slug}
                    href={typeHref(item.type, item.slug)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[rgb(var(--surface))] transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={(item as Record<string, string>)[titleField]}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium group-hover:text-[rgb(var(--primary))] transition-colors truncate">
                        {(item as Record<string, string>)[titleField]}
                      </p>
                      {item.subtitle && (
                        <p className="text-sm text-[rgb(var(--muted))]">{item.subtitle}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {typeLabel(item.type)}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
