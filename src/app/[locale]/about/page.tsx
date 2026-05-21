import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { db } from '@/lib/db'

interface Props {
  params: Promise<{ locale: string }>
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const team = [
  {
    name: 'Алуа Шодырова',
    photo: '',
    role: { kk: 'ДИЗАЙН · КОНЦЕПЦИЯ · ИНТЕРФЕЙС', ru: 'ДИЗАЙН · КОНЦЕПЦИЯ · ИНТЕРФЕЙС', en: 'DESIGN · CONCEPT · INTERFACE' },
    quote: {
      ru: 'Я верю, что архив — это форма уважения. Каждый экран, каждый переход должны говорить: эта история важна.',
      kk: 'Мұрағат — бұл құрмет формасы деп сенемін. Әр экран, әр өтпелі сәт: бұл тарих маңызды деп айтуы керек.',
      en: 'I believe an archive is a form of respect. Every screen, every transition must say: this story matters.',
    },
    skills: { ru: ['UX/UI', 'Визуальный язык', 'Разработка'], kk: ['UX/UI', 'Визуалды тіл', 'Әзірлеу'], en: ['UX/UI', 'Visual Language', 'Development'] },
  },
  {
    name: 'Балтабай Диана',
    photo: '',
    role: { kk: 'ЗЕРТТЕУ · МҰРАҒАТ ЛОГИКАСЫ · ҚҰРЫЛЫМ', ru: 'ИССЛЕДОВАНИЕ · АРХИВНАЯ ЛОГИКА · СТРУКТУРА', en: 'RESEARCH · ARCHIVE LOGIC · STRUCTURE' },
    quote: {
      ru: 'Хороший архив — это не база данных. Это навигация. Ты приходишь с вопросом и уходишь с открытием.',
      kk: 'Жақсы мұрағат — бұл дерекқор емес. Бұл навигация. Сен сұрақпен келіп, ашылыммен кетесің.',
      en: 'A good archive is not a database. It is navigation. You arrive with a question and leave with a discovery.',
    },
    skills: { ru: ['Анализ архивов', 'Архивная логика', 'Структура данных'], kk: ['Мұрағат талдауы', 'Мұрағат логикасы', 'Деректер құрылымы'], en: ['Archive Analysis', 'Archive Logic', 'Data Structure'] },
  },
  {
    name: 'Байзак Алуа',
    photo: '',
    role: { kk: 'МАЗМҰН · СҰХБАТТАР · ТАЛДАУ', ru: 'КОНТЕНТ · ИНТЕРВЬЮ · АНАЛИТИКА', en: 'CONTENT · INTERVIEWS · ANALYTICS' },
    quote: {
      ru: 'Кино — это документ. Если не сохранить его сейчас, следующее поколение будет искать то, чего уже нет.',
      kk: 'Кино — бұл құжат. Оны қазір сақтамасаң, келесі ұрпақ жоқ нәрсені іздейді.',
      en: 'Cinema is a document. If we do not preserve it now, the next generation will search for what no longer exists.',
    },
    skills: { ru: ['Интервью', 'Контент-анализ', 'Киноведение'], kk: ['Сұхбат', 'Мазмұн талдауы', 'Кинотану'], en: ['Interviews', 'Content Analysis', 'Film Studies'] },
  },
]

const history = [
  {
    date: { kk: 'Күз 2025', ru: 'Осень 2025', en: 'Autumn 2025' },
    title: { kk: 'Бірінші сұрақ', ru: 'Первый вопрос', en: 'The First Question' },
    desc: {
      ru: 'На занятии по медиатехнологиям возник вопрос: где найти полную информацию о казахстанских фильмах? Существующие архивы оказались разрозненными, закрытыми или неудобными для пользователя.',
      kk: 'Медиатехнологиялар сабағында сұрақ туды: қазақстандық фильмдер туралы толық ақпаратты қайдан табуға болады? Бар мұрағаттар шашыраңқы, жабық немесе пайдаланушыға ыңғайсыз болып шықты.',
      en: 'A media technology class sparked the foundational question: where to find complete information about Kazakhstani films? Existing archives were fragmented, restricted, or user-unfriendly.',
    },
  },
  {
    date: { kk: '2026', ru: '2026', en: '2026' },
    title: { kk: 'Зерттеу және сұхбаттар', ru: 'Исследование и интервью', en: 'Research and Interviews' },
    desc: {
      ru: 'Команда провела интервью с архивистами, киноведами, IT-разработчиками и UX-дизайнерами. Изучены ведущие международные архивы: KOFA, EFG, NFAJ, Arkaader.',
      kk: 'Команда мұрағатшылармен, кинотанушылармен, IT-әзірлеушілермен және UX-дизайнерлермен сұхбаттар өткізді. Жетекші халықаралық мұрағаттар зерттелді: KOFA, EFG, NFAJ, Arkaader.',
      en: 'The team conducted interviews with archivists, film scholars, IT developers, and UX designers. Leading international archives were studied: KOFA, EFG, NFAJ, Arkaader.',
    },
  },
  {
    date: { kk: '2026', ru: '2026', en: '2026' },
    title: { kk: 'Концепция және сәулет', ru: 'Концепция и архитектура', en: 'Concept and Architecture' },
    desc: {
      ru: 'Разработка архивной логики, структуры метаданных и принципов навигации. Созданы первые прототипы интерфейса и проведено тестирование с пользователями.',
      kk: 'Мұрағат логикасын, метадеректер құрылымын және навигация принциптерін әзірлеу. Интерфейстің алғашқы прототиптері жасалып, пайдаланушылармен тестілеу жүргізілді.',
      en: 'Development of archival logic, metadata structure, and navigation principles. Initial interface prototypes created and tested with users.',
    },
  },
  {
    date: { kk: '2026', ru: '2026', en: '2026' },
    title: { kk: 'TAMGA — жария концепт', ru: 'TAMGA — публичный концепт', en: 'TAMGA — Public Concept' },
    desc: {
      ru: 'Финальная платформа как дипломный проект — публичный архив, функционирующий как живая система и инфраструктура национальной памяти.',
      kk: 'Дипломдық жоба ретінде финалдық платформа — тірі жүйе және ұлттық жад инфрақұрылымы ретінде жұмыс істейтін жария мұрағат.',
      en: 'Final platform as a diploma project — a public archive functioning as a living system and national memory infrastructure.',
    },
  },
]

const experts = [
  {
    category: { kk: 'МҰРАҒАТ / КИНОТАНУ', ru: 'АРХИВ / КИНОВЕДЕНИЕ', en: 'ARCHIVE / FILM STUDIES' },
    name: 'Евгений Лумпов',
    position: { kk: 'Должность, Ұйым', ru: 'Должность, Организация', en: 'Position, Organisation' },
    quote: {
      ru: 'Всё, что в открытом доступе — это уже каталог. Архив — это то, что доступно только через закрытую систему. Буквально заархивировано.',
      kk: 'Ашық қолжетімдіде бар нәрсенің бәрі каталог. Мұрағат — тек жабық жүйе арқылы қолжетімді нәрсе. Сөзбе-сөз мұрағатталған.',
      en: 'Everything in open access is already a catalogue. An archive is what is accessible only through a closed system. Literally archived.',
    },
  },
  {
    category: { kk: 'КИНОПРОДУКЦИЯ', ru: 'КИНОПРОИЗВОДСТВО', en: 'FILM PRODUCTION' },
    name: { kk: 'Эксперт есімі', ru: 'Имя эксперта', en: 'Expert Name' },
    position: { kk: 'Должность, Ұйым', ru: 'Должность, Организация', en: 'Position, Organisation' },
    quote: {
      ru: 'Ещё одна значимая цитата — про доступность, сохранение или важность цифрового архива для культуры.',
      kk: 'Тағы бір маңызды цитата — мәдениет үшін цифрлық мұрағаттың қолжетімділігі, сақтауы немесе маңыздылығы туралы.',
      en: 'Another significant quote — about accessibility, preservation, or the importance of a digital archive for culture.',
    },
  },
  {
    category: { kk: 'КИНОБІЛІМ', ru: 'КИНООБРАЗОВАНИЕ', en: 'FILM EDUCATION' },
    name: { kk: 'Эксперт есімі', ru: 'Имя эксперта', en: 'Expert Name' },
    position: { kk: 'Должность, Ұйым', ru: 'Должность, Организация', en: 'Position, Organisation' },
    quote: {
      ru: 'Цитата о том, как студенты и исследователи сталкиваются с проблемой поиска информации о казахском кино.',
      kk: 'Студенттер мен зерттеушілердің қазақ кино туралы ақпарат іздеу мәселесіне тап болатындығы туралы цитата.',
      en: 'A quote about how students and researchers face the challenge of finding information about Kazakh cinema.',
    },
  },
  {
    category: { kk: 'ХАЛЫҚАРАЛЫҚ ТӘЖІРИБЕ', ru: 'МЕЖДУНАРОДНЫЙ ОПЫТ', en: 'INTERNATIONAL EXPERIENCE' },
    name: { kk: 'Эксперт есімі', ru: 'Имя эксперта', en: 'Expert Name' },
    position: { kk: 'Должность, Ұйым', ru: 'Должность, Организация', en: 'Position, Organisation' },
    quote: {
      ru: 'Цитата о международном контексте — как другие страны решали задачу оцифровки и сохранения кинонаследия.',
      kk: 'Халықаралық контекст туралы цитата — басқа елдер кинемұраны цифрландыру мен сақтау міндетін қалай шешті.',
      en: 'A quote on the international context — how other countries addressed the challenge of digitising and preserving cinema heritage.',
    },
  },
]

const principles = [
  {
    num: '01',
    title: { kk: 'Контекст каталогтан маңыздырақ', ru: 'Контекст важнее каталога', en: 'Context over catalogue' },
    desc: {
      ru: 'Фильм — это не только название и год. Это автор, культурное событие. Архив должен передавать смысл, а не только факты.',
      kk: 'Фильм — бұл тек атау мен жыл ғана емес. Бұл автор, мәдени оқиға. Мұрағат мағынаны беруі керек, тек фактілерді ғана емес.',
      en: 'A film is not just a title and year. It is an author, a cultural event. An archive must convey meaning, not just facts.',
    },
  },
  {
    num: '02',
    title: { kk: 'Ашықтық — бастапқы жай-күй', ru: 'Открытость по умолчанию', en: 'Open by default' },
    desc: {
      ru: 'Знание о казахском кино не должно быть привилегией специалистов. Архив строится так, чтобы быть понятным любому.',
      kk: 'Қазақ кино туралы білім мамандардың артықшылығы болмауы керек. Мұрағат кез келгенге түсінікті болуы үшін салынады.',
      en: 'Knowledge about Kazakh cinema should not be the privilege of specialists. The archive is built to be understandable to anyone.',
    },
  },
  {
    num: '03',
    title: { kk: 'Ұлттық — бұл жаһандық', ru: 'Национальное — это глобальное', en: 'National is global' },
    desc: {
      ru: 'Казахское кино — часть мирового культурного наследия. Его архив должен соответствовать международным стандартам каталогизации.',
      kk: 'Қазақ киносы — әлемдік мәдени мұраның бөлігі. Оның мұрағаты халықаралық каталогтау стандарттарына сәйкес болуы керек.',
      en: 'Kazakh cinema is part of world cultural heritage. Its archive must meet international cataloguing standards.',
    },
  },
  {
    num: '04',
    title: { kk: 'Дизайн — бұл құрмет', ru: 'Дизайн как уважение', en: 'Design as respect' },
    desc: {
      ru: 'Интерфейс не обёртка. Это способ сказать, что эта история важна. Каждое визуальное решение несёт смысл.',
      kk: 'Интерфейс — орауыш емес. Бұл осы тарих маңызды деп айтудың тәсілі. Әр визуалды шешімде мағына бар.',
      en: 'The interface is not a wrapper. It is a way of saying that this story matters. Every visual decision carries meaning.',
    },
  },
]

const pageCopy = {
  kk: {
    heroTitle1: 'Бір ел.',
    heroTitle2: 'Мың тарих.',
    heroSub: 'TAMGA — қазақстандық киноның ашық мұрағаты. Құрылымды, тірі, баршаға қолжетімді.',
    heroBtn: 'Командамен танысу',
    missionLabel: 'МИССИЯ',
    missionQuote: '«Қазақстанда түсірілді. Кездейсоқ ұмытылды. Арнайы сақталды.»',
    missionAttr: '— TAMGA командасы, 2026',
    teamLabel: 'КОМАНДА',
    teamTitle: 'Жоба авторлары',
    teamSub: 'Бір идеямен біріккен үш адам.',
    historyLabel: 'ҚҰРУ ТАРИХЫ',
    historyTitle: 'Жоба қалай пайда болды',
    expertsLabel: 'НЕГІЗГЕ АЛЫНҒАН ДАУЫСТАР',
    expertsTitle: 'Сараптамалық сұхбаттар',
    expertsSub: 'TAMGA негізінде тек біздің идеялар ғана емес, мұрағатшылардың, кинотанушылардың, әзірлеушілер мен дизайнерлердің дауыстары жатыр.',
    principlesTitle: 'TAMGA нені басшылыққа алады',
  },
  ru: {
    heroTitle1: 'Одна страна.',
    heroTitle2: 'Тысячи историй.',
    heroSub: 'TAMGA — открытый архив казахстанского кино. Структурированный, живой, доступный каждому.',
    heroBtn: 'Познакомиться с командой',
    missionLabel: 'МИССИЯ',
    missionQuote: '«Снято в Казахстане. Забыто случайно. Сохранено намеренно.»',
    missionAttr: '— КОМАНДА TAMGA, 2026',
    teamLabel: 'КОМАНДА',
    teamTitle: 'Авторы проекта',
    teamSub: 'Три человека, объединённые одной идеей.',
    historyLabel: 'ИСТОРИЯ СОЗДАНИЯ',
    historyTitle: 'Как появился проект',
    expertsLabel: 'ГОЛОСА, КОТОРЫЕ ЛЕГЛИ В ОСНОВУ',
    expertsTitle: 'Экспертные интервью',
    expertsSub: 'В основе TAMGA — не только наши идеи, но и голоса архивистов, киноведов, разработчиков и дизайнеров, которые помогли нам понять, каким должен быть настоящий архив.',
    principlesTitle: 'Чем руководствуется TAMGA',
  },
  en: {
    heroTitle1: 'One country.',
    heroTitle2: 'Thousands of stories.',
    heroSub: 'TAMGA — an open archive of Kazakhstani cinema. Structured, living, accessible to everyone.',
    heroBtn: 'Meet the team',
    missionLabel: 'MISSION',
    missionQuote: '«Shot in Kazakhstan. Forgotten by chance. Preserved intentionally.»',
    missionAttr: '— TEAM TAMGA, 2026',
    teamLabel: 'TEAM',
    teamTitle: 'Project Authors',
    teamSub: 'Three people united by one idea.',
    historyLabel: 'CREATION HISTORY',
    historyTitle: 'How the project came to be',
    expertsLabel: 'VOICES THAT SHAPED THE PROJECT',
    expertsTitle: 'Expert Interviews',
    expertsSub: 'TAMGA is built not just on our ideas, but on the voices of archivists, film scholars, developers and designers who helped us understand what a real archive should be.',
    principlesTitle: 'What guides TAMGA',
  },
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function loc<T extends Record<string, unknown>>(obj: T, l: string): string {
  return String(obj[l] ?? obj['ru'] ?? '')
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const l = (locale as 'kk' | 'ru' | 'en') || 'ru'
  const t = pageCopy[l] || pageCopy.ru

  const dbTeam = await db.teamMember.findMany({ orderBy: { order: 'asc' } }).catch(() => [])

  const stats = [
    { num: '3', label: l === 'kk' ? 'Жоба авторы' : l === 'en' ? 'Project authors' : 'Автора проекта' },
    { num: '0+', label: l === 'kk' ? 'Концептідегі фильмдер' : l === 'en' ? 'Films in archive concept' : 'Фильмов в концепте архива' },
    { num: '1938–2026', label: l === 'kk' ? 'Қамтылатын кезең' : l === 'en' ? 'Period covered' : 'Охватываемый период' },
    { num: '5', label: l === 'kk' ? 'Сараптамалық сұхбат' : l === 'en' ? 'Expert interviews' : 'Экспертных интервью' },
    { num: '1', label: l === 'kk' ? 'Миссия' : l === 'en' ? 'Mission' : 'Миссия' },
  ]

  const corePrinciples = [
    {
      num: 'I',
      title: { kk: 'Мағынасыз сақтамау', ru: 'Сохранение без потери смысла', en: 'Preservation without loss of meaning' },
      desc: {
        kk: 'Тек атаулар мен жылдарды ғана емес, контекстті — авторларды, мәдени маңыздылықты және өндіріс тарихын сақтаймыз.',
        ru: 'Мы храним не только названия фильмов, но и контекст — авторов, культурную значимость и производственную историю.',
        en: 'We preserve not just film titles, but context — authors, cultural significance, and production history.',
      },
    },
    {
      num: 'II',
      title: { kk: 'Жеңілдетпей қолжетімді ету', ru: 'Доступность без упрощения', en: 'Accessibility without simplification' },
      desc: {
        kk: 'Мұрағат студентке де, зерттеушіге де бір мезгілде түсінікті болуы керек — тереңдігін жоғалтпастан.',
        ru: 'Архив должен быть понятен студенту, исследователю и широкой аудитории одновременно — не теряя глубины.',
        en: 'The archive must be accessible to students, researchers, and the public simultaneously — without losing depth.',
      },
    },
    {
      num: 'III',
      title: { kk: 'Жад тірі жүйе ретінде', ru: 'Память как живая система', en: 'Memory as a living system' },
      desc: {
        kk: 'Мұрағат — қойма емес. Бұл өсуі, жаңаруы және сұрақтарға жауап беруі тиіс мәдени жадының интерфейсі.',
        ru: 'Архив — не склад. Это интерфейс культурной памяти, который должен расти, обновляться и отвечать на вопросы.',
        en: 'An archive is not a warehouse. It is an interface for cultural memory that must grow, update, and respond to questions.',
      },
    },
  ]

  return (
    <main className="min-h-screen bg-[rgb(var(--background))]">

      {/* ─── HERO ─── */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

            {/* Left */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgb(var(--border))]/20 bg-[rgb(var(--card))] text-[rgb(var(--muted))] text-xs mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--accent))]" />
                {l === 'kk' ? 'Жоба туралы · Команда · Миссия' : l === 'en' ? 'About · Team · Mission' : 'О проекте · Команда · Миссия'}
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.05] mb-6">
                <span className="text-[rgb(var(--foreground))]">{t.heroTitle1}</span>
                <br />
                <span className="text-[rgb(var(--accent))]">{t.heroTitle2}</span>
              </h1>
              <p className="text-[rgb(var(--muted))] text-lg max-w-md mb-8 leading-relaxed">{t.heroSub}</p>
              <a
                href="#team"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 text-[rgb(var(--foreground))] text-sm font-medium hover:border-[rgb(var(--accent))]/40 transition-colors"
              >
                {t.heroBtn}
                <span className="text-[rgb(var(--accent))]">↓</span>
              </a>
            </div>

