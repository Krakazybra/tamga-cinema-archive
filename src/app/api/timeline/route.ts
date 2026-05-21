import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dbTimelineEventToTimelineEvent } from '@/lib/content'

export async function GET() {
  const events = await db.timelineEvent.findMany({ orderBy: { year: 'asc' } })
  return NextResponse.json(events.map(dbTimelineEventToTimelineEvent))
}
