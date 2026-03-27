export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {process.env.NEXT_PUBLIC_APP_NAME ?? 'Sistema de Pedidos'}
        </h1>
        <p className="text-gray-500 text-sm">
          Accede a través del enlace que te compartió tu asesor comercial.
        </p>
      </div>
    </div>
  )
}
