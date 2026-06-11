import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbTimelineEventToTimelineEvent } from '@/lib/content'

export async function GET() {
  const dbRows = await db.timelineEvent.findMany({ orderBy: { year: 'asc' } }).catch(() => [])
  return NextResponse.json(dbRows.map(dbTimelineEventToTimelineEvent))
}
