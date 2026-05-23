export const GENRE_LABELS: Record<string, { kk: string; ru: string; en: string }> = {
  thriller:      { kk: 'Триллер',        ru: 'Триллер',         en: 'Thriller' },
  historical:    { kk: 'Тарихи',         ru: 'Исторический',    en: 'Historical' },
  adventure:     { kk: 'Шытырман',       ru: 'Приключения',     en: 'Adventure' },
  drama:         { kk: 'Драма',          ru: 'Драма',           en: 'Drama' },
  romance:       { kk: 'Мелодрама',      ru: 'Мелодрама',       en: 'Romance' },
  folk:          { kk: 'Халықтық',       ru: 'Народный',        en: 'Folk' },
  action:        { kk: 'Боевик',         ru: 'Боевик',          en: 'Action' },
  spy:           { kk: 'Тыңшылар',       ru: 'Шпионский',       en: 'Spy' },
  'neo-noir':    { kk: 'Нео-нуар',       ru: 'Нео-нуар',        en: 'Neo-noir' },
  epic:          { kk: 'Эпикалық',       ru: 'Эпический',       en: 'Epic' },
  war:           { kk: 'Соғыс',          ru: 'Военный',         en: 'War' },
  psychological: { kk: 'Психологиялық',  ru: 'Психологический', en: 'Psychological' },
  comedy:        { kk: 'Комедия',        ru: 'Комедия',         en: 'Comedy' },
  biography:     { kk: 'Өмірбаяндық',   ru: 'Биографический',  en: 'Biography' },
  'art-house':   { kk: 'Арт-хаус',      ru: 'Арт-хаус',        en: 'Art-house' },
  animation:     { kk: 'Анимация',      ru: 'Анимация',        en: 'Animation' },
  children:      { kk: 'Балалар',       ru: 'Детский',         en: 'Children' },
  fantasy:       { kk: 'Фантастика',    ru: 'Фэнтези',         en: 'Fantasy' },
  melodrama:     { kk: 'Мелодрама',     ru: 'Мелодрама',       en: 'Melodrama' },
  crime:         { kk: 'Криминал',      ru: 'Криминал',        en: 'Crime' },
}

export function getGenreLabel(slug: string, locale: string): string {
  const loc = locale as 'kk' | 'ru' | 'en'
  return GENRE_LABELS[slug]?.[loc] ?? slug
}
