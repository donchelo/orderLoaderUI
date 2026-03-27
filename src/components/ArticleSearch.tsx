'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [isSelecting, setIsSelecting] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [addedItemCode, setAddedItemCode] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const fetchArticles = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/sap/articles?q=${encodeURIComponent(q)}`)
      const data = (await res.json()) as { items: SAPItem[] }
      const items = data.items ?? []
      setResults(items)
      setSelectedIndex(0)
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const toggleDropdown = () => {
    if (open) {
      setOpen(false)
    } else {
      fetchArticles(query)
    }
  }

  const handleChange = (val: string) => {
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (val.length >= 2 || val.length === 0) {
      debounceRef.current = setTimeout(() => fetchArticles(val), 300)
    } else {
      setResults([])
      setOpen(false)
    }
  }

  const handleSelect = async (item: SAPItem) => {
    if (!item) return
    setOpen(false)
    setQuery('')
    setResults([])
    setIsSelecting(true)

    // Visual feedback
    setAddedItemCode(item.ItemCode)
    setTimeout(() => setAddedItemCode(null), 2000)

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
    } finally {
      setIsSelecting(false)
    }

    onSelectItem({
      itemCode: item.ItemCode,
      itemName: item.ItemName,
      quantity: 1,
      unitPrice,
      uom: item.SalesUnit,
      deliveryDate: new Date().toISOString().split('T')[0],
      total: unitPrice,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (results.length > 0) setOpen(true)
        else fetchArticles(query)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (results.length > 0) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  // Prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (open && listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex, open])

  if (!isMounted) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-gray-700">Agregar artículo</label>
        </div>
        <div className="relative group">
          <div className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 animate-pulse h-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-semibold text-gray-700">Agregar artículo</label>
        {addedItemCode && (
          <span className="text-xs font-medium text-green-600 animate-bounce">
            ¡Artículo añadido!
          </span>
        )}
        {isSelecting && (
          <span className="text-xs text-blue-500 animate-pulse font-bold">Agregando artículo...</span>
        )}
        {loading && !isSelecting && (
          <span className="text-xs text-blue-500 animate-pulse font-medium">Sincronizando con SAP...</span>
        )}
      </div>
      <div className="relative group">
        <input
          type="text"
          value={query}
          disabled={isSelecting}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onFocus={() => {
            if (results.length === 0) fetchArticles(query)
            else setOpen(true)
          }}
          placeholder={isSelecting ? "Agregando artículo..." : "Busque por código, nombre o catálogo..."}
          className={`w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent group-hover:border-gray-400 ${
            isSelecting ? 'bg-gray-50' : ''
          }`}
        />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            toggleDropdown()
          }}
          className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180 text-blue-500' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {open && (
        <ul 
          ref={listRef}
          className="absolute z-20 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-auto py-1 ring-1 ring-black/5"
        >
          {loading && results.length === 0 ? (
            <div className="px-4 py-8 text-sm text-blue-500 text-center animate-pulse font-medium">
              Consultando artículos en tiempo real...
            </div>
          ) : results.length > 0 ? (
            results.map((item, index) => (
              <li
                key={item.ItemCode}
                onMouseDown={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-4 py-3 text-sm cursor-pointer flex flex-col gap-1 transition-colors ${
                  index === selectedIndex ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`font-bold text-xs uppercase tracking-wider ${
                    index === selectedIndex ? 'text-blue-100' : 'text-blue-600'
                  }`}>
                    {item.ItemCode}
                  </span>
                  {item.SupplierCatalogNo && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                      index === selectedIndex 
                        ? 'bg-blue-500 border-blue-400 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}>
                      SAP Ref: {item.SupplierCatalogNo}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className={`font-medium truncate flex-1 ${
                    index === selectedIndex ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.ItemName}
                  </span>
                  <span className={`text-[10px] ml-3 uppercase font-bold px-1.5 rounded border ${
                    index === selectedIndex 
                      ? 'border-blue-400 text-blue-100 shadow-sm' 
                      : 'border-gray-100 text-gray-400 bg-gray-50'
                  }`}>
                    {item.SalesUnit}
                  </span>
                </div>
              </li>
            ))
          ) : query.length >= 2 ? (
            <div className="px-4 py-8 text-sm text-gray-500 text-center">
              <div className="text-gray-300 mb-2">
                <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              No encontramos &quot;<span className="font-semibold text-gray-700">{query}</span>&quot;
            </div>
          ) : !loading && (
            <div className="px-4 py-8 text-sm text-gray-400 text-center italic">
              Empiece a escribir para filtrar la lista...
            </div>
          )}
        </ul>
      )}
    </div>
  )
}
