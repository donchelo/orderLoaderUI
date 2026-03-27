import { NextRequest, NextResponse } from 'next/server'
import { searchItems } from '@/lib/sap/articles'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') ?? ''
  if (query.length < 2) {
    return NextResponse.json({ items: [] })
  }
  try {
    const items = await searchItems(query)
    return NextResponse.json({ items })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error en búsqueda'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
