import type { Collection } from '@/types'

export const collections: Collection[] = [
  {
    id: '1',
    slug: 'golden-age',
    title: {
      kk: 'Алтын ғасыр',
      ru: 'Золотой век',
      en: 'Golden Age',
    },
    description: {
      kk: '1960–1970 жылдардағы қазақ кинематографиясының гүлдену кезеңі. Шәкен Айманов бастаған режиссерлер ұлттық кино өнерінің іргетасын қалады. Бұл фильмдер бүгінде де өзектілігін жоймаған мәңгілік классикалар.',
      ru: 'Период расцвета казахского кинематографа 1960–1970-х годов. Режиссёры во главе с Шакеном Аймановым заложили фундамент национального киноискусства. Эти фильмы и сегодня остаются вечной классикой.',
      en: 'The flourishing period of Kazakh cinema in the 1960s–1970s. Directors led by Shaken Aimanov laid the foundation of national film art. These films remain eternal classics to this day.',
    },
    curatorNotes: {
      kk: 'Бұл коллекция қазақ кинематографиясының алғашқы шырқау шыңдарын ұсынады. Фильмдер ұлттық сәйкестілік іздеу мен совет жүйесі шеңберіндегі шығармашылық еркіндіктің бірегей синтезін білдіреді.',
      ru: 'Эта коллекция представляет первые вершины казахского кинематографа. Фильмы воплощают уникальный синтез поиска национальной идентичности и творческой свободы в рамках советской системы.',
      en: 'This collection presents the first peaks of Kazakh cinema. The films embody a unique synthesis of searching for national identity and creative freedom within the Soviet system.',
    },
    cover: 'https://picsum.photos/seed/golden-age-col/800/400',
    films: ['angel-v-tyubeteike', 'kyz-zhibek', 'konets-atamana', 'transsibirskiy-ekspress'],
    era: '1960s–1970s',
  },
  {
    id: '2',
    slug: 'new-wave',
    title: {
      kk: 'Жаңа толқын',
      ru: 'Новая волна',
      en: 'New Wave',
    },
    description: {
      kk: '1980–1990 жылдардағы қазақ кинематографиясының революциялық кезеңі. «Қазақ жаңа толқыны» деп аталатын бұл бағыт дүниежүзілік кино тарихына жаңа бет ашты. Рашид Нұғманов, Дарежан Өмірбаев сияқты режиссерлер жаңа тіл тапты.',
      ru: 'Революционный период казахского кинематографа 1980–1990-х годов. Направление, названное «Казахской новой волной», открыло новую страницу в истории мирового кино. Такие режиссёры, как Рашид Нугманов и Дарежан Омирбаев, нашли новый язык.',
      en: 'The revolutionary period of Kazakh cinema in the 1980s–1990s. The movement known as the "Kazakh New Wave" opened a new chapter in world cinema history. Directors such as Rashid Nugmanov and Darezhan Omirbayev found a new language.',
    },
    curatorNotes: {
      kk: 'Бұл фильмдер совет жүйесінің ыдырауы кезіндегі рухани, мәдени және экзистенциалдық іздеулерді бейнелейді. Минималистік стиль, ірі жоспарлар және ішкі монолог — бұл толқынның негізгі белгілері.',
      ru: 'Эти фильмы отображают духовные, культурные и экзистенциальные поиски эпохи распада советской системы. Минималистичный стиль, крупные планы и внутренний монолог — ключевые черты этой волны.',
      en: 'These films reflect the spiritual, cultural, and existential searches of the era of Soviet system collapse. Minimalist style, close-ups, and interior monologue are the key features of this wave.',
    },
    cover: 'https://picsum.photos/seed/new-wave-col/800/400',
    films: ['igla', 'plach-materi', 'aksuat', 'tot-kto-nezhnee', 'mesto-na-seroy-zemle'],
    era: '1980s–1990s',
  },
  {
    id: '3',
    slug: 'epics',
    title: {
      kk: 'Қазақ эпосы',
      ru: 'Казахский эпос',
      en: 'Kazakh Epics',
    },
    description: {
      kk: 'Ұлы тарихи оқиғалар мен халық эпосы негізіндегі фильмдер жинағы. Осы туындылар арқылы қазақ халқының ерлік тарихы мен рухы кино тілінде жарқырай тіршілік табады.',
      ru: 'Коллекция фильмов по мотивам великих исторических событий и народного эпоса. Через эти произведения героическая история и дух казахского народа обретают жизнь на языке кино.',
      en: 'A collection of films based on great historical events and folk epics. Through these works, the heroic history and spirit of the Kazakh people come alive in the language of cinema.',
    },
    curatorNotes: {
      kk: 'Эпикалық кино — қазақ кинематографиясының ерекше күші. Бұл фильмдер миллиондаған адамдарды қамтыған тарихи оқиғаларды суреттей отырып, жеке адам мен халық тағдырының бірлігін зерттейді.',
      ru: 'Эпическое кино — особая сила казахского кинематографа. Эти фильмы, изображая исторические события, охватившие миллионы людей, исследуют единство судьбы личности и народа.',
      en: 'Epic cinema is a special strength of Kazakh cinematography. These films, depicting historical events involving millions of people, explore the unity of individual and national destiny.',
    },
    cover: 'https://picsum.photos/seed/epics-col/800/400',
    films: ['gibel-otrara', 'kochevnik', 'mongol', 'kyz-zhibek', 'plach-materi'],
    era: '1970s–2010s',
  },
  {
    id: '4',
    slug: 'modern',
    title: {
      kk: 'Заманауи кино',
      ru: 'Современное кино',
      en: 'Modern Cinema',
    },
    description: {
      kk: '2000–2014 жылдардағы қазақ кинематографиясы. Тәуелсіздік алған соң жаңа буын режиссерлері халықаралық арнада жарқырады. Берлин, Канн, Оскар — қазақ кинематографиясы дүние жүзіне танылды.',
      ru: 'Казахский кинематограф 2000–2014 годов. После обретения независимости новое поколение режиссёров засияло на международной арене. Берлин, Канны, «Оскар» — казахское кино получило мировое признание.',
      en: 'Kazakh cinema of 2000–2014. After gaining independence, a new generation of directors shone on the international stage. Berlin, Cannes, Oscar — Kazakh cinema received worldwide recognition.',
    },
    curatorNotes: {
      kk: 'Заманауи қазақ кинематографиясы екі полюс арасында: халықаралық арт-хаус пен ұлттық коммерциялық кино. Екеуі де тиісті жетістіктерге жетті. Бұл коллекция осы екі бағытты ұсынады.',
      ru: 'Современный казахский кинематограф — между двумя полюсами: международным арт-хаусом и национальным коммерческим кино. Оба добились значительных успехов. Эта коллекция представляет оба направления.',
      en: 'Modern Kazakh cinema stands between two poles: international art-house and national commercial cinema. Both have achieved considerable success. This collection presents both directions.',
    },
    cover: 'https://picsum.photos/seed/modern-col/800/400',
    films: ['tyulpan', 'student', 'uroki-garmonii', 'khozyaeva', 'reketir', 'podarok-stalinu', 'bezhat-ot', 'kochevnik', 'mongol'],
    era: '2000s–2010s',
  },
  {
    id: '5',
    slug: 'documentary-fund',
    title: {
      kk: 'Деректі қор',
      ru: 'Документальный фонд',
      en: 'Documentary Fund',
    },
    description: {
      kk: 'Деректі және жартылай деректі фильмдер жинағы. Бұл туындылар Қазақстанның нақты өмірін, адамдарын және табиғатын ең шынайы түрде бейнелейді. Мультфильмдер де осы қорда сақтаулы.',
      ru: 'Коллекция документальных и полудокументальных фильмов. Эти произведения наиболее достоверно изображают реальную жизнь, людей и природу Казахстана. В фонде также хранятся мультфильмы.',
      en: 'A collection of documentary and semi-documentary films. These works most authentically depict the real life, people and nature of Kazakhstan. Animated films are also kept in this fund.',
    },
    curatorNotes: {
      kk: 'Деректі кино — шындықтың айнасы. Бұл коллекциядағы фильмдер тарихи деректер мен адам тағдырларын сақтайды. Болашақ ұрпаққа арналған бағалы мұра.',
      ru: 'Документальное кино — зеркало реальности. Фильмы в этой коллекции сохраняют исторические свидетельства и человеческие судьбы. Ценное наследие для будущих поколений.',
      en: 'Documentary cinema is a mirror of reality. The films in this collection preserve historical testimonies and human destinies. A valuable legacy for future generations.',
    },
    cover: 'https://picsum.photos/seed/documentary-fund-col/800/400',
    films: ['tyulpan', 'skazka-o-rozovom-zayatse', 'transsibirskiy-ekspress'],
    era: '1970s–2010s',
  },
]
