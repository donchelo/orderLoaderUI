import nodemailer from 'nodemailer'
import type { CompanyInfo, OrderLineItem } from '@/types/sap'

export interface EmailOrderPayload {
  company: CompanyInfo
  orderNum: string
  pdfBuffer: Buffer
  lines: OrderLineItem[]
  docTotal: number
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST!,
    port: parseInt(process.env.EMAIL_SMTP_PORT ?? '587', 10),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  })
}

function buildTableHtml(lines: OrderLineItem[], total: number, currency: string): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

  const rows = lines
    .map(
      (l) => `
      <tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${l.itemCode}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px">${l.itemName}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right">${l.quantity} ${l.uom}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right">${fmt(l.unitPrice)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-size:13px;text-align:right">${fmt(l.total)}</td>
      </tr>`
    )
    .join('')

  return `
    <table style="width:100%;border-collapse:collapse;font-family:sans-serif">
      <thead>
        <tr style="background:#1a1a2e;color:white">
          <th style="padding:8px 10px;text-align:left;font-size:12px">Código</th>
          <th style="padding:8px 10px;text-align:left;font-size:12px">Artículo</th>
          <th style="padding:8px 10px;text-align:right;font-size:12px">Cant.</th>
          <th style="padding:8px 10px;text-align:right;font-size:12px">P. Unit.</th>
          <th style="padding:8px 10px;text-align:right;font-size:12px">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="padding:8px 10px;font-weight:bold;text-align:right;font-size:13px">TOTAL</td>
          <td style="padding:8px 10px;font-weight:bold;text-align:right;font-size:13px">${fmt(total)}</td>
        </tr>
      </tfoot>
    </table>`
}

export async function sendOrderEmails(payload: EmailOrderPayload): Promise<void> {
  const { company, orderNum, pdfBuffer, lines, docTotal } = payload
  const transporter = createTransporter()
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Sistema de Pedidos'
  const from = `${appName} <${process.env.EMAIL_USER}>`
  const notifyEmail = process.env.NOTIFY_EMAIL!

  const attachment = {
    filename: `Orden-${orderNum}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf',
  }

  const tableHtml = buildTableHtml(lines, docTotal, company.currency)

  // Email to client
  await transporter.sendMail({
    from,
    to: company.email,
    subject: `Confirmación de Pedido #${orderNum}`,
    html: `
      <div style="font-family:sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1a1a2e;padding:20px 24px;border-radius:4px 4px 0 0">
          <h2 style="color:white;margin:0;font-size:18px">${appName}</h2>
        </div>
        <div style="padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 4px 4px">
          <h3 style="margin-top:0">Pedido #${orderNum} confirmado</h3>
          <p>Estimado(a) <strong>${company.cardName}</strong>,</p>
          <p>Su pedido ha sido registrado exitosamente. Encuentre a continuación el resumen y el PDF adjunto.</p>
          ${tableHtml}
          <p style="margin-top:16px;color:#666;font-size:12px">Este es un mensaje automático. Por favor no responda a este correo.</p>
        </div>
      </div>`,
    attachments: [attachment],
  })

  // Email to internal team
  await transporter.sendMail({
    from,
    to: notifyEmail,
    subject: `[${appName}] Nueva Orden #${orderNum} — ${company.cardName}`,
    html: `
      <div style="font-family:sans-serif;max-width:620px;margin:0 auto;color:#1a1a1a">
        <h2>Nueva Orden Recibida: #${orderNum}</h2>
        <p><strong>Cliente:</strong> ${company.cardName} (${company.cardCode})</p>
        <p><strong>Email:</strong> ${company.email}</p>
        ${tableHtml}
      </div>`,
    attachments: [attachment],
  })
}
