'use client'

import { useState } from 'react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { useParams } from 'next/navigation'

const copy = {
  kk: {
    kickBadge: 'Мұрағатпен байланыс',
    title: 'Байланыс',
    subtitle: 'Сұрақтарыңызбен, ұсыныстарыңызбен немесе ынтымақтастық идеяларыңызбен бізге хабарласыңыз.',
    cards: [
      { label: 'Email', value: 'archive@tamga.kz', icon: '✉', hint: 'Жалпы сұрақтар үшін' },
      { label: 'Зерттеу', value: 'research@tamga.kz', icon: '📚', hint: 'Академиялық зерттеу' },
      { label: 'Серіктестік', value: 'partner@tamga.kz', icon: '🤝', hint: 'Ынтымақтастық ұсыныстары' },
      { label: 'Телефон', value: '+7 (727) 000-00-00', icon: '📞', hint: 'Дүйсенбі–Жұма, 9–18' },
    ],
    infoStrip: [
      { icon: '⏱', label: '24 сағат', sub: 'жауап беру уақыты' },
      { icon: '🌍', label: 'ҚЗ', sub: 'Алматы қаласы' },
      { icon: '🗣', label: 'RU · KZ · EN', sub: 'байланыс тілдері' },
    ],
    formTitle: 'Бізге жазыңыз',
    fields: {
      name: 'Аты-жөніңіз', namePh: 'Атыңызды енгізіңіз',
      email: 'Email', emailPh: 'your@email.kz',
      topic: 'Тақырып',
      message: 'Хабарлама', messagePh: 'Хабарламаңызды жазыңыз...',
      send: 'Жіберу',
    },
    topics: [
      'Жалпы сұрақ',
      'Материал ұсыну',
      'Техникалық мәселе',
      'Зерттеу ынтымақтастығы',
      'Баспасөз сұрағы',
      'Серіктестік ұсынысы',
      'Басқа',
    ],
    successTitle: 'Хабарлама жіберілді',
    successText: 'Рақмет! Біз жақын арада жауап береміз.',
    faqTitle: 'Жиі қойылатын сұрақтар',
    faqs: [
      { q: 'Фильмнің түпнұсқа таспасын тапсыруға болады ма?', a: 'Иә, мұрағаттық материалдарды қабылдаймыз. research@tamga.kz мекенжайына хабарласыңыз.' },
      { q: 'Сайттың материалдарын зерттеуде пайдалануға болады ма?', a: 'Академиялық мақсатта пайдалануға болады. Коммерциялық пайдалану үшін рұқсат алу қажет.' },
      { q: 'Сайтта қате тапсам не істеймін?', a: 'archive@tamga.kz мекенжайына қате туралы хабарлаңыз немесе формада «Техникалық мәселе» тақырыбын таңдаңыз.' },
      { q: 'Серіктес болуға болады ма?', a: 'Иә, академиялық, мәдени мекемелер мен жобалармен ынтымақтастыққа ашықпыз. partner@tamga.kz арқылы бізге жазыңыз.' },
      { q: 'Сайт қандай тілдерде қолжетімді?', a: 'TAMGA қазақ, орыс және ағылшын тілдерінде жұмыс істейді.' },
    ],
  },
  ru: {
    kickBadge: 'Связь с архивом',
    title: 'Контакты',
    subtitle: 'Свяжитесь с нами по вопросам, предложениям или идеям о сотрудничестве.',
    cards: [
      { label: 'Email', value: 'archive@tamga.kz', icon: '✉', hint: 'Для общих вопросов' },
      { label: 'Исследования', value: 'research@tamga.kz', icon: '📚', hint: 'Академические запросы' },
      { label: 'Партнёрство', value: 'partner@tamga.kz', icon: '🤝', hint: 'Предложения о сотрудничестве' },
      { label: 'Телефон', value: '+7 (727) 000-00-00', icon: '📞', hint: 'Пн–Пт, 9:00–18:00' },
    ],
    infoStrip: [
      { icon: '⏱', label: '24 часа', sub: 'время ответа' },
      { icon: '🌍', label: 'КЗ', sub: 'г. Алматы' },
      { icon: '🗣', label: 'RU · KZ · EN', sub: 'языки общения' },
    ],
    formTitle: 'Напишите нам',
    fields: {
      name: 'Ваше имя', namePh: 'Введите ваше имя',
      email: 'Email', emailPh: 'your@email.kz',
      topic: 'Тема',
      message: 'Сообщение', messagePh: 'Напишите ваше сообщение...',
      send: 'Отправить',
    },
    topics: [
      'Общий вопрос',
      'Предложить материал',
      'Техническая проблема',
      'Исследовательское сотрудничество',
      'Запрос от прессы',
      'Предложение о партнёрстве',
      'Другое',
    ],
    successTitle: 'Сообщение отправлено',
    successText: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    faqTitle: 'Часто задаваемые вопросы',
    faqs: [
      { q: 'Можно ли передать оригинальные плёнки фильмов?', a: 'Да, мы принимаем архивные материалы. Пожалуйста, свяжитесь с нами по адресу research@tamga.kz.' },
      { q: 'Можно ли использовать материалы сайта в исследованиях?', a: 'Для академических целей — да. Для коммерческого использования необходимо получить разрешение.' },
      { q: 'Что делать, если я нашёл ошибку на сайте?', a: 'Напишите на archive@tamga.kz или выберите тему «Техническая проблема» в форме.' },
      { q: 'Можно ли стать партнёром проекта?', a: 'Да, мы открыты к сотрудничеству с академическими, культурными учреждениями и проектами. Напишите на partner@tamga.kz.' },
      { q: 'На каких языках доступен сайт?', a: 'TAMGA работает на казахском, русском и английском языках.' },
    ],
  },
  en: {
    kickBadge: 'Contact the Archive',
    title: 'Contacts',
    subtitle: 'Reach out with questions, suggestions, or collaboration ideas.',
    cards: [
      { label: 'Email', value: 'archive@tamga.kz', icon: '✉', hint: 'For general enquiries' },
      { label: 'Research', value: 'research@tamga.kz', icon: '📚', hint: 'Academic requests' },
      { label: 'Partnership', value: 'partner@tamga.kz', icon: '🤝', hint: 'Collaboration proposals' },
      { label: 'Phone', value: '+7 (727) 000-00-00', icon: '📞', hint: 'Mon–Fri, 9:00–18:00' },
    ],
    infoStrip: [
      { icon: '⏱', label: '24h', sub: 'response time' },
      { icon: '🌍', label: 'KZ', sub: 'Almaty' },
      { icon: '🗣', label: 'RU · KZ · EN', sub: 'languages' },
    ],
    formTitle: 'Write to Us',
    fields: {
      name: 'Your Name', namePh: 'Enter your name',
      email: 'Email', emailPh: 'your@email.kz',
      topic: 'Topic',
      message: 'Message', messagePh: 'Write your message...',
      send: 'Send',
    },
    topics: [
      'General Question',
      'Submit a Material',
      'Technical Issue',
      'Research Collaboration',
      'Press Enquiry',
      'Partnership Proposal',
      'Other',
    ],
    successTitle: 'Message Sent',
    successText: 'Thank you! We will get back to you shortly.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'Can I donate original film reels?', a: 'Yes, we accept archival materials. Please contact us at research@tamga.kz.' },
      { q: 'Can I use the site materials for research?', a: 'For academic purposes — yes. Commercial use requires permission.' },
      { q: 'What should I do if I find an error?', a: 'Write to archive@tamga.kz or choose "Technical Issue" as the topic in the form.' },
      { q: 'Can I become a project partner?', a: 'Yes, we are open to collaboration with academic and cultural institutions. Write to partner@tamga.kz.' },
      { q: 'What languages is the site available in?', a: 'TAMGA is available in Kazakh, Russian, and English.' },
    ],
  },
}

