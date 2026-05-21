import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import { Playfair_Display, Inter } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { ThemeApplier } from '@/components/shared/ThemeApplier'
import '../globals.css'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'kk' | 'ru' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=localStorage.getItem('theme-storage');if(s){var d=JSON.parse(s);if(d&&d.state&&d.state.theme==='dark')document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()` }} />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeApplier />
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
