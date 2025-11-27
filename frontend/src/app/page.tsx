import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🛍️ Tienda E-commerce
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Arquitectura Enterprise-Grade
          </p>
          
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ✅ Proyecto Configurado Correctamente
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Frontend</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Next.js 14 (App Router)</li>
                  <li>✓ TypeScript 5+</li>
                  <li>✓ Tailwind CSS</li>
                  <li>✓ Zustand (Estado Global)</li>
                  <li>✓ TanStack Query</li>
                  <li>✓ React Hook Form + Zod</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Arquitectura</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ DDD (Domain-Driven Design)</li>
                  <li>✓ Feature Sliced Design</li>
                  <li>✓ Atomic Design</li>
                  <li>✓ Clean Architecture</li>
                  <li>✓ Server Actions</li>
                  <li>✓ Tipado Estricto</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📁 Estructura del Proyecto
              </h3>
              <pre className="text-sm text-left text-gray-700 overflow-x-auto">
{`src/
├── app/                    # Next.js App Router
├── caracteristicas/        # Feature Sliced Design
│   ├── catalogo-productos/ # ✅ Configurado
│   │   ├── dominio/        # Tipos (Zod)
│   │   ├── infraestructura/# Server Actions
│   │   ├── aplicacion/     # Hooks
│   │   └── ui/             # Componentes
│   └── carrito-compras/    # ✅ Configurado
│       ├── dominio/
│       ├── aplicacion/     # Zustand Store
│       └── ui/
├── compartido/             # Shared Kernel
│   ├── ui/                 # Componentes base
│   ├── lib/                # Utilidades
│   └── tipos/              # Tipos globales
└── design/                 # Design Tokens
    └── tokens/`}
              </pre>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                🚀 Próximos Pasos
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-left text-gray-700">
                <li>Instalar dependencias: <code className="bg-gray-100 px-2 py-1 rounded">npm install</code></li>
                <li>Configurar variables de entorno en <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code></li>
                <li>Iniciar el servidor de desarrollo: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
                <li>Crear el backend con NestJS (próximo paso)</li>
                <li>Integrar Shadcn/UI components</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
