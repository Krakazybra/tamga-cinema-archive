'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { TimelineEvent } from '@/types'
import { useParams } from 'next/navigation'

const MIN_YEAR = 1934
const MAX_YEAR = 2026
const SPAN = MAX_YEAR - MIN_YEAR
const DECADE_MARKS = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]

const typeColors: Record<TimelineEvent['type'], string> = {
  film: 'bg-[rgb(var(--accent))]',
  event: 'bg-sky-500',
  milestone: 'bg-emerald-500',
}

const typeDotBg: Record<TimelineEvent['type'], string> = {
  film: 'rgb(var(--accent))',
  event: '#38bdf8',
  milestone: '#10b981',
}

const typeLabels: Record<string, Record<TimelineEvent['type'], string>> = {
  kk: { film: 'Фильм', event: 'Оқиға', milestone: 'Маңызды оқиға' },
  ru: { film: 'Фильм', event: 'Событие', milestone: 'Этапное событие' },
  en: { film: 'Film', event: 'Event', milestone: 'Milestone' },
}

const pageTitles = {
  kk: { title: 'Хронология' },
  ru: { title: 'Хронология' },
  en: { title: 'Timeline' },
}

interface CardProps {
  event: TimelineEvent
  locale: string
  tTypes: Record<TimelineEvent['type'], string>
}

