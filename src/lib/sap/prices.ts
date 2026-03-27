import { sapFetch } from './client'
import type { SAPSpecialPrice, SAPItemPrice, PriceResult } from '@/types/sap'

export async function getItemPrice(
  itemCode: string,
  cardCode: string,
  priceListNum: number
): Promise<PriceResult> {
  // 1. Try special price for this client + item
  try {
    const spFilter = `CardCode eq '${cardCode}' and ItemCode eq '${itemCode}'`
    const spRes = await sapFetch(
      `/SpecialPrices?$filter=${encodeURIComponent(spFilter)}&$select=Price,Currency,PriceListNum&$top=1`
    )
    if (spRes.ok) {
      const spData = (await spRes.json()) as { value: SAPSpecialPrice[] }
      if (spData.value.length > 0 && spData.value[0].Price > 0) {
        return {
          price: spData.value[0].Price,
          currency: spData.value[0].Currency,
          source: 'special',
        }
      }
    }
  } catch {
    // SpecialPrices endpoint may not exist on all SL versions — fall through
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
