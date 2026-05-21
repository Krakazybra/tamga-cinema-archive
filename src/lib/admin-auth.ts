import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function requireAdmin(): Promise<{ error: NextResponse } | { ok: true }> {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { ok: true }
}

export async function requireAdminOrModerator(): Promise<{ error: NextResponse } | { ok: true }> {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || (role !== 'ADMIN' && role !== 'MODERATOR')) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { ok: true }
}

export function ensureArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    try { const p = JSON.parse(value); return Array.isArray(p) ? p.map(String) : [] } catch { return [] }
  }
  return []
}

export function safeInt(value: unknown, fallback = 0): number {
  const n = parseInt(String(value), 10)
  return isNaN(n) ? fallback : n
}
