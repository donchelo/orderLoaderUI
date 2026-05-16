import { NextRequest, NextResponse } from 'next/server'
import { createSalesOrder } from '@/lib/sap/orders'
import { generateOrderPdf } from '@/lib/pdf/orderPdf'
import { sendOrderEmails } from '@/lib/email/mailer'
import type { SubmitOrderPayload, SAPOrder } from '@/types/sap'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitOrderPayload
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

    // 2. Create in SAP (commit point — do first)
    const sapResponse = await createSalesOrder(sapOrder)

    // 3. Generate PDF
    const pdfBuffer = await generateOrderPdf({
      orderNum: String(sapResponse.DocNum),
      company,
      lines,
      formData,
      docTotal: sapResponse.DocTotal,
    })

    // 4. Send emails (client + admin)
    await sendOrderEmails({
      company,
      orderNum: String(sapResponse.DocNum),
      pdfBuffer,
      lines,
      docTotal: sapResponse.DocTotal,
    })

    return NextResponse.json({
      success: true,
      docNum: sapResponse.DocNum,
      docEntry: sapResponse.DocEntry,
      docTotal: sapResponse.DocTotal,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error al procesar el pedido'
    console.error('[api/sap/orders]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
