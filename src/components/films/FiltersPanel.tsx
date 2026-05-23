'use client'
import { useTranslations } from 'next-intl'
import { useFiltersStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const DECADES = ['1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
const GENRE_SLUGS = ['drama', 'thriller', 'historical', 'comedy', 'documentary', 'animation', 'epic', 'romance', 'action', 'art-house', 'folk', 'war', 'crime', 'adventure', 'spy', 'neo-noir', 'psychological', 'biography', 'children', 'fantasy', 'melodrama'] as const
const MEDIA_TYPE_SLUGS = ['film', 'documentary', 'short', 'animation'] as const
const LANGUAGE_SLUGS = ['kk', 'ru', 'mixed'] as const

export function FiltersPanel() {
  const t = useTranslations('films')
  const { decade, genres: selectedGenres, mediaType, language, director, studio, yearFrom, yearTo, setFilter, resetFilters } = useFiltersStore()

  const toggleDecade = (d: string) => {
    setFilter('decade', decade.includes(d) ? decade.filter((x) => x !== d) : [...decade, d])
  }

  const toggleGenre = (g: string) => {
    setFilter('genres', selectedGenres.includes(g) ? selectedGenres.filter((x) => x !== g) : [...selectedGenres, g])
  }

  const hasFilters = decade.length > 0 || selectedGenres.length > 0 || mediaType || language || director || studio || yearFrom > 0 || yearTo > 0

  return (
    <aside className="w-full space-y-6">
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          {t('filter.reset')}
        </Button>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-3 text-[rgb(var(--foreground))]">{t('filter.decade')}</h3>
        <div className="flex flex-wrap gap-2">
          {DECADES.map((d) => (
            <Badge
              key={d}
              variant={decade.includes(d) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleDecade(d)}
            >
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-[rgb(var(--foreground))]">{t('filter.genre')}</h3>
        <div className="flex flex-wrap gap-2">
          {GENRE_SLUGS.map((g) => (
            <Badge
              key={g}
              variant={selectedGenres.includes(g) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleGenre(g)}
            >
              {t(`genres.${g}`)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-[rgb(var(--foreground))]">{t('filter.mediaType')}</h3>
        <div className="flex flex-col gap-2">
          {MEDIA_TYPE_SLUGS.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="mediaType"
                checked={mediaType === type}
                onChange={() => setFilter('mediaType', mediaType === type ? '' : type)}
                className="accent-[rgb(var(--primary))]"
              />
              {t(`mediaTypes.${type}`)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-[rgb(var(--foreground))]">{t('filter.language')}</h3>
        <div className="flex flex-col gap-2">
          {LANGUAGE_SLUGS.map((lang) => (
            <label key={lang} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="language"
                checked={language === lang}
                onChange={() => setFilter('language', language === lang ? '' : lang)}
                className="accent-[rgb(var(--primary))]"
              />
              {t(`languages.${lang}`)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-[rgb(var(--foreground))]">{t('detail.director')}</h3>
        <Input
          placeholder="..."
          value={director}
          onChange={(e) => setFilter('director', e.target.value)}
          className="text-sm h-8"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-[rgb(var(--foreground))]">{t('detail.year')}</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="1934"
            min={1934}
            max={2025}
            value={yearFrom > 0 ? yearFrom : ''}
            onChange={(e) => setFilter('yearFrom', e.target.value ? Number(e.target.value) : 0)}
            className="text-sm h-8 w-20"
          />
          <span className="text-[rgb(var(--muted))] text-xs">—</span>
          <Input
            type="number"
            placeholder="2025"
            min={1934}
            max={2025}
            value={yearTo > 0 ? yearTo : ''}
            onChange={(e) => setFilter('yearTo', e.target.value ? Number(e.target.value) : 0)}
            className="text-sm h-8 w-20"
          />
        </div>
      </div>
    </aside>
  )
}
