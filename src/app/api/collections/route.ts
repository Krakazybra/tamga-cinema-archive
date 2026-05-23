import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbCollectionToCollection } from '@/lib/content'
import { collections as staticCollections } from '@/data/collections'
import type { Collection } from '@/types'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (slug) {
    const dbCol = await db.collection.findUnique({ where: { slug } }).catch(() => null)
    if (dbCol) return NextResponse.json(dbCollectionToCollection(dbCol))
    const staticCol = staticCollections.find((c) => c.slug === slug)
    if (!staticCol) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(staticCol)
  }

  const dbRows = await db.collection.findMany().catch(() => [])
  const dbCols = dbRows.map(dbCollectionToCollection)
  const dbSlugs = new Set(dbCols.map((c) => c.slug))
  const merged: Collection[] = [...dbCols, ...staticCollections.filter((c) => !dbSlugs.has(c.slug))]

  return NextResponse.json(merged.sort((a, b) => {
    const at = typeof a.title === 'string' ? a.title : a.title.ru
    const bt = typeof b.title === 'string' ? b.title : b.title.ru
    return at.localeCompare(bt)
  }))
}
