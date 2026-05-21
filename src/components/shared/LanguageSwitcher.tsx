'use client'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const locales = [
  { code: 'kk', label: 'ҚАЗ' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const withoutLocale = pathname.replace(/^\/(kk|ru|en)/, '') || '/'

  return (
    <div className="flex items-center gap-1">
      {locales.map(({ code, label }) => (
        <Link
          key={code}
          href={`/${code}${withoutLocale}`}
          scroll={false}
          className={`text-xs px-2 py-1 h-auto rounded-md transition-colors ${
            locale === code
              ? 'text-[rgb(var(--accent))] font-bold'
              : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}
