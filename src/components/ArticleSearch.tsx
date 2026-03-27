'use client'

import { useState, useRef } from 'react'
import type { SAPItem, OrderLineItem, PriceResult } from '@/types/sap'

interface Props {
  cardCode: string
  priceListNum: number
  onSelectItem: (item: OrderLineItem) => void
}

export function ArticleSearch({ cardCode, priceListNum, onSelectItem }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SAPItem[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchArticles = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sap/articles?q=${encodeURIComponent(q)}`)
      const data = await res.json() as { items: SAPItem[] }
      setResults(data.items ?? [])
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length >= 2) {
      debounceRef.current = setTimeout(() => fetchArticles(val), 300)
    } else {
      setResults([])
      setOpen(false)
    }
  }

  const handleSelect = async (item: SAPItem) => {
    setOpen(false)
    setQuery('')
    setResults([])

    // Fetch price for this item + client
    let unitPrice = 0
    try {
      const res = await fetch(
        `/api/sap/price?itemCode=${encodeURIComponent(item.ItemCode)}&cardCode=${encodeURIComponent(cardCode)}&priceList=${priceListNum}`
      )
      const data = (await res.json()) as PriceResult
      unitPrice = data.price
    } catch {
      unitPrice = 0
    }

    onSelectItem({
      itemCode: item.ItemCode,
      itemName: item.ItemName,
      quantity: 1,
      unitPrice,
      uom: item.SalesUoMCode,
      total: unitPrice,
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium text-gray-700">Agregar artículo</label>
        {loading && (
          <span className="text-xs text-gray-400 animate-pulse">Buscando...</span>
        )}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Código o nombre del artículo..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {open && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto">
          {results.map((item) => (
            <li
              key={item.ItemCode}
              onMouseDown={() => handleSelect(item)}
              className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer flex justify-between items-center"
            >
              <span className="font-medium text-gray-900">{item.ItemCode}</span>
              <span className="text-gray-500 ml-2 truncate">{item.ItemName}</span>
              <span className="text-xs text-gray-400 ml-2 shrink-0">{item.SalesUoMCode}</span>
            </li>
          ))}
        </ul>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
          Sin resultados para &quot;{query}&quot;
        </div>
      )}
    </div>
  )
}
