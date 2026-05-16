import { sapFetch } from './client'
import type { SAPBusinessPartner, CompanyInfo } from '@/types/sap'

export async function getBusinessPartner(cardCode: string): Promise<CompanyInfo> {
  const encoded = encodeURIComponent(`'${cardCode}'`)
  const res = await sapFetch(
    `/BusinessPartners(${encoded})?$select=CardCode,CardName,EmailAddress,PriceListNum,Currency,FederalTaxID`
  )
  if (res.status === 404) {
    throw new Error(`Company not found: ${cardCode}`)
  }
  if (!res.ok) {
    throw new Error(`SAP error [${res.status}] fetching company ${cardCode}`)
  }
  const bp = (await res.json()) as SAPBusinessPartner
  return {
    cardCode: bp.CardCode,
    cardName: bp.CardName,
    email: bp.EmailAddress,
    priceListNum: bp.PriceListNum ?? 1,
    currency: bp.Currency ?? 'COP',
  }
}
