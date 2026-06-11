import Image from 'next/image'
import Link from 'next/link'
import { getGenreLabel } from '@/lib/genres'
import type { Film } from '@/types'

interface Props {
  film: Film
  locale: string
  personNames?: Record<string, Record<string, string>>
}

export function FilmCardLandscape({ film, locale, personNames }: Props) {
  const title = (film.title as Record<string, string>)[locale] ?? film.title.ru
  const dirName = personNames?.[film.director]
  const dirLabel = dirName
    ? (dirName as Record<string, string>)[locale] ?? dirName.ru
    : film.director.replace(/-/g, ' ')

  return (
    <Link href={`/${locale}/films/${film.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[rgb(var(--card))]">
        {film.poster && (
          <Image
            src={film.poster}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 256px, 320px"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        {film.genres.slice(0, 1).map((g) => (
          <span
            key={g}
            className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/30"
          >
            {getGenreLabel(g, locale)}
          </span>
        ))}
        <span className="absolute top-2 right-2 text-xs bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-md font-medium">
          {film.year}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-semibold text-sm line-clamp-2 leading-snug mb-1">{title}</p>
          <p className="text-[rgb(var(--muted))] text-xs">{dirLabel}</p>
        </div>
      </div>
    </Link>
  )
}
