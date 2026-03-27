import { sapFetch } from './client'
import type { SAPSpecialPrice, SAPItemPrice, PriceResult } from '@/types/sap'

export async function getItemPrice(
  itemCode: string,
  cardCode: string,
  priceListNum: number,
  quantity?: number
): Promise<PriceResult> {
  // 1. Try special price for this client + item
  try {
    const spFilter = `CardCode eq '${cardCode}' and ItemCode eq '${itemCode}'`
    const spRes = await sapFetch(
      `/SpecialPrices?$filter=${encodeURIComponent(spFilter)}&$top=1`
    )
    if (spRes.ok) {
      const spData = (await spRes.json()) as { value: any[] }
      if (spData.value.length > 0) {
        const sp = spData.value[0]
        let finalPrice = sp.Price
        const currency = sp.Currency

        // Handle quantity scales if provided
        if (quantity !== undefined && sp.SpecialPriceDataAreas) {
          const now = new Date()
          // Find valid data areas by date
          const validAreas = sp.SpecialPriceDataAreas.filter((area: any) => {
            const from = area.DateFrom ? new Date(area.DateFrom) : null
            const to = area.Dateto ? new Date(area.Dateto) : null
            return (!from || now >= from) && (!to || now <= to)
          })

          // Search in quantity areas
          let bestPrice = -1
          let maxQty = -1

          for (const area of validAreas) {
            if (area.SpecialPriceQuantityAreas) {
              for (const qArea of area.SpecialPriceQuantityAreas) {
                if (quantity >= qArea.Quantity && qArea.Quantity > maxQty) {
                  maxQty = qArea.Quantity
                  bestPrice = qArea.SpecialPrice
                }
              }
            }
          }

          if (bestPrice !== -1) {
            finalPrice = bestPrice
          }
        }

        if (finalPrice > 0) {
          return {
            price: finalPrice,
            currency: currency,
            source: 'special',
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching special prices:', error)
  }

  // 2. Fall back to the client's assigned price list
  const plFilter = `ItemCode eq '${itemCode}' and PriceList eq ${priceListNum}`
  const plRes = await sapFetch(
    `/ItemPrices?$filter=${encodeURIComponent(plFilter)}&$select=Price,Currency&$top=1`
  )
  if (plRes.ok) {
    const plData = (await plRes.json()) as { value: SAPItemPrice[] }
    if (plData.value.length > 0 && plData.value[0].Price > 0) {
      return {
        price: plData.value[0].Price,
        currency: plData.value[0].Currency,
        source: 'pricelist',
      }
    }
  }

  return { price: 0, currency: 'COP', source: 'notfound' }
}
