'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { EmptyState } from '@/components/shared/EmptyState'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string | null
    email?: string | null
  }
}

interface Props {
  filmSlug: string
  locale: string
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-[rgb(var(--surface))] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded bg-[rgb(var(--surface))]" />
            <div className="h-3 w-full rounded bg-[rgb(var(--surface))]" />
            <div className="h-3 w-3/4 rounded bg-[rgb(var(--surface))]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Avatar({ name }: { name: string }) {
  const letter = name?.charAt(0)?.toUpperCase() || '?'
  const colors = [
    'bg-amber-500', 'bg-emerald-500', 'bg-sky-500',
    'bg-violet-500', 'bg-rose-500', 'bg-orange-500',
  ]
  const color = colors[letter.charCodeAt(0) % colors.length]
  return (
    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
      {letter}
    </div>
  )
}

export function CommentsSection({ filmSlug, locale }: Props) {
  const { data: session, status } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userRole = (session?.user as { role?: string })?.role

  const refetch = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?filmSlug=${filmSlug}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }, [filmSlug])

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      try {
        const res = await fetch(`/api/comments?filmSlug=${filmSlug}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [filmSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || submitting) return

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmSlug, content: content.trim() }),
      })
      if (res.ok) {
        setContent('')
        await refetch()
      } else {
        const data = await res.json()
        setError(data.error || 'Ошибка при отправке комментария')
      }
    } catch {
      setError('Ошибка соединения')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
    if (res.ok) await refetch()
  }

  const formatDate = (iso: string) => {
    return new Intl.DateTimeFormat(locale === 'kk' ? 'kk-KZ' : locale === 'en' ? 'en-US' : 'ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso))
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-[rgb(var(--foreground))]">
        {locale === 'kk' ? 'Пікірлер' : locale === 'en' ? 'Comments' : 'Комментарии'}
        {comments.length > 0 && (
          <span className="ml-2 text-lg text-[rgb(var(--muted))]">({comments.length})</span>
        )}
      </h2>

      {status === 'authenticated' ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-3">
            <Avatar name={session.user?.name || session.user?.email || 'U'} />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  locale === 'kk'
                    ? 'Пікір жазыңыз...'
                    : locale === 'en'
                    ? 'Write a comment...'
                    : 'Напишите комментарий...'
                }
                rows={3}
                className="w-full rounded-lg bg-[rgb(var(--card))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] px-4 py-3 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm transition-colors"
            >
              {submitting
                ? locale === 'kk' ? 'Жіберілуде...' : locale === 'en' ? 'Sending...' : 'Отправка...'
                : locale === 'kk' ? 'Жіберу' : locale === 'en' ? 'Submit' : 'Отправить'}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-lg bg-[rgb(var(--card))]/50 border border-[rgb(var(--border))] px-6 py-5 text-center">
          <p className="text-[rgb(var(--muted))] mb-3">
            {locale === 'kk'
              ? 'Пікір қалдыру үшін кіріңіз'
              : locale === 'en'
              ? 'Sign in to leave a comment'
              : 'Войдите, чтобы оставить комментарий'}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-block px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors"
          >
            {locale === 'kk' ? 'Кіру' : locale === 'en' ? 'Sign In' : 'Войти'}
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <Skeleton />
        ) : comments.length === 0 ? (
          <EmptyState
            title={
              locale === 'kk'
                ? 'Пікірлер әлі жоқ'
                : locale === 'en'
                ? 'No comments yet'
                : 'Комментариев пока нет'
            }
          />
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.user.name || comment.user.email || 'U'} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[rgb(var(--foreground))] text-sm">
                    {comment.user.name || comment.user.email || 'User'}
                  </span>
                  <span className="text-[rgb(var(--muted))] text-xs">{formatDate(comment.createdAt)}</span>
                  {(userRole === 'ADMIN' || userRole === 'MODERATOR') && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-red-400 hover:text-red-300 text-xs px-2 py-0.5 rounded hover:bg-red-500/10 transition-colors"
                      title="Удалить комментарий"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-[rgb(var(--muted))] text-sm leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
