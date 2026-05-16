import { sapFetch } from './client'
import type { SAPItem } from '@/types/sap'

export async function searchItems(query: string, top = 20): Promise<SAPItem[]> {
  const q = query.trim().replace(/'/g, "''") // escape single quotes for OData
  
  let filter = "Valid eq 'tYES' and SalesItem eq 'tYES'"
  if (q.length > 0) {
    filter += ` and (contains(ItemCode,'${q}') or contains(ItemName,'${q}') or contains(SupplierCatalogNo,'${q}'))`
  }

  const topParam = q.length === 0 ? 100 : top
  const select = 'ItemCode,ItemName,SalesUnit,SupplierCatalogNo'
  const orderby = 'ItemName asc'
  
  const queryString = `$filter=${encodeURIComponent(filter)}&$select=${encodeURIComponent(select)}&$top=${topParam}`
  const res = await sapFetch(`/Items?${queryString}`)
  if (!res.ok) {
    throw new Error(`SAP items search failed [${res.status}]`)
  }
  const data = (await res.json()) as { value: SAPItem[] }
  return data.value
}
