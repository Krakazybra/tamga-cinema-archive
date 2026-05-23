import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbTimelineEventToTimelineEvent } from '@/lib/content'
import { timelineEvents as staticEvents } from '@/data/timeline'
import type { TimelineEvent } from '@/types'

export async function GET() {
  const dbRows = await db.timelineEvent.findMany({ orderBy: { year: 'asc' } }).catch(() => [])
  const dbEvents = dbRows.map(dbTimelineEventToTimelineEvent)
  const dbSlugs = new Set(dbEvents.map((e) => e.id))
  const merged: TimelineEvent[] = [...dbEvents, ...staticEvents.filter((e) => !dbSlugs.has(e.id))]
  return NextResponse.json(merged.sort((a, b) => a.year - b.year))
}
