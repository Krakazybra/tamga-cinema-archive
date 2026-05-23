import Image from 'next/image'
import Link from 'next/link'
import type { Person } from '@/types'

const roleLabels: Record<string, Record<string, string>> = {
  kk: {
    director: 'Режиссер',
    cinematographer: 'Оператор-қоюшы',
    actor: 'Актер',
    writer: 'Сценарист',
    producer: 'Продюсер',
  },
  ru: {
    director: 'Режиссёр',
    cinematographer: 'Оператор',
    actor: 'Актёр',
    writer: 'Сценарист',
    producer: 'Продюсер',
  },
  en: {
    director: 'Director',
    cinematographer: 'Cinematographer',
    actor: 'Actor',
    writer: 'Screenwriter',
    producer: 'Producer',
  },
}

interface PersonCardProps {
  person: Person
  locale: string
  variant?: 'default' | 'mini'
}

export function PersonCard({ person, locale, variant = 'default' }: PersonCardProps) {
  const name = (person.name as Record<string, string>)[locale] ?? person.name.ru
  const roleLabel = (roleLabels[locale] ?? roleLabels.ru)[person.role] ?? person.role

  if (variant === 'mini') {
    return (
      <Link href={`/${locale}/persons/${person.slug}`} className="flex items-center gap-3 group">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image src={person.photo} alt={name} fill className="object-cover" sizes="48px" />
        </div>
        <div>
          <p className="text-sm font-medium group-hover:text-[rgb(var(--accent))] transition-colors">
            {name}
          </p>
          <p className="text-xs text-[rgb(var(--muted))]">{roleLabel}</p>
        </div>
      </Link>
    )
  }

  const bio = (person.bio as Record<string, string>)[locale] ?? (person.bio as Record<string, string>).ru ?? ''

  const yearsText = person.birthYear
    ? `${person.birthYear}${person.deathYear ? `–${person.deathYear}` : ''}`
    : (locale === 'kk' ? 'Жылдар белгісіз' : locale === 'en' ? 'Years unknown' : 'Годы не указаны')

  const derivedTags = [
    roleLabel,
    person.birthYear ? `${Math.floor((person.birthYear + 25) / 10) * 10}s` : null,
  ].filter(Boolean) as string[]

  return (
    <Link href={`/${locale}/persons/${person.slug}`} className="group block">
      <div className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 overflow-hidden hover:border-[rgb(var(--accent))]/40 transition-all h-full flex flex-col">
        {/* Image area */}
        <div className="relative aspect-[3/4] bg-[rgb(var(--surface))] overflow-hidden flex-shrink-0">
          <Image
            src={person.photo}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
          {/* Placeholder silhouette */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 80 80" className="w-20 h-20 text-[rgb(var(--muted))]/20" fill="currentColor">
              <circle cx="40" cy="28" r="16" />
              <path d="M10 72 C10 52 70 52 70 72" />
            </svg>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[10px] uppercase tracking-widest font-medium text-[rgb(var(--accent))] mb-1">
            {roleLabel}
          </p>
          <h3 className="font-display font-bold text-[rgb(var(--foreground))] text-base leading-tight mb-1 group-hover:text-[rgb(var(--accent))] transition-colors line-clamp-2">
            {name}
          </h3>
          <p className="text-[rgb(var(--muted))] text-xs mb-2">{yearsText}</p>
          {bio && (
            <p className="text-[rgb(var(--muted))] text-xs line-clamp-2 leading-relaxed mb-3 flex-1">
              {bio}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mt-auto">
            {derivedTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full border border-[rgb(var(--border))]/40 text-[rgb(var(--muted))]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
