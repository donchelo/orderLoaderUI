'use client'

import type { OrderFormData } from '@/types/sap'

interface Props {
  formData: OrderFormData
  onChange: (data: OrderFormData) => void
}

export function OrderFormFields({ formData, onChange }: Props) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de entrega <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          min={today}
          value={formData.deliveryDate}
          onChange={(e) => onChange({ ...formData, deliveryDate: e.target.value })}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          value={formData.comments}
          onChange={(e) => onChange({ ...formData, comments: e.target.value })}
          rows={2}
          placeholder="Instrucciones especiales, referencias, etc."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  )
}
