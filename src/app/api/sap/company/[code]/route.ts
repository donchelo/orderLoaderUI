import { NextRequest, NextResponse } from 'next/server'
import { getBusinessPartner } from '@/lib/sap/companies'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const company = await getBusinessPartner(code)
    return NextResponse.json(company)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    const status = msg.includes('not found') ? 404 : 500
    return NextResponse.json({ error: msg }, { status })
  }
}
