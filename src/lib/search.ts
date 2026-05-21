import Fuse from 'fuse.js'
import type { Film, Person, Collection } from '@/types'

type SearchItem = {
  type: 'film' | 'person' | 'collection'
  slug: string
  titleRu: string
  titleKk: string
  titleEn: string
  subtitle: string
  image: string
  extra: string
}

let fuseInstance: Fuse<SearchItem> | null = null
let indexData: SearchItem[] = []

export function buildSearchIndex(
  films: Film[],
  persons: Person[],
  collections: Collection[]
) {
  const personMap = new Map(persons.map((p) => [p.slug, p.name]))

  indexData = [
    ...films.map((f) => {
      const dirName = personMap.get(f.director)
      const cineName = personMap.get(f.cinematographer)
      const writerName = personMap.get(f.screenwriter)
      return {
        type: 'film' as const,
        slug: f.slug,
        titleRu: f.title.ru,
        titleKk: f.title.kk,
        titleEn: f.title.en,
        subtitle: String(f.year),
        image: f.poster,
        extra: [
          ...f.tags,
          f.director,
          dirName?.ru ?? '', dirName?.kk ?? '', dirName?.en ?? '',
          f.cinematographer,
          cineName?.ru ?? '', cineName?.kk ?? '',
          f.screenwriter,
          writerName?.ru ?? '', writerName?.kk ?? '',
          f.studio?.ru ?? '', f.studio?.kk ?? '', f.studio?.en ?? '',
        ].filter(Boolean).join(' '),
      }
    }),
    ...persons.map((p) => ({
      type: 'person' as const,
      slug: p.slug,
      titleRu: p.name.ru,
      titleKk: p.name.kk,
      titleEn: p.name.en,
      subtitle: p.role,
      image: p.photo,
      extra: '',
    })),
    ...collections.map((c) => ({
      type: 'collection' as const,
      slug: c.slug,
      titleRu: c.title.ru,
      titleKk: c.title.kk,
      titleEn: c.title.en,
      subtitle: '',
      image: c.cover,
      extra: '',
    })),
  ]

  fuseInstance = new Fuse(indexData, {
    keys: ['titleRu', 'titleKk', 'titleEn', 'extra'],
    threshold: 0.4,
    includeMatches: true,
  })
}

export function search(query: string): SearchItem[] {
  if (!query.trim() || !fuseInstance) return []
  return fuseInstance.search(query).map((r) => r.item)
}
