import { sapFetch } from './client'
import type { SAPItem } from '@/types/sap'

export async function searchItems(query: string, top = 20): Promise<SAPItem[]> {
  if (!query || query.trim().length < 2) return []
  const q = query.trim().replace(/'/g, "''") // escape single quotes for OData

  // OData v4: contains() — supported on SAP B1 SL 10.x+
  // For SAP B1 9.x (OData v2) replace with: substringof('${q}',ItemName) eq true
  const filter = `(contains(ItemCode,'${q}') or contains(ItemName,'${q}')) and Active eq 'tYES' and SalesItem eq 'tYES'`

  const params = new URLSearchParams({
    $filter: filter,
    $select: 'ItemCode,ItemName,SalesUoMCode',
    $top: String(top),
    $orderby: 'ItemName asc',
  })

  const res = await sapFetch(`/Items?${params.toString()}`)
  if (!res.ok) {
    throw new Error(`SAP items search failed [${res.status}]`)
  }
  const data = (await res.json()) as { value: SAPItem[] }
  return data.value
}
