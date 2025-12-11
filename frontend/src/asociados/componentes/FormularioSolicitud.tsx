'use client';

import { useState } from 'react';
import { asociadosServicio } from '../servicios/asociados.servicio';
import type { CrearSolicitudDto } from '../tipos/asociado.tipos';

interface FormularioSolicitudProps {
  onExito?: () => void;
}

interface ErroresValidacion {
  nombre?: string;
  email?: string;
  telefono?: string;
  mensaje?: string;
}

export function FormularioSolicitud({ onExito }: FormularioSolicitudProps) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    cargo: '',
    mensaje: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [erroresValidacion, setErroresValidacion] = useState<ErroresValidacion>({});
  const [exito, setExito] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    // Limpiar error de validación al escribir
    if (erroresValidacion[name as keyof ErroresValidacion]) {
      setErroresValidacion((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const errores: ErroresValidacion = {};

    if (formulario.nombre.trim().length < 2) {
      errores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formulario.email)) {
      errores.email = 'Ingresa un correo electrónico válido';
    }

    if (formulario.telefono.trim().length < 8) {
      errores.telefono = 'El teléfono debe tener al menos 8 caracteres';
    }

    if (formulario.mensaje.trim().length < 10) {
      errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);

    try {
      // Preparar datos limpiando campos opcionales vacíos
      const datosEnvio: CrearSolicitudDto = {
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        telefono: formulario.telefono.trim(),
        mensaje: formulario.mensaje.trim(),
      };

      // Solo incluir campos opcionales si tienen valor
      if (formulario.empresa.trim()) {
        datosEnvio.empresa = formulario.empresa.trim();
      }
      if (formulario.cargo.trim()) {
        datosEnvio.cargo = formulario.cargo.trim();
      }

      await asociadosServicio.crearSolicitud(datosEnvio);
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
            className={`w-full px-4 py-3 rounded-xl border ${
              erroresValidacion.nombre
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'
            } focus:ring-2 outline-none transition-all duration-200`}
            placeholder="Tu nombre"
          />
          {erroresValidacion.nombre && (
            <p className="mt-1 text-sm text-red-600">{erroresValidacion.nombre}</p>
          )}
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
            className={`w-full px-4 py-3 rounded-xl border ${
              erroresValidacion.email
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'
            } focus:ring-2 outline-none transition-all duration-200`}
            placeholder="correo@ejemplo.com"
          />
          {erroresValidacion.email && (
            <p className="mt-1 text-sm text-red-600">{erroresValidacion.email}</p>
          )}
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
            className={`w-full px-4 py-3 rounded-xl border ${
              erroresValidacion.telefono
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
                : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'
            } focus:ring-2 outline-none transition-all duration-200`}
            placeholder="+502 1234 5678"
          />
          {erroresValidacion.telefono && (
            <p className="mt-1 text-sm text-red-600">{erroresValidacion.telefono}</p>
          )}
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
          Mensaje * <span className="text-zinc-400 font-normal">(mínimo 10 caracteres)</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formulario.mensaje}
          onChange={handleChange}
          required
          rows={4}
          className={`w-full px-4 py-3 rounded-xl border ${
            erroresValidacion.mensaje
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
              : 'border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10'
          } focus:ring-2 outline-none transition-all duration-200 resize-none`}
          placeholder="Cuéntanos por qué te gustaría ser asociado y cómo podríamos colaborar juntos..."
        />
        {erroresValidacion.mensaje && (
          <p className="mt-1 text-sm text-red-600">{erroresValidacion.mensaje}</p>
        )}
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
