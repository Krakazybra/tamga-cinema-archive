import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbCollectionToCollection } from '@/lib/content'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const col = await db.collection.findUnique({ where: { slug } })
    if (!col) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(dbCollectionToCollection(col))
  }

  const collections = await db.collection.findMany({ orderBy: { titleRu: 'asc' } })
  return NextResponse.json(collections.map(dbCollectionToCollection))
}
