'use client'

import type { CompanyInfo, OrderLineItem, OrderFormData } from '@/types/sap'

interface Props {
  company: CompanyInfo
  lines: OrderLineItem[]
  formData: OrderFormData
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function ConfirmOrder({ company, lines, formData, loading, onConfirm, onCancel }: Props) {
  const total = lines.reduce((sum, l) => sum + l.total, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">Confirmar pedido</h2>
          <p className="text-sm text-gray-500 mt-1">
            Revisa el resumen antes de enviar.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Cliente</span>
              <span className="font-medium">{company.cardName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Fecha de entrega</span>
              <span className="font-medium">{formData.deliveryDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Artículos</span>
              <span className="font-medium">{lines.length} línea{lines.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900 text-base">{fmt(total, company.currency)}</span>
            </div>
          </div>

          {formData.comments && (
            <div className="text-sm text-gray-600">
              <span className="text-gray-400 text-xs block mb-1">Observaciones</span>
              {formData.comments}
            </div>
          )}

          <p className="text-xs text-gray-400">
            Al confirmar, el pedido se creará en SAP y recibirás un email con el PDF adjunto.
          </p>
        </div>

        <div className="p-6 border-t flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              'Confirmar pedido'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
