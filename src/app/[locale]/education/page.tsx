'use client'

import { useState, useEffect } from 'react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { FilmCard } from '@/components/films/FilmCard'
import { useParams } from 'next/navigation'
import type { Film } from '@/types'

type Tab = 'teachers' | 'students' | 'researchers'

const content = {
  teachers: {
    kk: {
      title: 'Мұғалімдерге',
      description: 'Жоғары оқу орындары мен мектептерде қазақ кино тарихын оқытуға арналған әдістемелік материалдар, оқу бағдарламалары және ұсынылатын фильмдер жинақталған. Студенттердің кино мәдениеті туралы білімін кеңейтуге арналған ресурстар.',
      resources: ['Әдістемелік нұсқаулық', 'Оқу бағдарламасы', 'Дискуссия сұрақтары', 'Бағалау жұмыстары'],
      films: ['igla', 'kyz-zhibek', 'konets-atamana', 'gibel-otrara', 'tyulpan', 'mongol'],
    },
    ru: {
      title: 'Преподавателям',
      description: 'Методические материалы, учебные программы и рекомендованные фильмы для изучения истории казахского кино в вузах и школах. Ресурсы для расширения знаний студентов о кинокультуре.',
      resources: ['Методическое пособие', 'Учебная программа', 'Вопросы для дискуссии', 'Оценочные работы'],
      films: ['igla', 'kyz-zhibek', 'konets-atamana', 'gibel-otrara', 'tyulpan', 'mongol'],
    },
    en: {
      title: 'For Teachers',
      description: 'Methodological materials, curricula and recommended films for studying the history of Kazakh cinema at universities and schools. Resources for expanding students\' knowledge of film culture.',
      resources: ['Methodological Guide', 'Curriculum', 'Discussion Questions', 'Assessment Tasks'],
      films: ['igla', 'kyz-zhibek', 'konets-atamana', 'gibel-otrara', 'tyulpan', 'mongol'],
    },
  },
  students: {
    kk: {
      title: 'Студенттерге',
      description: 'Өзіндік зерттеуге арналған материалдар: эсселер, рецензиялар, мұрағат құжаттары және қосымша әдебиетке сілтемелер. Қазақ киносы тарихын тереңінен зерттегісі келетіндерге.',
      resources: ['Оқу нұсқаулығы', 'Библиография', 'Реферат үлгілері', 'Онлайн ресурстар'],
      films: ['igla', 'student', 'uroki-garmonii', 'tyulpan', 'kochevnik'],
    },
    ru: {
      title: 'Студентам',
      description: 'Материалы для самостоятельного изучения: эссе, рецензии, архивные документы и ссылки на дополнительную литературу. Для тех, кто хочет глубже исследовать историю казахского кино.',
      resources: ['Учебное руководство', 'Библиография', 'Образцы рефератов', 'Онлайн-ресурсы'],
      films: ['igla', 'student', 'uroki-garmonii', 'tyulpan', 'kochevnik'],
    },
    en: {
      title: 'For Students',
      description: 'Materials for independent study: essays, reviews, archival documents and links to additional literature. For those who want to delve deeper into the history of Kazakh cinema.',
      resources: ['Study Guide', 'Bibliography', 'Essay Samples', 'Online Resources'],
      films: ['igla', 'student', 'uroki-garmonii', 'tyulpan', 'kochevnik'],
    },
  },
  researchers: {
    kk: {
      title: 'Зерттеушілерге',
      description: 'Ғылыми мақалалар, мұрағат деректері, библиография және академиялық зерттеулерге арналған бастапқы дереккөздерге қол жеткізу. Кинематография саласындағы ғалымдар мен зерттеушілерге арналған.',
      resources: ['Ғылыми мақалалар', 'Мұрағат деректері', 'Толық библиография', 'API қолжетімділігі'],
      films: ['igla', 'aksuat', 'plach-materi', 'mesto-na-seroy-zemle', 'uroki-garmonii', 'gibel-otrara'],
    },
    ru: {
      title: 'Исследователям',
      description: 'Научные статьи, архивные данные, библиография и доступ к первоисточникам для академических исследований. Для учёных и исследователей в области кинематографии.',
      resources: ['Научные статьи', 'Архивные данные', 'Полная библиография', 'Доступ к API'],
      films: ['igla', 'aksuat', 'plach-materi', 'mesto-na-seroy-zemle', 'uroki-garmonii', 'gibel-otrara'],
    },
    en: {
      title: 'For Researchers',
      description: 'Academic articles, archival data, bibliography and access to primary sources for academic research. For scholars and researchers in the field of cinematography.',
      resources: ['Academic Articles', 'Archival Data', 'Full Bibliography', 'API Access'],
      films: ['igla', 'aksuat', 'plach-materi', 'mesto-na-seroy-zemle', 'uroki-garmonii', 'gibel-otrara'],
    },
  },
}

