import { notFound } from 'next/navigation'
import { getBusinessPartner } from '@/lib/sap/companies'
import { OrderForm } from '@/components/OrderForm'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ companyCode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companyCode } = await params
  return { title: `Pedido — ${companyCode.toUpperCase()}` }
}

export default async function OrderPage({ params }: Props) {
  const { companyCode } = await params

  let company
  try {
    company = await getBusinessPartner(companyCode.toUpperCase())
  } catch {
    notFound()
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'Sistema de Pedidos'
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {companyName && (
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{companyName}</p>
            )}
            <h1 className="text-lg font-bold text-gray-900">{appName}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Client info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">
              {company.cardName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{company.cardName}</p>
            <p className="text-sm text-gray-500">{company.cardCode}</p>
          </div>
        </div>

        <OrderForm company={company} />
      </main>
    </div>
  )
}
