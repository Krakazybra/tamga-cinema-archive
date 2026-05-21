import { NextResponse } from 'next/server'
import { timelineEvents } from '@/data/timeline'

export async function GET() {
  return NextResponse.json([...timelineEvents].sort((a, b) => a.year - b.year))
}
