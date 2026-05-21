'use client'
import Link from 'next/link'
import { Film } from 'lucide-react'
import { useLocale } from 'next-intl'
const navItems = [
  { href: '/films', labels: { kk: 'Фильмдер', ru: 'Фильмы', en: 'Films' } },
  { href: '/persons', labels: { kk: 'Тұлғалар', ru: 'Персоны', en: 'People' } },
  { href: '/collections', labels: { kk: 'Жинақтар', ru: 'Коллекции', en: 'Collections' } },
  { href: '/timeline', labels: { kk: 'Хронология', ru: 'Хронология', en: 'Timeline' } },
  { href: '/about', labels: { kk: 'Жоба туралы', ru: 'О проекте', en: 'About' } },
]

export function Footer() {
  const locale = useLocale()
  const loc = locale as 'kk' | 'ru' | 'en'

  return (
    <footer className="bg-[rgb(var(--surface))] border-t border-[rgb(var(--border))]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <Film className="w-5 h-5 text-[rgb(var(--accent))]" />
            <div>
              <span className="font-display font-bold text-[rgb(var(--foreground))]">TAMGA</span>
              <span className="text-[rgb(var(--muted))] text-xs ml-2 hidden sm:inline">
                {loc === 'kk' ? 'Қазақ киносының мұрағаты' : loc === 'en' ? 'Kazakh Cinema Archive' : 'Архив казахского кино'}
              </span>
            </div>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {navItems.map(({ href, labels }) => (
              <Link
                key={href}
                href={`/${locale}${href}`}
                className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
              >
                {labels[loc]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/kazfilm.kz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@kazfilm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[rgb(var(--muted))] hover:text-[rgb(var(--accent))] transition-colors"
              >
                YouTube
              </a>
            </div>
            <span className="text-[rgb(var(--muted))] text-xs">© 2026 TAMGA</span>
          </div>

        </div>
      </div>
    </footer>
  )
}
