import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const { email, name, password } = await req.json()
  if (!email || !name || !password)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const existing = await db.user.findUnique({ where: { email } })
  if (existing)
    return NextResponse.json({ error: 'User exists' }, { status: 409 })
  const hashed = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: { email, name, password: hashed, role: 'USER' },
  })
  return NextResponse.json({ id: user.id, email: user.email, name: user.name })
}
