'use client';

import { useState } from 'react';
import { asociadosServicio } from '../servicios/asociados.servicio';
import type { CrearSolicitudDto } from '../tipos/asociado.tipos';

interface FormularioSolicitudProps {
  onExito?: () => void;
}

export function FormularioSolicitud({ onExito }: FormularioSolicitudProps) {
  const [formulario, setFormulario] = useState<CrearSolicitudDto>({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    cargo: '',
    mensaje: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      await asociadosServicio.crearSolicitud(formulario);
      setExito(true);
      setFormulario({
        nombre: '',
        email: '',
        telefono: '',
        empresa: '',
        cargo: '',
        mensaje: '',
      });
      onExito?.();
    } catch (err) {
      setError('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Solicitud Enviada</h3>
        <p className="text-zinc-600 max-w-md mx-auto">
          Gracias por tu interés en ser asociado. Nuestro equipo revisará tu solicitud y
          te contactará pronto.
        </p>
        <button
          onClick={() => setExito(false)}
          className="mt-6 px-6 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Nombre completo *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all duration-200"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Correo electrónico *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formulario.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all duration-200"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Teléfono *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formulario.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all duration-200"
            placeholder="+502 1234 5678"
          />
        </div>

        <div>
          <label
            htmlFor="empresa"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            Empresa
          </label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={formulario.empresa}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all duration-200"
            placeholder="Nombre de tu empresa"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cargo" className="block text-sm font-medium text-zinc-700 mb-2">
          Cargo
        </label>
        <input
          type="text"
          id="cargo"
          name="cargo"
          value={formulario.cargo}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all duration-200"
          placeholder="Tu cargo actual"
        />
      </div>

      <div>
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-zinc-700 mb-2"
        >
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formulario.mensaje}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 outline-none transition-all duration-200 resize-none"
          placeholder="Cuéntanos por qué te gustaría ser asociado y cómo podríamos colaborar juntos..."
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="w-full py-4 px-6 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
      >
        {enviando ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            Enviar Solicitud
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
