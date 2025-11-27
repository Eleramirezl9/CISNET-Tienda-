import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-2 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-zinc-600 font-light">
            Accede a tu cuenta de CISNET
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="tu@ejemplo.com"
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-900 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-600 font-light">
            ¿No tienes cuenta?{' '}
            <Link href="#" className="text-zinc-900 font-medium hover:underline">
              Crear una
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