export default function ContactsPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'
  const t = copy[locale as 'kk' | 'ru' | 'en'] || copy.ru

  const [formState, setFormState] = useState({ name: '', email: '', topic: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTimeout(() => setSubmitted(true), 400)
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] pt-20">

      {/* HERO */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-4">{t.kickBadge}</p>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-[rgb(var(--foreground))] mb-4">{t.title}</h1>
          <p className="text-[rgb(var(--muted))] text-lg max-w-2xl">{t.subtitle}</p>
        </AnimatedSection>
      </section>

      {/* MAIN — two columns */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* LEFT — cards + socials + info strip */}
          <AnimatedSection>
            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {t.cards.map((card) => (
                <div
                  key={card.label}
                  className="p-5 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 hover:border-[rgb(var(--accent))]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-lg mb-4">
                    {card.icon}
                  </div>
                  <p className="text-xs uppercase tracking-widest text-[rgb(var(--accent))] font-medium mb-1">{card.label}</p>
                  <p className="font-semibold text-[rgb(var(--foreground))] text-sm mb-1 break-all">{card.value}</p>
                  <p className="text-[rgb(var(--muted))] text-xs">{card.hint}</p>
                </div>
              ))}
            </div>

            {/* Info strip */}
            <div className="grid grid-cols-3 gap-3">
              {t.infoStrip.map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 text-center">
                  <div className="text-xl mb-2">{item.icon}</div>
                  <p className="font-bold text-[rgb(var(--foreground))] text-sm">{item.label}</p>
                  <p className="text-[rgb(var(--muted))] text-xs mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* RIGHT — sticky form */}
          <AnimatedSection>
            <div className="sticky top-24 p-6 md:p-8 rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[rgb(var(--accent))]/10 border border-[rgb(var(--accent))]/20 flex items-center justify-center text-2xl mx-auto mb-6">
                    ✓
                  </div>
                  <h3 className="text-xl font-display font-bold text-[rgb(var(--foreground))] mb-3">{t.successTitle}</h3>
                  <p className="text-[rgb(var(--muted))]">{t.successText}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-bold text-[rgb(var(--foreground))] mb-6">{t.formTitle}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-1.5">{t.fields.name}</label>
                      <input
                        required
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={t.fields.namePh}
                        className="w-full rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]/20 text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-[rgb(var(--accent))]/60 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-1.5">{t.fields.email}</label>
                      <input
                        required
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder={t.fields.emailPh}
                        className="w-full rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]/20 text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-[rgb(var(--accent))]/60 transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-1.5">{t.fields.topic}</label>
                      <select
                        required
                        value={formState.topic}
                        onChange={(e) => setFormState({ ...formState, topic: e.target.value })}
                        className="w-full rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]/20 text-[rgb(var(--foreground))] px-4 py-3 focus:outline-none focus:border-[rgb(var(--accent))]/60 transition-colors text-sm"
                      >
                        <option value="" disabled>—</option>
                        {t.topics.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[rgb(var(--muted))] text-sm mb-1.5">{t.fields.message}</label>
                      <textarea
                        required
                        rows={5}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder={t.fields.messagePh}
                        className="w-full rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]/20 text-[rgb(var(--foreground))] placeholder:text-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-[rgb(var(--accent))]/60 transition-colors resize-none text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))]/90 text-black font-bold text-sm transition-colors"
                    >
                      {t.fields.send}
                    </button>
                  </form>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <AnimatedSection>
          <h2 className="text-3xl font-display font-bold text-[rgb(var(--foreground))] mb-8">{t.faqTitle}</h2>
          <div className="space-y-3">
            {t.faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[rgb(var(--card))] border border-[rgb(var(--border))]/15 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-[rgb(var(--foreground))] text-sm pr-4">{faq.q}</span>
                  <span className="text-[rgb(var(--accent))] text-lg flex-shrink-0">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-[rgb(var(--muted))] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

    </main>
  )
}
