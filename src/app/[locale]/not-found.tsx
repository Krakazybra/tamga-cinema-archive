'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function NotFound() {
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'ru'

  const t = {
    kk: {
      title: '404',
      subtitle: 'Бет табылмады',
      text: 'Іздеген бетіңіз жоқ немесе орын ауыстырылды.',
      home: 'Басты бетке',
      catalog: 'Каталогқа',
      search: 'Іздеу',
      back: 'Артқа',
    },
    ru: {
      title: '404',
      subtitle: 'Страница не найдена',
      text: 'Страница, которую вы ищете, не существует или была перемещена.',
      home: 'На главную',
      catalog: 'В каталог',
      search: 'В поиск',
      back: 'Назад',
    },
    en: {
      title: '404',
      subtitle: 'Page Not Found',
      text: 'The page you are looking for does not exist or has been moved.',
      home: 'Go Home',
      catalog: 'Go to Catalogue',
      search: 'Go to Search',
      back: 'Go Back',
    },
  }
  const copy = t[locale as keyof typeof t] || t.ru

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] relative flex items-center justify-center px-4 overflow-hidden">
      {/* CINEMATIC BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        {/* film grain overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 200 200%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22n%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />
      </div>

      {/* CONTENT */}
      <div className="relative text-center max-w-lg mx-auto">
        {/* 404 */}
        <div className="relative mb-6">
          <span className="text-[10rem] md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400/80 to-amber-600/20 leading-none select-none">
            {copy.title}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-amber-500/20 blur-xl bg-amber-500/5" />
          </div>
        </div>

        {/* TEXT */}
        <h1 className="text-3xl md:text-4xl font-bold text-[rgb(var(--foreground))] mb-4">{copy.subtitle}</h1>
        <p className="text-[rgb(var(--muted))] text-lg mb-10 leading-relaxed">{copy.text}</p>

        {/* LINKS */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Link
            href={`/${locale}`}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors"
          >
            {copy.home}
          </Link>
          <Link
            href={`/${locale}/films`}
            className="px-6 py-3 rounded-xl bg-[rgb(var(--card))] hover:bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] font-semibold transition-colors border border-[rgb(var(--border))]/30"
          >
            {copy.catalog}
          </Link>
          <Link
            href={`/${locale}/search`}
            className="px-6 py-3 rounded-xl bg-[rgb(var(--card))] hover:bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] font-semibold transition-colors border border-[rgb(var(--border))]/30"
          >
            {copy.search}
          </Link>
        </div>

        <button
          onClick={() => router.back()}
          className="text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] text-sm transition-colors underline"
        >
          ← {copy.back}
        </button>

        {/* DECORATIVE FILM STRIP */}
        <div className="mt-16 flex justify-center gap-2 opacity-20">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-8 h-12 rounded border border-[rgb(var(--border))]/60 bg-[rgb(var(--card))] flex flex-col justify-between py-1 px-0.5">
              <div className="w-full h-1.5 rounded-sm bg-[rgb(var(--border))]/60" />
              <div className="w-full h-5 rounded-sm bg-[rgb(var(--border))]/40" />
              <div className="w-full h-1.5 rounded-sm bg-[rgb(var(--border))]/60" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