function TimelineCard({ event, locale, tTypes }: CardProps) {
  const loc = locale as 'kk' | 'ru' | 'en'
  return (
    <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 overflow-hidden hover:border-[rgb(var(--accent))]/40 transition-colors group">
      <div className="flex flex-col sm:flex-row">
        {event.image && (
          <div className="relative w-full sm:w-52 h-44 sm:h-auto shrink-0">
            <Image src={event.image} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 208px" />
          </div>
        )}
        <div className="p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${typeColors[event.type]}`} />
            <span className="text-xs text-[rgb(var(--muted))] uppercase tracking-wide">{tTypes[event.type]}</span>
          </div>
          <h3 className="font-display font-bold text-[rgb(var(--foreground))] mb-2 text-base sm:text-lg leading-snug group-hover:text-[rgb(var(--accent))] transition-colors">
            {event.title[loc]}
          </h3>
          <p className="text-[rgb(var(--muted))] text-sm leading-relaxed">
            {event.description[loc]}
          </p>
          {event.filmSlug && (
            <Link
              href={`/${locale}/films/${event.filmSlug}`}
              className="inline-block mt-3 text-[rgb(var(--accent))] text-sm font-medium hover:underline"
            >
              {locale === 'kk' ? 'Фильмді ашу →' : locale === 'en' ? 'View film →' : 'Смотреть фильм →'}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TimelinePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'
  const tTypes = typeLabels[locale] || typeLabels.ru
  const { title } = pageTitles[locale as keyof typeof pageTitles] || pageTitles.ru

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [rangeFrom, setRangeFrom] = useState(MIN_YEAR)
  const [rangeTo, setRangeTo] = useState(MAX_YEAR)
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/timeline').then((r) => r.json()).then(setTimelineEvents)
  }, [])

  // Refs hold current values so event handlers never go stale
  const draggingRef = useRef<'left' | 'right' | null>(null)
  const rangeFromRef = useRef(MIN_YEAR)
  const rangeToRef = useRef(MAX_YEAR)

  const yearToPct = (year: number) => ((year - MIN_YEAR) / SPAN) * 100

  const getYearFromMouseX = useCallback((clientX: number) => {
    if (!rulerRef.current) return MIN_YEAR
    const rect = rulerRef.current.getBoundingClientRect()
    if (rect.width === 0) return MIN_YEAR
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    return Math.round(MIN_YEAR + (pct / 100) * SPAN)
  }, [])

  // Pointer events + setPointerCapture: works identically for mouse and
  // touch, and keeps receiving moves even when the pointer leaves the handle.
  const handlePointerDown = (side: 'left' | 'right') => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    draggingRef.current = side
    setDragging(side)
  }

  const handlePointerMove = (side: 'left' | 'right') => (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current !== side) return
    const year = getYearFromMouseX(e.clientX)
    if (side === 'left') {
      const newFrom = Math.min(year, rangeToRef.current - 1)
      rangeFromRef.current = newFrom
      setRangeFrom(newFrom)
    } else {
      const newTo = Math.max(year, rangeFromRef.current + 1)
      rangeToRef.current = newTo
      setRangeTo(newTo)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    draggingRef.current = null
    setDragging(null)
  }

  const { filtered, groupedByYear, years } = useMemo(() => {
    const f = timelineEvents
      .filter((e) => e.year >= rangeFrom && e.year <= rangeTo)
      .sort((a, b) => a.year - b.year)
    const g = f.reduce((acc, evt) => {
      if (!acc[evt.year]) acc[evt.year] = []
      acc[evt.year].push(evt)
      return acc
    }, {} as Record<number, TimelineEvent[]>)
    return { filtered: f, groupedByYear: g, years: Object.keys(g).map(Number).sort((a, b) => a - b) }
  }, [timelineEvents, rangeFrom, rangeTo])

  const fromPct = yearToPct(rangeFrom)
  const toPct = yearToPct(rangeTo)
  const isFullRange = rangeFrom === MIN_YEAR && rangeTo === MAX_YEAR

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] pt-20">

      {/* HERO */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-4">
            TAMGA · 1934–2026
          </p>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-[rgb(var(--foreground))] mb-2">
            {title}
          </h1>
          <p className="text-2xl md:text-3xl font-display font-bold text-[rgb(var(--accent))] mb-3">
            {rangeFrom} — {rangeTo}
          </p>
          <p className="text-[rgb(var(--muted))] text-lg">
            {filtered.length}{' '}
            {locale === 'kk' ? 'оқиға' : locale === 'en' ? 'events' : 'событий'}
          </p>
        </motion.div>
      </section>

      {/* RULER */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="relative py-6">
          <div ref={rulerRef} className="relative h-6 select-none">

            {/* Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-[rgb(var(--border))]/25 rounded-full" />

            {/* Selected range */}
            <div
              className="absolute top-1/2 h-1 -translate-y-1/2 bg-[rgb(var(--accent))]/60 rounded-full pointer-events-none"
              style={{ left: `${fromPct}%`, width: `${toPct - fromPct}%` }}
            />

            {/* Decade ticks */}
            {DECADE_MARKS.map((d) => {
              const pct = yearToPct(d)
              const inRange = d >= rangeFrom && d <= rangeTo
              return (
                <div
                  key={d}
                  className="absolute flex flex-col items-center pointer-events-none"
                  style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                >
                  <div
                    className="w-px h-3 mt-0.5 transition-colors"
                    style={{ backgroundColor: inRange ? 'rgb(var(--accent) / 0.6)' : 'rgb(var(--muted) / 0.2)' }}
                  />
                </div>
              )
            })}

            {/* Event dots */}
            {timelineEvents.map((evt) => {
              const pct = yearToPct(evt.year)
              const inRange = evt.year >= rangeFrom && evt.year <= rangeTo
              return (
                <div
                  key={evt.id}
                  className="absolute w-2 h-2 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity"
                  style={{
                    left: `${pct}%`,
                    backgroundColor: typeDotBg[evt.type],
                    opacity: inRange ? 0.9 : 0.15,
                  }}
                  title={evt.year.toString()}
                />
              )
            })}

            {/* Left handle */}
            <div
              className={`absolute top-1/2 w-5 h-5 rounded-full bg-[rgb(var(--accent))] border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-ew-resize shadow-md z-10 hover:scale-110 transition-transform ${dragging === 'left' ? 'scale-125' : ''}`}
              style={{ left: `${fromPct}%`, touchAction: 'none' }}
              onPointerDown={handlePointerDown('left')}
              onPointerMove={handlePointerMove('left')}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />

            {/* Right handle */}
            <div
              className={`absolute top-1/2 w-5 h-5 rounded-full bg-[rgb(var(--accent))] border-2 border-white -translate-x-1/2 -translate-y-1/2 cursor-ew-resize shadow-md z-20 hover:scale-110 transition-transform ${dragging === 'right' ? 'scale-125' : ''}`}
              style={{ left: `${toPct}%`, touchAction: 'none' }}
              onPointerDown={handlePointerDown('right')}
              onPointerMove={handlePointerMove('right')}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>

          {/* Decade labels */}
          <div className="relative mt-2 h-4">
            {DECADE_MARKS.map((d) => {
              const pct = yearToPct(d)
              const inRange = d >= rangeFrom && d <= rangeTo
              return (
                <span
                  key={d}
                  className="absolute text-[10px] select-none transition-colors"
                  style={{
                    left: `${pct}%`,
                    transform: 'translateX(-50%)',
                    color: inRange ? 'rgb(var(--muted) / 0.7)' : 'rgb(var(--muted) / 0.25)',
                  }}
                >
                  {d}
                </span>
              )
            })}
          </div>

          {/* Handle year labels */}
          {!isFullRange && (
            <div className="relative mt-3 h-5">
              <span
                className="absolute text-xs font-medium text-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10 px-2 py-0.5 rounded-full -translate-x-1/2"
                style={{ left: `${fromPct}%` }}
              >
                {rangeFrom}
              </span>
              <span
                className="absolute text-xs font-medium text-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10 px-2 py-0.5 rounded-full -translate-x-1/2"
                style={{ left: `${toPct}%` }}
              >
                {rangeTo}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* LEGEND */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="flex gap-6 flex-wrap">
          {(Object.entries(typeColors) as [TimelineEvent['type'], string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-[rgb(var(--muted))] text-sm">{tTypes[type]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS grouped by year */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${rangeFrom}-${rangeTo}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {years.length === 0 ? (
              <div className="text-center py-20 text-[rgb(var(--muted))]">
                {locale === 'kk' ? 'Оқиғалар табылмады' : locale === 'en' ? 'No events found' : 'События не найдены'}
              </div>
            ) : (
              years.map((year) => (
                <div key={year} className="mb-14">
                  <div className="flex items-center gap-5 mb-6">
                    <span
                      className="text-5xl md:text-6xl font-display font-bold leading-none flex-shrink-0 select-none"
                      style={{ color: 'rgb(var(--accent) / 0.18)' }}
                    >
                      {year}
                    </span>
                    <div className="flex-1 h-px bg-[rgb(var(--border))]/20" />
                  </div>
                  <div className="space-y-4">
                    {groupedByYear[year].map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                      >
                        <TimelineCard event={event} locale={locale} tTypes={tTypes} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  )
}
