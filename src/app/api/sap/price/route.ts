import { NextRequest, NextResponse } from 'next/server'
import { getItemPrice } from '@/lib/sap/prices'

export async function GET(req: NextRequest) {
  const itemCode  = req.nextUrl.searchParams.get('itemCode') ?? ''
  const cardCode  = req.nextUrl.searchParams.get('cardCode') ?? ''
  const priceList = parseInt(req.nextUrl.searchParams.get('priceList') ?? '1', 10)
  const quantity  = parseFloat(req.nextUrl.searchParams.get('quantity') ?? '1')

  if (!itemCode || !cardCode) {
    return NextResponse.json(
      { error: 'itemCode y cardCode son requeridos' },
      { status: 400 }
    )
  }
  try {
    const result = await getItemPrice(itemCode, cardCode, priceList, quantity)
    return NextResponse.json(result)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al consultar precio'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
