'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PersonCard } from '@/components/persons/PersonCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Person } from '@/types'
import { useParams } from 'next/navigation'

type Role = Person['role'] | 'all'

const roleLabels: Record<string, Record<Role, string>> = {
  kk: {
    all: 'Барлығы',
    director: 'Режиссерлер',
    actor: 'Актерлер',
    cinematographer: 'Операторлар',
    writer: 'Сценаристтер',
    producer: 'Продюсерлер',
  },
  ru: {
    all: 'Все',
    director: 'Режиссёры',
    actor: 'Актёры',
    cinematographer: 'Операторы',
    writer: 'Сценаристы',
    producer: 'Продюсеры',
  },
  en: {
    all: 'All',
    director: 'Directors',
    actor: 'Actors',
    cinematographer: 'Cinematographers',
    writer: 'Screenwriters',
    producer: 'Producers',
  },
}

const pageTitles = {
  kk: { title: 'Тұлғалар', subtitle: 'Қазақ киносының режиссерлері, актерлері және шеберлері' },
  ru: { title: 'Личности', subtitle: 'Режиссёры, актёры и мастера казахского кино' },
  en: { title: 'People', subtitle: 'Directors, actors and masters of Kazakh cinema' },
}

export default function PersonsPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'
  const [activeRole, setActiveRole] = useState<Role>('all')
  const [search, setSearch] = useState('')
  const [persons, setPersons] = useState<Person[]>([])
  const labels = roleLabels[locale] || roleLabels.ru
  const { title, subtitle } = pageTitles[locale as keyof typeof pageTitles] || pageTitles.ru

  useEffect(() => {
    fetch('/api/persons').then((r) => r.json()).then(setPersons)
  }, [])

  const tabs: Role[] = ['all', 'director', 'actor', 'cinematographer', 'writer', 'producer']

  const filtered = persons.filter((p) => {
    const matchRole = activeRole === 'all' || p.role === activeRole
    if (!matchRole) return false
    if (!search) return true
    const q = search.toLowerCase()
    const name = p.name as Record<string, string>
    return (
      (name.ru ?? '').toLowerCase().includes(q) ||
      (name.kk ?? '').toLowerCase().includes(q) ||
      (name.en ?? '').toLowerCase().includes(q)
    )
  })

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
            TAMGA · {persons.length}{' '}
            {locale === 'kk' ? 'тұлға' : locale === 'en' ? 'people' : 'персон'}
          </p>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-[rgb(var(--foreground))] mb-3">
            {title}
          </h1>
          <p className="text-[rgb(var(--muted))] text-lg max-w-2xl">{subtitle}</p>
        </motion.div>
      </section>

      {/* SEARCH */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--muted))]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={locale === 'kk' ? 'Тұлға іздеу...' : locale === 'en' ? 'Search people...' : 'Поиск по имени...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))]/50 text-sm focus:outline-none focus:border-[rgb(var(--accent))]/50 transition-colors"
          />
        </div>
      </section>

      {/* ROLE TABS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRole(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeRole === tab
                  ? 'bg-[rgb(var(--accent))] text-black'
                  : 'bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 text-[rgb(var(--muted))] hover:border-[rgb(var(--accent))]/40 hover:text-[rgb(var(--foreground))]'
              }`}
            >
              {labels[tab]}
              <span className="ml-1.5 text-xs opacity-60">
                ({tab === 'all' ? persons.length : persons.filter((p) => p.role === tab).length})
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        {filtered.length === 0 ? (
          <EmptyState
            title={locale === 'kk' ? 'Тұлғалар табылмады' : locale === 'en' ? 'No people found' : 'Персоналии не найдены'}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeRole}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {filtered.map((person, i) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <PersonCard person={person} locale={locale} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </main>
  )
}