const pageTitles = {
  kk: { title: 'Білім беру ресурстары', subtitle: 'Қазақ киносын зерттеуге арналған материалдар' },
  ru: { title: 'Образовательные ресурсы', subtitle: 'Материалы для изучения казахского кинематографа' },
  en: { title: 'Educational Resources', subtitle: 'Materials for studying Kazakh cinema' },
}

export default function EducationPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'
  const [activeTab, setActiveTab] = useState<Tab>('teachers')
  const [allFilms, setAllFilms] = useState<Film[]>([])
  const { title, subtitle } = pageTitles[locale as keyof typeof pageTitles] || pageTitles.ru

  useEffect(() => {
    fetch('/api/films').then((r) => r.json()).then(setAllFilms).catch(() => {})
  }, [])

  const tabs: Tab[] = ['teachers', 'students', 'researchers']
  const tabContent = content[activeTab][locale as 'kk' | 'ru' | 'en'] || content[activeTab].ru

  const tabFilms = allFilms.filter((f) => tabContent.films.includes(f.slug))

  const downloadLabel = locale === 'kk' ? 'Жүктеу' : locale === 'en' ? 'Download' : 'Скачать'

  return (
      <main className="min-h-screen bg-[rgb(var(--background))] pt-20">
        {/* HERO */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <AnimatedSection>
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold text-[rgb(var(--foreground))] mb-6">{title}</h1>
                <p className="text-[rgb(var(--muted))] text-xl leading-relaxed">{subtitle}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* TABS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
          <div className="flex flex-wrap gap-3 border-b border-[rgb(var(--border))] pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-t-lg font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? 'bg-amber-500 text-black'
                    : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                }`}
              >
                {content[tab][locale as 'kk' | 'ru' | 'en']?.title || content[tab].ru.title}
              </button>
            ))}
          </div>
        </section>

        {/* TAB CONTENT */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20 space-y-12">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[rgb(var(--muted))] text-lg leading-relaxed mb-8">{tabContent.description}</p>

                {/* RESOURCE BUTTONS */}
                <div className="space-y-3">
                  {tabContent.resources.map((resource) => (
                    <button
                      key={resource}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))] hover:border-amber-500/50 text-left transition-colors group"
                    >
                      <span className="text-[rgb(var(--foreground))] font-medium group-hover:text-amber-500 transition-colors">
                        {resource}
                      </span>
                      <span className="text-amber-500 text-sm font-semibold shrink-0 ml-4">
                        ↓ {downloadLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* STATS */}
              <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 p-8 h-fit">
                <h3 className="text-xl font-bold text-[rgb(var(--foreground))] mb-6">
                  {locale === 'kk' ? 'Ресурстар' : locale === 'en' ? 'Resources' : 'Ресурсы'}
                </h3>
                <div className="space-y-4">
                  {[
                    { num: '500+', label: locale === 'kk' ? 'Мақала' : locale === 'en' ? 'Articles' : 'Статей' },
                    { num: '20', label: locale === 'kk' ? 'Фильм' : locale === 'en' ? 'Films' : 'Фильмов' },
                    { num: '90', label: locale === 'kk' ? 'Тарих жылы' : locale === 'en' ? 'Years of history' : 'Лет истории' },
                    { num: '3', label: locale === 'kk' ? 'Тіл' : locale === 'en' ? 'Languages' : 'Языка' },
                  ].map(({ num, label }) => (
                    <div key={label} className="flex items-center justify-between border-b border-[rgb(var(--border))] pb-3">
                      <span className="text-[rgb(var(--muted))]">{label}</span>
                      <span className="text-amber-500 font-bold text-xl">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* RECOMMENDED FILMS */}
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-8">
              {locale === 'kk' ? 'Ұсынылатын фильмдер' : locale === 'en' ? 'Recommended Films' : 'Рекомендованные фильмы'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {tabFilms.map((film) => (
                <FilmCard key={film.id} film={film} locale={locale as 'kk' | 'ru' | 'en'} />
              ))}
            </div>
          </AnimatedSection>
        </section>
      </main>
  )
}
