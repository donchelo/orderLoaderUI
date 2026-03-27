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
  const [formData, setFormData] = useState<OrderFormData>({ deliveryDate: '', comments: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<SubmitOrderResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

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
      return [...prev, item]
    })
  }

  const updateQty = (index: number, qty: number) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, quantity: qty, total: l.unitPrice * qty } : l))
    )
  }

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitRequest = () => {
    if (!formData.deliveryDate) {
      alert('Selecciona la fecha de entrega antes de continuar.')
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
    setFormData({ deliveryDate: '', comments: '' })
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

      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Buscar artículos</h2>
          <ArticleSearch
            cardCode={company.cardCode}
            priceListNum={company.priceListNum}
            onSelectItem={addItem}
          />
        </div>

        {/* Order lines */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Artículos del pedido
            {lines.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({lines.length})</span>
            )}
          </h2>
          <OrderTable
            lines={lines}
            currency={company.currency}
            onUpdateQty={updateQty}
            onRemove={removeLine}
          />
        </div>

        {/* Form fields + submit */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Datos del pedido</h2>
          <OrderFormFields formData={formData} onChange={setFormData} />
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmitRequest}
              disabled={lines.length === 0}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Enviar pedido
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
