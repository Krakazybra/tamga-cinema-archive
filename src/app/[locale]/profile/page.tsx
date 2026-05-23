import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { FilmCard } from '@/components/films/FilmCard'
import { FileUpload } from '@/components/upload/FileUpload'
import { films } from '@/data/films'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string }>
}

type Tab = 'favorites' | 'comments' | 'upload' | 'settings'

const tabConfig = {
  kk: {
    favorites: 'Таңдаулылар',
    comments: 'Менің пікірлерім',
    upload: 'Файл жүктеу',
    settings: 'Параметрлер',
  },
  ru: {
    favorites: 'Избранные',
    comments: 'Мои комментарии',
    upload: 'Загрузка файлов',
    settings: 'Настройки',
  },
  en: {
    favorites: 'Favourites',
    comments: 'My Comments',
    upload: 'File Upload',
    settings: 'Settings',
  },
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { locale } = await params
  const { tab } = await searchParams
  const loc = locale as 'kk' | 'ru' | 'en'
  const session = await auth()

  if (!session?.user) {
    redirect(`/${loc}/auth/login`)
  }

  const activeTab = (tab as Tab) || 'favorites'
  const tabs = tabConfig[loc] || tabConfig.ru

  const [userLikes, userComments] = await Promise.all([
    db.like.findMany({ where: { userId: session.user.id! }, orderBy: { createdAt: 'desc' }, take: 20 }),
    db.comment.findMany({
      where: { userId: session.user.id! },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  const favFilms = films.filter((f) => userLikes.some((l) => l.filmSlug === f.slug))

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat(loc === 'kk' ? 'kk-KZ' : loc === 'en' ? 'en-US' : 'ru-RU', {
      year: 'numeric', month: 'long', day: 'numeric',
    }).format(d)

  return (
      <main className="min-h-screen bg-[rgb(var(--background))] pt-20">
        {/* HEADER */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[rgb(var(--border))]/20">
          <AnimatedSection>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-black text-2xl font-bold shrink-0">
                {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">{session.user.name || session.user.email}</h1>
                <p className="text-[rgb(var(--muted))]">{session.user.email}</p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* TABS NAV */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-1 border-b border-[rgb(var(--border))]/20 mt-6">
            {(Object.entries(tabs) as [Tab, string][]).map(([key, label]) => (
              <Link
                key={key}
                href={`/${loc}/profile?tab=${key}`}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === key
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* TAB CONTENT */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 pb-24">

          {/* FAVORITES */}
          {activeTab === 'favorites' && (
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">
                {tabs.favorites}
                <span className="ml-3 text-[rgb(var(--muted))] text-lg">({favFilms.length})</span>
              </h2>
              {favFilms.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-[rgb(var(--muted))] text-lg mb-4">
                    {loc === 'kk' ? 'Таңдаулы фильмдер жоқ' : loc === 'en' ? 'No favourite films' : 'Нет избранных фильмов'}
                  </p>
                  <Link href={`/${loc}/films`} className="text-amber-400 hover:underline">
                    {loc === 'kk' ? 'Каталогқа өту' : loc === 'en' ? 'Go to catalogue' : 'Перейти в каталог'}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {favFilms.map((film) => (
                    <FilmCard key={film.id} film={film} locale={loc} />
                  ))}
                </div>
              )}
            </AnimatedSection>
          )}

          {/* COMMENTS */}
          {activeTab === 'comments' && (
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">
                {tabs.comments}
                <span className="ml-3 text-[rgb(var(--muted))] text-lg">({userComments.length})</span>
              </h2>
              {userComments.length === 0 ? (
                <p className="text-[rgb(var(--muted))]">
                  {loc === 'kk' ? 'Пікірлер жоқ' : loc === 'en' ? 'No comments' : 'Нет комментариев'}
                </p>
              ) : (
                <div className="space-y-4">
                  {userComments.map((c) => (
                    <div key={c.id} className="p-5 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20">
                      <div className="flex items-center justify-between mb-3">
                        <Link
                          href={`/${loc}/films/${c.filmSlug}`}
                          className="text-amber-400 hover:underline font-semibold"
                        >
                          {films.find((f) => f.slug === c.filmSlug)?.title[loc] ?? c.filmSlug}
                        </Link>
                        <span className="text-[rgb(var(--muted))] text-sm">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-[rgb(var(--foreground))]/80">{c.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>
          )}

          {/* UPLOAD */}
          {activeTab === 'upload' && (
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-3">{tabs.upload}</h2>
              <p className="text-[rgb(var(--muted))] mb-8">
                {loc === 'kk'
                  ? 'Мұрағат материалдарын жүктеңіз: фотосуреттер, құжаттар, субтитрлер'
                  : loc === 'en'
                  ? 'Upload archival materials: photos, documents, subtitles'
                  : 'Загружайте архивные материалы: фотографии, документы, субтитры'}
              </p>
              <FileUpload />
            </AnimatedSection>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-8">{tabs.settings}</h2>
              <form className="max-w-lg space-y-6">
                <div>
                  <label className="block text-[rgb(var(--muted))] text-sm mb-2">
                    {loc === 'kk' ? 'Көрсетілетін атау' : loc === 'en' ? 'Display Name' : 'Отображаемое имя'}
                  </label>
                  <input
                    type="text"
                    defaultValue={session.user.name || ''}
                    className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] px-4 py-3 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[rgb(var(--muted))] text-sm mb-2">
                    {loc === 'kk' ? 'Интерфейс тілі' : loc === 'en' ? 'Interface Language' : 'Язык интерфейса'}
                  </label>
                  <select
                    defaultValue={loc}
                    className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] px-4 py-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="kk">Қазақша</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[rgb(var(--muted))] text-sm mb-2">
                    {loc === 'kk' ? 'Тақырып' : loc === 'en' ? 'Theme' : 'Тема'}
                  </label>
                  <select
                    defaultValue="light"
                    className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] px-4 py-3 focus:outline-none focus:border-amber-500"
                  >
                    <option value="dark">{loc === 'kk' ? 'Күңгірт' : loc === 'en' ? 'Dark' : 'Тёмная'}</option>
                    <option value="light">{loc === 'kk' ? 'Ашық' : loc === 'en' ? 'Light' : 'Светлая'}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors"
                >
                  {loc === 'kk' ? 'Сақтау' : loc === 'en' ? 'Save Changes' : 'Сохранить изменения'}
                </button>
              </form>
            </AnimatedSection>
          )}
        </section>
      </main>
  )
}
