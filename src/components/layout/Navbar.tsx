'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, Search, Film, LogOut, User, Shield, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { NotificationBell } from '@/components/shared/NotificationBell'

export function Navbar() {
  const { data: session } = useSession()
  const locale = useLocale()
  const t = useTranslations('nav')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/', label: locale === 'kk' ? 'Басты' : locale === 'en' ? 'Home' : 'Главная' },
    { href: '/films', label: t('films') },
    { href: '/persons', label: t('persons') },
    { href: '/collections', label: t('collections') },
    { href: '/timeline', label: t('timeline') },
    { href: '/contacts', label: t('contacts') },
    { href: '/about', label: t('about') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const initials = session?.user?.name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[rgb(var(--background))]/90 backdrop-blur-md border-b border-[rgb(var(--border))] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <Film className="w-6 h-6 text-[rgb(var(--primary))]" />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-[rgb(var(--foreground))] leading-none">TAMGA</span>
                <span className="text-[rgb(var(--muted))] text-[10px] leading-none hidden sm:block">Архив казахского кино</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-sm px-3 py-2 rounded-md text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:bg-[rgb(var(--surface))] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/${locale}/search`}>
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
              </Link>

              <LanguageSwitcher />
              <ThemeToggle />
              <div className="hidden lg:flex items-center gap-2">
                <NotificationBell />
              </div>

              {session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[rgb(var(--primary))] text-white text-xs">
                          {initials ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-[rgb(var(--muted))]">{session.user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/profile`} className="flex items-center gap-2">
                        <User className="w-4 h-4" /> {t('profile')}
                      </Link>
                    </DropdownMenuItem>
                    {(session.user as { role?: string })?.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/${locale}/admin`} className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            {locale === 'kk' ? 'Әкімші' : locale === 'en' ? 'Admin' : 'Админ'}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href={`/${locale}/auth/login`} className="hidden lg:block">
                  <Button size="sm" className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white">
                    {t('login')}
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[rgb(var(--background))] lg:hidden flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-[rgb(var(--border))]/20">
            <Link
              href={`/${locale}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2"
            >
              <Film className="w-6 h-6 text-[rgb(var(--primary))]" />
              <span className="font-display font-bold text-lg text-[rgb(var(--foreground))]">TAMGA</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-display font-medium py-4 border-b border-[rgb(var(--border))]/15 text-[rgb(var(--foreground))] hover:text-[rgb(var(--accent))] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {!session?.user && (
            <div className="px-6 py-5 border-t border-[rgb(var(--border))]/20 flex items-center">
              <Link
                href={`/${locale}/auth/login`}
                className="ml-auto"
                onClick={() => setMobileOpen(false)}
              >
                <Button size="sm" className="bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/90 text-white">
                  {t('login')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