            {/* Right: Stats grid */}
            <div className="w-full lg:w-auto grid grid-cols-2 gap-4 lg:min-w-[380px]">
              {stats.slice(0, 4).map(({ num, label }) => (
                <div key={label} className="p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 hover:border-[rgb(var(--accent))]/25 transition-colors">
                  <p className="text-3xl sm:text-4xl font-display font-bold text-[rgb(var(--accent))] mb-1 leading-none">{num}</p>
                  <p className="text-[rgb(var(--muted))] text-sm leading-snug">{label}</p>
                </div>
              ))}
              <div className="col-span-2 p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 hover:border-[rgb(var(--accent))]/25 transition-colors flex gap-4 items-center">
                <p className="text-3xl font-display font-bold text-[rgb(var(--accent))]">{stats[4].num}</p>
                <p className="text-[rgb(var(--muted))] text-sm">{stats[4].label}</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── MISSION + CORE PRINCIPLES ─── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left: big quote */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-6">{t.missionLabel}</p>
              <blockquote className="font-display text-3xl md:text-4xl font-bold text-[rgb(var(--foreground))] leading-snug italic mb-6">
                {t.missionQuote}
              </blockquote>
              <p className="text-[rgb(var(--muted))] text-sm">{t.missionAttr}</p>
            </div>

