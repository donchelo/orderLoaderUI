import { NextRequest, NextResponse, after } from 'next/server'
import { createSalesOrder } from '@/lib/sap/orders'
import { generateOrderPdf } from '@/lib/pdf/orderPdf'
import { sendOrderEmails } from '@/lib/email/mailer'
import type { SubmitOrderPayload, SAPOrder } from '@/types/sap'

export async function POST(req: NextRequest) {
  let body: SubmitOrderPayload
  try {
    body = (await req.json()) as SubmitOrderPayload
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const { company, lines, formData } = body

  if (!company?.cardCode || !lines?.length || !formData?.signedBy) {
    return NextResponse.json(
      { error: 'Datos del pedido incompletos (Falta firma o artículos)' },
      { status: 400 }
    )
  }

  const warehouseCode = process.env.SAP_WAREHOUSE_CODE ?? '01'

  // Header date should be the earliest delivery date of the lines
  const sortedDates = [...lines].map(l => l.deliveryDate).sort()
  const headerDueDate = sortedDates[0] || new Date().toISOString().split('T')[0]

  // 1. Build SAP order document
  const sapOrder: SAPOrder = {
    CardCode: company.cardCode,
    DocDate: new Date().toISOString().split('T')[0],
    DocDueDate: headerDueDate,
    Comments: `Firma: ${formData.signedBy}\n${formData.comments || ''}`,
    DocumentLines: lines.map((line) => ({
      ItemCode: line.itemCode,
      ItemDescription: line.itemName,
      Quantity: line.quantity,
      UnitPrice: line.unitPrice,
      ShipDate: line.deliveryDate,
      WarehouseCode: warehouseCode,
    })),
  }

  // 2. Create in SAP — commit point. A failure here is safe to report as an
  // error: nothing was created, so the client can safely retry.
  let sapResponse
  try {
    sapResponse = await createSalesOrder(sapOrder)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al crear el pedido en SAP'
    console.error('[api/sap/orders] SAP creation failed:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const docNum = String(sapResponse.DocNum)

  // 3-4. PDF + email run AFTER responding to the client. The order already
  // exists in SAP at this point — a failure here must never surface as an
  // order-creation error, or a retry would create a duplicate SAP order.
  after(async () => {
    try {
      const pdfBuffer = await generateOrderPdf({
        orderNum: docNum,
        company,
        lines,
        formData,
        docTotal: sapResponse.DocTotal,
      })
      await sendOrderEmails({
        company,
        orderNum: docNum,
        pdfBuffer,
        lines,
        docTotal: sapResponse.DocTotal,
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error generando PDF o enviando emails'
      console.error(`[api/sap/orders] pedido ${docNum} creado en SAP pero PDF/email falló:`, msg)
    }
  })

  return NextResponse.json({
    success: true,
    docNum: sapResponse.DocNum,
    docEntry: sapResponse.DocEntry,
    docTotal: sapResponse.DocTotal,
  })
}
