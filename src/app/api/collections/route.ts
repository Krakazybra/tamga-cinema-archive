import { NextResponse } from 'next/server'
import { collections } from '@/data/collections'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const col = collections.find((c) => c.slug === slug)
    if (!col) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(col)
  }

  return NextResponse.json([...collections].sort((a, b) => {
    const at = typeof a.title === 'string' ? a.title : a.title.ru
    const bt = typeof b.title === 'string' ? b.title : b.title.ru
    return at.localeCompare(bt)
  }))
}
