'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { persons } from '@/data/persons'
import type { Film } from '@/types'

const personMap = new Map(persons.map((p) => [p.slug, p.name]))

interface Props {
  films: Film[]
  locale: string
}

export function HeroCarousel({ films, locale }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % films.length), 6000)
    return () => clearInterval(id)
  }, [films.length])

  if (!films.length) return null

  const film = films[current]
  const title = (film.title as Record<string, string>)[locale] ?? film.title.ru
  const synopsis = (film.synopsis as Record<string, string>)[locale] ?? film.synopsis.ru
  const directorName = personMap.get(film.director)
  const dirLabel = directorName
    ? (directorName as Record<string, string>)[locale] ?? directorName.ru
    : film.director.replace(/-/g, ' ')

  const watchLabel = locale === 'kk' ? 'Қарау →' : locale === 'en' ? 'Watch →' : 'Смотреть →'
  const moreLabel = locale === 'kk' ? 'Толығырақ' : locale === 'en' ? 'More info' : 'Подробнее'
  const directorLabel = locale === 'kk' ? 'Режиссер' : locale === 'en' ? 'Director' : 'Режиссёр'
  const archiveLabel = locale === 'kk' ? 'Мұрағат' : locale === 'en' ? 'Archive' : 'Архив'

  return (
    <section className="relative min-h-[88vh] flex items-end md:items-center overflow-hidden bg-zinc-950">
      {/* Backdrop */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <Image
            src={film.banner}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/98 via-zinc-950/60 to-zinc-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/30 md:from-zinc-950/70 md:to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-28 pt-24 md:py-20">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={current}
            className="flex items-end md:items-center gap-8 md:gap-12"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            {/* Content */}
            <div className="flex-1 max-w-2xl space-y-4">
              <p className="text-[rgb(var(--accent))] text-xs uppercase tracking-widest font-medium">
                TAMGA · {archiveLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {film.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2.5 py-0.5 rounded-full border border-[rgb(var(--accent))]/40 text-[rgb(var(--accent))]"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                {title}
              </h1>
              <p className="text-zinc-300 text-base leading-relaxed line-clamp-2">
                {synopsis}
              </p>
              <p className="text-zinc-400 text-sm">
                {directorLabel}:{' '}
                <span className="text-zinc-200">{dirLabel}</span>
                <span className="mx-2 text-zinc-600">·</span>
                <span className="text-zinc-400">{film.year}</span>
              </p>
              <div className="flex gap-3 pt-2">
                <Link
                  href={`/${locale}/films/${film.slug}`}
                  className="px-6 py-2.5 rounded-lg bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/90 text-black font-semibold text-sm transition-colors"
                >
                  {watchLabel}
                </Link>
                <Link
                  href={`/${locale}/films/${film.slug}`}
                  className="px-6 py-2.5 rounded-lg border border-white/25 hover:border-white/50 text-white text-sm transition-colors"
                >
                  {moreLabel}
                </Link>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrent((c) => (c - 1 + films.length) % films.length)}
          className="p-1.5 rounded-full border border-white/20 hover:border-white/50 text-white/60 hover:text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-2 items-center">
          {films.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-[rgb(var(--accent))]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((c) => (c + 1) % films.length)}
          className="p-1.5 rounded-full border border-white/20 hover:border-white/50 text-white/60 hover:text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