            {/* Right: 3 principle cards */}
            <div className="space-y-4">
              {corePrinciples.map((p) => (
                <div key={p.num} className="p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15">
                  <div className="flex items-start gap-4">
                    <span className="font-display text-2xl font-bold text-[rgb(var(--accent))]/40 flex-shrink-0 leading-none mt-0.5">{p.num}</span>
                    <div>
                      <p className="font-semibold text-[rgb(var(--foreground))] text-sm mb-1">{loc(p.title, l)}</p>
                      <p className="text-[rgb(var(--muted))] text-sm leading-relaxed">{loc(p.desc, l)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── TEAM ─── */}
      <section id="team" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-3">{t.teamLabel}</p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[rgb(var(--foreground))] mb-3">{t.teamTitle}</h2>
          <p className="text-[rgb(var(--muted))] text-lg mb-8">{t.teamSub}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {dbTeam.length > 0
              ? dbTeam.map((member) => {
                  const name = l === 'kk' ? member.nameKk || member.nameRu : l === 'en' ? member.nameEn || member.nameRu : member.nameRu
                  const role = l === 'kk' ? member.roleKk || member.roleRu : l === 'en' ? member.roleEn || member.roleRu : member.roleRu
                  const skills = (() => { try { return JSON.parse(member.skills) as string[] } catch { return [] } })()
                  return (
                    <div key={member.id} className="p-6 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 hover:border-[rgb(var(--accent))]/25 transition-colors flex flex-col">
                      <div className="mb-5 flex justify-center">
                        {member.photo ? (
                          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))]/30">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={member.photo} alt={name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-28 h-28 rounded-full bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 flex items-center justify-center">
                            <span className="text-3xl font-display font-bold text-[rgb(var(--accent))]/60">{name[0]}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-2 text-center">{role}</p>
                      <h3 className="text-xl font-display font-bold text-[rgb(var(--foreground))] mb-4 text-center">{name}</h3>
                      {member.quoteRu && (
                        <blockquote className="border-l-2 border-[rgb(var(--accent))]/40 pl-4 mb-4 flex-1">
                          <p className="text-[rgb(var(--muted))] text-sm italic leading-relaxed">&ldquo;{member.quoteRu}&rdquo;</p>
                        </blockquote>
                      )}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {skills.map((skill) => (
                            <span key={skill} className="text-xs px-3 py-1 rounded-full border border-[rgb(var(--border))]/25 text-[rgb(var(--muted))]">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              : team.map((m) => (
                  <div key={m.name} className="p-6 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 hover:border-[rgb(var(--accent))]/25 transition-colors flex flex-col">
                    <div className="mb-5 flex justify-center">
                      {m.photo ? (
                        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))]/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 flex items-center justify-center">
                          <span className="text-3xl font-display font-bold text-[rgb(var(--accent))]/60">{m.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-2 text-center">{m.role[l]}</p>
                    <h3 className="text-xl font-display font-bold text-[rgb(var(--foreground))] mb-4 text-center">{m.name}</h3>
                    <blockquote className="border-l-2 border-[rgb(var(--accent))]/40 pl-4 mb-4 flex-1">
                      <p className="text-[rgb(var(--muted))] text-sm italic leading-relaxed">&ldquo;{m.quote[l]}&rdquo;</p>
                    </blockquote>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {m.skills[l].map((skill) => (
                        <span key={skill} className="text-xs px-3 py-1 rounded-full border border-[rgb(var(--border))]/25 text-[rgb(var(--muted))]">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))
            }
          </div>
        </AnimatedSection>
      </section>

      {/* ─── HISTORY OF CREATION ─── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-3">{t.historyLabel}</p>
          <h2 className="text-4xl font-display font-bold text-[rgb(var(--foreground))] mb-8">{t.historyTitle}</h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-3 bottom-3 w-px bg-[rgb(var(--accent))]/20 hidden md:block" />

            <div className="space-y-8">
              {history.map((phase, i) => (
                <div key={i} className="relative flex gap-8 md:gap-12 items-start group">
                  {/* Dot on line */}
                  <div className="hidden md:flex flex-col items-center shrink-0 w-12">
                    <div className="w-3 h-3 rounded-full bg-[rgb(var(--accent))]/60 border-2 border-[rgb(var(--background))] ring-2 ring-[rgb(var(--accent))]/20 mt-1" />
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 group-hover:border-[rgb(var(--accent))]/25 transition-colors">
                    <p className="text-[rgb(var(--accent))] font-display font-bold text-lg mb-1">{loc(phase.date, l)}</p>
                    <h3 className="font-bold text-[rgb(var(--foreground))] mb-2">{loc(phase.title, l)}</h3>
                    <p className="text-[rgb(var(--muted))] text-sm leading-relaxed">{loc(phase.desc, l)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ─── EXPERT INTERVIEWS ─── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-3">{t.expertsLabel}</p>
          <h2 className="text-4xl font-display font-bold text-[rgb(var(--foreground))] mb-4">{t.expertsTitle}</h2>
          <p className="text-[rgb(var(--muted))] text-lg max-w-2xl mb-8 leading-relaxed">{t.expertsSub}</p>

          <div className="grid md:grid-cols-2 gap-5">
            {experts.map((expert, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 hover:border-[rgb(var(--accent))]/25 transition-colors">
                <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-3">{loc(expert.category, l)}</p>
                <h3 className="font-display text-xl font-bold text-[rgb(var(--foreground))] mb-1">
                  {typeof expert.name === 'string' ? expert.name : loc(expert.name as Record<string, string>, l)}
                </h3>
                <p className="text-[rgb(var(--muted))] text-sm mb-4">{loc(expert.position, l)}</p>
                <blockquote className="border-l-2 border-[rgb(var(--accent))]/40 pl-4">
                  <p className="text-[rgb(var(--muted))] text-sm italic leading-relaxed">&ldquo;{loc(expert.quote, l)}&rdquo;</p>
                </blockquote>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ─── PRINCIPLES ─── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[rgb(var(--foreground))] mb-10">{t.principlesTitle}</h2>
          <div className="space-y-10">
            {principles.map((p) => (
              <div key={p.num} className="flex gap-8 md:gap-16 items-start border-b border-[rgb(var(--border))]/15 pb-10 last:border-0 last:pb-0">
                <span className="text-6xl md:text-7xl font-display font-bold text-[rgb(var(--accent))]/15 leading-none flex-shrink-0 select-none w-20 md:w-28">
                  {p.num}
                </span>
                <div className="pt-1.5 flex-1 md:grid md:grid-cols-2 md:gap-8">
                  <h3 className="text-lg font-bold text-[rgb(var(--foreground))] mb-3 md:mb-0">{loc(p.title, l)}</h3>
                  <p className="text-[rgb(var(--muted))] leading-relaxed text-sm">{loc(p.desc, l)}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

    </main>
  )
}
