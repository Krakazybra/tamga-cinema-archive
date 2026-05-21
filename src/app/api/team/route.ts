import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    const members = await db.teamMember.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(members)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  try {
    const body = await req.json()
    const member = await db.teamMember.create({
      data: {
        order: body.order ?? 0,
        nameRu: body.nameRu ?? '',
        nameKk: body.nameKk ?? '',
        nameEn: body.nameEn ?? '',
        roleRu: body.roleRu ?? '',
        roleKk: body.roleKk ?? '',
        roleEn: body.roleEn ?? '',
        quoteRu: body.quoteRu ?? '',
        skills: JSON.stringify(Array.isArray(body.skills) ? body.skills : []),
        photo: body.photo ?? '',
      },
    })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    if (data.skills !== undefined && Array.isArray(data.skills)) {
      data.skills = JSON.stringify(data.skills)
    }

    const member = await db.teamMember.update({ where: { id }, data })
    return NextResponse.json(member)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const check = await requireAdmin()
  if ('error' in check) return check.error

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    await db.teamMember.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
