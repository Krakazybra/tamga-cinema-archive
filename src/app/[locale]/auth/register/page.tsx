'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const t = {
    kk: {
      title: 'Аккаунт жасау',
      subtitle: 'Толық қолжетімділік үшін тіркеліңіз',
      name: 'Аты',
      email: 'Email',
      password: 'Құпия сөз',
      submit: 'Тіркелу',
      errorEmail: 'Email бос емес',
      errorGeneral: 'Тіркелу кезінде қате орын алды',
      hasAccount: 'Аккаунт бар ма?',
      login: 'Кіру',
      namePh: 'Атыңыз',
      emailPh: 'your@email.kz',
      passwordPh: 'Кемінде 6 таңба',
    },
    ru: {
      title: 'Создать аккаунт',
      subtitle: 'Зарегистрируйтесь для полного доступа',
      name: 'Имя',
      email: 'Email',
      password: 'Пароль',
      submit: 'Зарегистрироваться',
      errorEmail: 'Email уже занят',
      errorGeneral: 'Произошла ошибка при регистрации',
      hasAccount: 'Уже есть аккаунт?',
      login: 'Войти',
      namePh: 'Ваше имя',
      emailPh: 'your@email.kz',
      passwordPh: 'Минимум 6 символов',
    },
    en: {
      title: 'Create an account',
      subtitle: 'Register for full access',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      submit: 'Register',
      errorEmail: 'Email already taken',
      errorGeneral: 'An error occurred during registration',
      hasAccount: 'Already have an account?',
      login: 'Sign In',
      namePh: 'Your name',
      emailPh: 'your@email.kz',
      passwordPh: 'Minimum 6 characters',
    },
  }
  const copy = t[locale as keyof typeof t] || t.ru

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 409) {
          setError(copy.errorEmail)
        } else {
          setError(copy.errorGeneral)
        }
        setLoading(false)
        return
      }

      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      router.push(`/${locale}`)
      router.refresh()
    } catch {
      setError(copy.errorGeneral)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--background))] flex items-center justify-center px-4">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-10">
          <Link href={`/${locale}`} className="text-2xl font-bold text-amber-400">
            Қазақ Киносы
          </Link>
          <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mt-4 mb-2">{copy.title}</h1>
          <p className="text-[rgb(var(--muted))]">{copy.subtitle}</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-[rgb(var(--card))] border border-[rgb(var(--border))]/20 rounded-2xl p-8 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reg-name" className="block text-[rgb(var(--muted))] text-sm mb-2">{copy.name}</label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={copy.namePh}
              required
              className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-[rgb(var(--muted))] text-sm mb-2">{copy.email}</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.emailPh}
              required
              className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-[rgb(var(--muted))] text-sm mb-2">{copy.password}</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={copy.passwordPh}
              minLength={6}
              required
              className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold text-lg transition-colors"
          >
            {loading ? '...' : copy.submit}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-[rgb(var(--muted))] mt-6">
          {copy.hasAccount}{' '}
          <Link
            href={`/${locale}/auth/login`}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            {copy.login}
          </Link>
        </p>
      </div>
    </main>
  )
}
