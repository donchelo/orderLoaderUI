// SAP B1 Service Layer raw types
export interface SAPBusinessPartner {
  CardCode: string
  CardName: string
  EmailAddress: string
  Phone1?: string
  PriceListNum: number
  Currency?: string
  FederalTaxID?: string
}

export interface SAPItem {
  ItemCode: string
  ItemName: string
  SalesUnit: string
  Valid: 'tYES' | 'tNO'
  SupplierCatalogNo: string
}

export interface SAPItemPrice {
  ItemCode: string
  PriceList: number
  Price: number
  Currency: string
}

export interface SAPSpecialPrice {
  CardCode: string
  ItemCode: string
  Price: number
  Currency: string
  PriceListNum: number
  DiscountPercent?: number
}

export interface SAPOrderLine {
  ItemCode: string
  ItemDescription: string
  Quantity: number
  UnitPrice: number
  ShipDate: string
  WarehouseCode: string
}

export interface SAPOrder {
  CardCode: string
  DocDate: string
  DocDueDate: string
  Comments?: string
  DocumentLines: SAPOrderLine[]
}

export interface SAPOrderResponse {
  DocEntry: number
  DocNum: number
  CardCode: string
  DocDate: string
  DocTotal: number
}

// App-level types
export interface CompanyInfo {
  cardCode: string
  cardName: string
  email: string
  priceListNum: number
  currency: string
}

export interface OrderLineItem {
  itemCode: string
  itemName: string
  quantity: number
  unitPrice: number
  uom: string
  deliveryDate: string
  total: number
}

export interface OrderFormData {
  signedBy: string
  comments: string
}

export interface PriceResult {
  price: number
  currency: string
  source: 'special' | 'pricelist' | 'notfound'
}

export interface SubmitOrderPayload {
  company: CompanyInfo
  lines: OrderLineItem[]
  formData: OrderFormData
}

export interface SubmitOrderResult {
  success: boolean
  docNum: number
  docEntry: number
  docTotal: number
}
