'use client'

import type { OrderLineItem } from '@/types/sap'

interface Props {
  lines: OrderLineItem[]
  currency: string
  onUpdateQty: (index: number, qty: number) => void
  onUpdateDeliveryDate: (index: number, date: string) => void
  onSyncPrice: (index: number) => void
  onRemove: (index: number) => void
  syncingIndex: number | null
}

function fmt(n: number, currency: string) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function OrderTable({ lines, currency, onUpdateQty, onUpdateDeliveryDate, onSyncPrice, onRemove, syncingIndex }: Props) {
  if (lines.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
        Aún no hay artículos en el pedido. Búscalos arriba.
      </div>
    )
  }

  const grandTotal = lines.reduce((sum, l) => sum + l.total, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-white text-left">
            <th className="px-3 py-2 rounded-tl-md">Código</th>
            <th className="px-3 py-2">Artículo</th>
            <th className="px-3 py-2 text-right">Cant.</th>
            <th className="px-3 py-2 text-center w-32">Entrega</th>
            <th className="px-3 py-2 text-right">P. Unit.</th>
            <th className="px-3 py-2 text-right">Total</th>
            <th className="px-3 py-2 rounded-tr-md w-10" />
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-3 py-2 font-mono text-xs text-gray-600">{line.itemCode}</td>
              <td className="px-3 py-2 text-gray-900">{line.itemName}</td>
              <td className="px-3 py-2 text-right">
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10)
                    if (v > 0) onUpdateQty(i, v)
                  }}
                  onBlur={() => onSyncPrice(i)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-right text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={line.deliveryDate}
                  onChange={(e) => onUpdateDeliveryDate(i, e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </td>
              <td className="px-3 py-2 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="text-right">
                    <span className="text-gray-700 block">{fmt(line.unitPrice, currency)}</span>
                    {syncingIndex === i && (
                      <span className="text-[10px] text-blue-500 animate-pulse font-bold block">
                        Actualizando precio...
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSyncPrice(i)}
                    disabled={syncingIndex === i}
                    title="Actualizar precio según escala"
                    className="p-1 text-blue-500 hover:bg-blue-50 rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                  >
                    {syncingIndex === i ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    ) : (
                      '✨'
                    )}
                  </button>
                </div>
              </td>
              <td className="px-3 py-2 text-right font-medium">{fmt(line.total, currency)}</td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => onRemove(i)}
                  className="text-red-400 hover:text-red-600 transition-colors text-lg leading-none"
                  aria-label="Eliminar línea"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-900">
            <td colSpan={5} className="px-3 py-3 text-right font-bold text-gray-900">
              TOTAL
            </td>
            <td className="px-3 py-3 text-right font-bold text-gray-900 text-base">
              {fmt(grandTotal, currency)}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
