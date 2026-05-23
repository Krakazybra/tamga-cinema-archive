'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { persons } from '@/data/persons'
import { getGenreLabel } from '@/lib/genres'
import type { Film } from '@/types'

interface FilmCardProps {
  film: Film
  locale: string
}

const personMap = new Map(persons.map((p) => [p.slug, p.name]))

export function FilmCard({ film, locale }: FilmCardProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session?.user) {
      toast.error(locale === 'kk' ? 'Лайк басу үшін кіріңіз' : locale === 'en' ? 'Sign in to like films' : 'Войдите, чтобы поставить лайк')
      return
    }
    const res = await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filmSlug: film.slug }),
    })
    if (res.ok) {
      const data = await res.json()
      setLiked(data.liked)
      setLikeCount((c) => (data.liked ? c + 1 : c - 1))
    }
  }

  const title = (film.title as Record<string, string>)[locale] ?? film.title.ru
  const dirName = personMap.get(film.director)
  const dirLabel = dirName
    ? (dirName as Record<string, string>)[locale] ?? dirName.ru
    : film.director.replace(/-/g, ' ')

  return (
    <div className="group relative">
      <Link href={`/${locale}/films/${film.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-[rgb(var(--surface))]">
          <div className="aspect-[2/3] relative overflow-hidden">
            {film.poster && (
              <Image
                src={film.poster}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
                <div className="flex flex-wrap gap-1">
                  {film.genres.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-[rgb(var(--accent))]/20 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/30"
                    >
                      {getGenreLabel(g, locale)}
                    </span>
                  ))}
                </div>
                <p className="text-white/80 text-xs line-clamp-2">
                  {(film.synopsis as Record<string, string>)[locale]?.slice(0, 80) ?? ''}…
                </p>
              </div>
            </div>
          </div>

          <span className="absolute top-2 left-2 text-xs bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-md font-medium">
            {film.year}
          </span>
        </div>

        <div className="mt-2 px-1">
          <h3 className="font-semibold text-sm line-clamp-2 text-[rgb(var(--foreground))] group-hover:text-[rgb(var(--primary))] transition-colors">
            {title}
          </h3>
          <p className="text-xs text-[rgb(var(--accent))] mt-0.5 line-clamp-1">
            {film.genres.slice(0, 2).map((g) => getGenreLabel(g, locale)).join(' · ')}
          </p>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs text-[rgb(var(--muted))] capitalize">{dirLabel}</p>
            {likeCount > 0 && (
              <span className="text-xs text-[rgb(var(--muted))] flex items-center gap-1">
                <Heart className="w-3 h-3" /> {likeCount}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={toggleLike}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        aria-label={locale === 'kk' ? 'Ұнайды' : locale === 'en' ? 'Like' : 'Нравится'}
      >
        <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
      </button>
    </div>
  )
}
