import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbCollectionToCollection } from '@/lib/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const dbCol = await db.collection.findUnique({ where: { slug } }).catch(() => null)
    if (!dbCol) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbCollectionToCollection(dbCol))
  }

  const dbRows = await db.collection.findMany().catch(() => [])
  const collections = dbRows.map(dbCollectionToCollection)
  return NextResponse.json(collections.sort((a, b) => {
    const at = typeof a.title === 'string' ? a.title : a.title.ru
    const bt = typeof b.title === 'string' ? b.title : b.title.ru
    return at.localeCompare(bt)
  }))
}
