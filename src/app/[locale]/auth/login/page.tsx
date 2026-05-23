'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'ru'
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const t = {
    kk: {
      title: 'Аккаунтқа кіру',
      subtitle: 'Кіру деректерін енгізіңіз',
      email: 'Email',
      password: 'Құпия сөз',
      submit: 'Кіру',
      error: 'Қате email немесе құпия сөз',
      noAccount: 'Аккаунт жоқ па?',
      register: 'Тіркелу',
      emailPh: 'your@email.kz',
      passwordPh: 'Құпия сөзді енгізіңіз',
    },
    ru: {
      title: 'Войти в аккаунт',
      subtitle: 'Введите данные для входа',
      email: 'Email',
      password: 'Пароль',
      submit: 'Войти',
      error: 'Неверный email или пароль',
      noAccount: 'Нет аккаунта?',
      register: 'Зарегистрироваться',
      emailPh: 'your@email.kz',
      passwordPh: 'Введите пароль',
    },
    en: {
      title: 'Sign in to your account',
      subtitle: 'Enter your credentials',
      email: 'Email',
      password: 'Password',
      submit: 'Sign In',
      error: 'Invalid email or password',
      noAccount: 'No account?',
      register: 'Register',
      emailPh: 'your@email.kz',
      passwordPh: 'Enter password',
    },
  }
  const copy = t[locale as keyof typeof t] || t.ru

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: `/${locale}`,
    })

    if (result?.error) {
      setError(copy.error)
      setLoading(false)
    } else {
      router.push(`/${locale}`)
      router.refresh()
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
            <label htmlFor="login-email" className="block text-[rgb(var(--muted))] text-sm mb-2">{copy.email}</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.emailPh}
              required
              className="w-full rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))]/30 text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))]/50 px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-[rgb(var(--muted))] text-sm mb-2">{copy.password}</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={copy.passwordPh}
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

        {/* REGISTER LINK */}
        <p className="text-center text-[rgb(var(--muted))] mt-6">
          {copy.noAccount}{' '}
          <Link
            href={`/${locale}/auth/register`}
            className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
          >
            {copy.register}
          </Link>
        </p>
      </div>
    </main>
  )
}
