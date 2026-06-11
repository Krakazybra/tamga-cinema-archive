// TODO: Session B — replace with full implementation
export interface LocalizedString {
  kk: string
  ru: string
  en: string
  [key: string]: string
}

export interface Film {
  id: string
  slug: string
  title: LocalizedString
  year: number
  decade: string
  genres: string[]
  genresRu?: string[]
  genresKk?: string[]
  tags: string[]
  synopsis: LocalizedString
  poster: string
  banner: string
  gallery: string[]
  director: string
  cinematographer: string
  screenwriter: string
  cast: string[]
  studio: LocalizedString
  duration: number
  language: 'kk' | 'ru' | 'mixed'
  mediaType: 'film' | 'documentary' | 'short' | 'animation'
  archiveId: string
  collections: string[]
  relatedFilms: string[]
  featured: boolean
  historicalRelevance: number
  videoUrl?: string
}

export interface Person {
  id: string
  slug: string
  name: LocalizedString
  role: 'director' | 'cinematographer' | 'actor' | 'writer' | 'producer'
  bio: LocalizedString
  birthYear: number
  deathYear?: number
  photo: string
  films: string[]
  featured: boolean
}

export interface Collection {
  id: string
  slug: string
  title: LocalizedString
  description: LocalizedString
  curatorNotes: LocalizedString
  cover: string
  films: string[]
  era: string
}

export interface TimelineEvent {
  id: string
  year: number
  title: LocalizedString
  description: LocalizedString
  type: 'film' | 'event' | 'milestone'
  filmSlug?: string
  image?: string
  era: 'early' | 'soviet' | 'independence' | 'modern'
}
