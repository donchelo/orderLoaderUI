'use client'

import type { CompanyInfo, OrderLineItem, OrderFormData } from '@/types/sap'

interface Props {
  company: CompanyInfo
  lines: OrderLineItem[]
  formData: OrderFormData
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
  loadingStep?: string
}

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function ConfirmOrder({ company, lines, formData, loading, onConfirm, onCancel, loadingStep }: Props) {
  const total = lines.reduce((sum, l) => sum + l.total, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Confirmar pedido</h2>
            <p className="text-xs text-gray-500 mt-1">
              Revisa el resumen final antes de enviar a SAP.
            </p>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-blue-200">
            {fmt(total, company.currency)}
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Cliente</span>
              <span className="text-sm font-semibold text-gray-800">{company.cardName}</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Solicitado por</span>
              <span className="text-sm font-semibold text-gray-800">{formData.signedBy}</span>
            </div>
          </div>

          {/* Lines Table Summary */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2">Artículo</th>
                  <th className="px-3 py-2 text-right">Cant.</th>
                  <th className="px-3 py-2 text-center text-[10px]">Entrega</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-medium text-gray-900">{l.itemName}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{l.quantity}</td>
                    <td className="px-3 py-2 text-center text-gray-500 font-mono">{l.deliveryDate}</td>
                    <td className="px-3 py-2 text-right font-bold text-gray-900">{fmt(l.total, company.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {formData.comments && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">Observaciones</span>
              <p className="text-sm text-amber-800">{formData.comments}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex gap-3 justify-end items-center bg-gray-50 rounded-b-xl">
          {loading && (
            <div className="flex-1 flex items-center gap-3">
               <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-xs font-bold text-blue-600 animate-pulse uppercase tracking-wider">
                {loadingStep || 'Procesando...'}
              </span>
            </div>
          )}
          
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-gray-200 active:scale-95"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <span className="text-lg">🛒</span>
                Confirmar y enviar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
