/**
 * Server-side PDF generation using @react-pdf/renderer.
 * NEVER import this file in a client component.
 */
import React from 'react'
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { CompanyInfo, OrderLineItem, OrderFormData } from '@/types/sap'

export interface PdfData {
  orderNum: string
  company: CompanyInfo
  lines: OrderLineItem[]
  formData: OrderFormData
  docTotal: number
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1a1a1a' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold' },
  orderNum: { fontSize: 11, color: '#666', marginTop: 4 },
  labelSmall: { fontSize: 8, color: '#888', marginBottom: 2 },
  textRight: { textAlign: 'right' },
  clientBlock: { marginBottom: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
  clientName: { fontSize: 13, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  clientCode: { fontSize: 10, color: '#666' },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 12,
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eeeeee',
  },
  tableRowAlt: { backgroundColor: '#fafafa' },
  colCode: { width: '12%' },
  colDesc: { width: '38%' },
  colQty: { width: '10%', textAlign: 'right' },
  colDeliv: { width: '12%', textAlign: 'center' },
  colPrice: { width: '14%', textAlign: 'right' },
  colTotal: { width: '14%', textAlign: 'right' },
  totalsSection: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  totalLabel: { fontFamily: 'Helvetica-Bold', marginRight: 16, fontSize: 12 },
  totalValue: { fontFamily: 'Helvetica-Bold', fontSize: 12, minWidth: 90, textAlign: 'right' },
  commentsBox: { marginTop: 24, padding: 10, backgroundColor: '#f7f7f7', borderRadius: 2 },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, textAlign: 'center', color: '#aaa', fontSize: 8 },
})

function fmt(n: number, currency: string): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
}

function OrderDocument({ orderNum, company, lines, formData, docTotal }: PdfData) {
  const today = new Date().toLocaleDateString('es-CO')
  return (
    <Document title={`Orden #${orderNum}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>ORDEN DE PEDIDO</Text>
            <Text style={styles.orderNum}>#{orderNum}</Text>
          </View>
          <View>
            <Text style={[styles.labelSmall, styles.textRight]}>Fecha</Text>
            <Text style={styles.textRight}>{today}</Text>
            <Text style={[styles.labelSmall, styles.textRight, { marginTop: 8 }]}>Solicitado por</Text>
            <Text style={styles.textRight}>{formData.signedBy}</Text>
          </View>
        </View>

        {/* Client */}
        <View style={styles.clientBlock}>
          <Text style={styles.labelSmall}>Cliente</Text>
          <Text style={styles.clientName}>{company.cardName}</Text>
          <Text style={styles.clientCode}>{company.cardCode}</Text>
        </View>

        {/* Table header */}
        <View style={styles.tableHeaderRow}>
          <Text style={{ ...styles.colCode, color: 'white' }}>Código</Text>
          <Text style={{ ...styles.colDesc, color: 'white' }}>Descripción</Text>
          <Text style={{ ...styles.colQty, color: 'white' }}>Cant.</Text>
          <Text style={{ ...styles.colDeliv, color: 'white' }}>Entrega</Text>
          <Text style={{ ...styles.colPrice, color: 'white' }}>P. Unit.</Text>
          <Text style={{ ...styles.colTotal, color: 'white' }}>Total</Text>
        </View>

        {/* Table rows */}
        {lines.map((line, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={styles.colCode}>{line.itemCode}</Text>
            <Text style={styles.colDesc}>{line.itemName}</Text>
            <Text style={styles.colQty}>{line.quantity} {line.uom}</Text>
            <Text style={styles.colDeliv}>{line.deliveryDate}</Text>
            <Text style={styles.colPrice}>{fmt(line.unitPrice, company.currency)}</Text>
            <Text style={styles.colTotal}>{fmt(line.total, company.currency)}</Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalsSection}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{fmt(docTotal, company.currency)}</Text>
        </View>

        {/* Comments */}
        {formData.comments ? (
          <View style={styles.commentsBox}>
            <Text style={styles.labelSmall}>Observaciones</Text>
            <Text>{formData.comments}</Text>
          </View>
        ) : null}

        {/* Footer */}
        <Text style={styles.footer}>
          {process.env.NEXT_PUBLIC_COMPANY_NAME} — Documento generado automáticamente
        </Text>
      </Page>
    </Document>
  )
}

export async function generateOrderPdf(data: PdfData): Promise<Buffer> {
  const buffer = await renderToBuffer(<OrderDocument {...data} />)
  return Buffer.from(buffer)
}
