'use client'

import { useState } from 'react'
import { ArticleSearch } from './ArticleSearch'
import { OrderTable } from './OrderTable'
import { OrderFormFields } from './OrderFormFields'
import { ConfirmOrder } from './ConfirmOrder'
import type { CompanyInfo, OrderLineItem, OrderFormData, SubmitOrderResult } from '@/types/sap'

interface Props {
  company: CompanyInfo
}

type Status = 'idle' | 'confirming' | 'submitting' | 'success' | 'error'

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function OrderForm({ company }: Props) {
  const [lines, setLines] = useState<OrderLineItem[]>([])
  const [formData, setFormData] = useState<OrderFormData>({ signedBy: '', comments: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<SubmitOrderResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [syncingIndex, setSyncingIndex] = useState<number | null>(null)

  const addItem = (item: OrderLineItem) => {
    setLines((prev) => {
      const existing = prev.findIndex((l) => l.itemCode === item.itemCode)
      if (existing >= 0) {
        return prev.map((l, i) =>
          i === existing
            ? { ...l, quantity: l.quantity + 1, total: l.unitPrice * (l.quantity + 1) }
            : l
        )
      }
      const today = new Date().toISOString().split('T')[0]
      return [...prev, { ...item, deliveryDate: today }]
    })
  }

  const updateDeliveryDate = (index: number, date: string) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, deliveryDate: date } : l))
    )
  }

  const updateQty = (index: number, qty: number) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, quantity: qty, total: l.unitPrice * qty } : l))
    )
  }

  const syncPrice = async (index: number) => {
    const line = lines[index]
    if (!line) return

    setSyncingIndex(index)
    console.log(`Sincronizando precio para ${line.itemCode} con cantidad ${line.quantity}...`)

    try {
      const url = `/api/sap/price?itemCode=${line.itemCode}&cardCode=${company.cardCode}&priceList=${company.priceListNum}&quantity=${line.quantity}`
      const res = await fetch(url)
      const data = await res.json()
      
      console.log('Respuesta de SAP:', data)

      if (res.ok && data.price > 0) {
        if (data.price === line.unitPrice) {
          console.log('El precio es el mismo, no se requiere actualización.')
        }
        setLines((prev) =>
          prev.map((l, i) =>
            i === index
              ? { ...l, unitPrice: data.price, total: data.price * l.quantity }
              : l
          )
        )
      } else {
        console.warn('No se encontró un precio especial o escala para esta cantidad.')
      }
    } catch (error) {
      console.error('Error syncing price:', error)
      alert('Error al sincronizar el precio. Revisa la consola.')
    } finally {
      setSyncingIndex(null)
    }
  }

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitRequest = () => {
    if (!formData.signedBy) {
      alert('Por favor ingrese el nombre de quien recibe (Firma).')
      return
    }
    if (lines.length === 0) {
      alert('Agrega al menos un artículo al pedido.')
      return
    }
    setStatus('confirming')
  }

  const handleConfirm = async () => {
    setStatus('submitting')
    try {
      const res = await fetch('/api/sap/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, lines, formData }),
      })
      const data = await res.json() as SubmitOrderResult & { error?: string }
      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Error al enviar el pedido')
      }
      setResult(data)
      setStatus('success')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Error desconocido')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setLines([])
    setFormData({ signedBy: '', comments: '' })
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
  }

  if (status === 'success' && result) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Pedido enviado!</h2>
        <p className="text-gray-500 mb-1">
          Orden <strong>#{result.docNum}</strong> creada en SAP exitosamente.
        </p>
        <p className="text-gray-500 mb-6">
          Total: <strong>{fmt(result.docTotal, company.currency)}</strong>
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Recibirás un email con el PDF del pedido en <strong>{company.email}</strong>.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nuevo pedido
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error al enviar el pedido</h2>
        <p className="text-gray-500 mb-6 text-sm">{errorMsg}</p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-900 transition-colors"
        >
          Volver al pedido
        </button>
      </div>
    )
  }

  return (
    <>
      {status === 'confirming' && (
        <ConfirmOrder
          company={company}
          lines={lines}
          formData={formData}
          loading={false}
          onConfirm={handleConfirm}
          onCancel={() => setStatus('idle')}
        />
      )}

      {status === 'submitting' && (
        <ConfirmOrder
          company={company}
          lines={lines}
          formData={formData}
          loading={true}
          onConfirm={handleConfirm}
          onCancel={() => {}}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Column: Articles & Table */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">🔍</span>
              Buscar artículos
            </h2>
            <ArticleSearch
              cardCode={company.cardCode}
              priceListNum={company.priceListNum}
              onSelectItem={addItem}
            />
          </div>

          {/* Order lines */}
          <div className="bg-white rounded-xl shadow p-6 min-h-[400px]">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-lg">📄</span>
              Artículos del pedido
              {lines.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  {lines.length} {lines.length === 1 ? 'item' : 'ítems'}
                </span>
              )}
            </h2>
            <OrderTable
              lines={lines}
              currency={company.currency}
              onUpdateQty={updateQty}
              onUpdateDeliveryDate={updateDeliveryDate}
              onSyncPrice={syncPrice}
              onRemove={removeLine}
              syncingIndex={syncingIndex}
            />
          </div>
        </div>

        {/* Sidebar: Totals & Submit */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="bg-gray-900 px-6 py-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Resumen del pedido</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Visual Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{fmt(lines.reduce((s, l) => s + l.total, 0), company.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-base font-bold text-gray-900">TOTAL</span>
                    <span className="text-xl font-extrabold text-blue-600">
                      {fmt(lines.reduce((s, l) => s + l.total, 0), company.currency)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <OrderFormFields formData={formData} onChange={setFormData} />
                </div>

                <button
                  onClick={handleSubmitRequest}
                  disabled={lines.length === 0}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🚀</span>
                  Enviar pedido
                </button>
                
                {lines.length === 0 && (
                  <p className="text-center text-xs text-gray-400">
                    Agrega artículos para habilitar el envío
                  </p>
                )}
              </div>
            </div>

            {/* Hint */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-bold">Tip:</span> Los precios se sincronizan automáticamente con las escalas de SAP al cambiar la cantidad. ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
