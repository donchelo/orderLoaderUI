import { sapFetch } from './client'
import type { SAPOrder, SAPOrderResponse } from '@/types/sap'

export async function createSalesOrder(order: SAPOrder): Promise<SAPOrderResponse> {
  const res = await sapFetch('/Orders', {
    method: 'POST',
    body: JSON.stringify(order),
  })
  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`SAP order creation failed [${res.status}]: ${errBody}`)
  }
  return (await res.json()) as SAPOrderResponse
}
