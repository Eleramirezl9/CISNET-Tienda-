'use client';

import Image from 'next/image';
import type { Asociado } from '../tipos/asociado.tipos';

interface TarjetaAsociadoProps {
  asociado: Asociado;
}

export function TarjetaAsociado({ asociado }: TarjetaAsociadoProps) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-zinc-100">
      {/* Foto */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {asociado.foto ? (
          <Image
            src={asociado.foto}
            alt={asociado.nombre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300">
            <svg
              className="w-20 h-20 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
        )}

        {/* Overlay con redes sociales */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <div className="flex gap-3">
            {asociado.linkedin && (
              <a
                href={asociado.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-all duration-300"
                aria-label={`LinkedIn de ${asociado.nombre}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {asociado.twitter && (
              <a
                href={asociado.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-all duration-300"
                aria-label={`Twitter de ${asociado.nombre}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {asociado.sitioWeb && (
              <a
                href={asociado.sitioWeb}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-zinc-900 transition-all duration-300"
                aria-label={`Sitio web de ${asociado.nombre}`}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Badge destacado */}
        {asociado.destacado && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Destacado
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
          {asociado.nombre}
        </h3>
        <p className="text-sm text-zinc-500 font-medium mb-2">{asociado.cargo}</p>
        {asociado.empresa && <p className="text-sm text-zinc-400">{asociado.empresa}</p>}
        {asociado.descripcion && (
          <p className="text-sm text-zinc-600 mt-3 line-clamp-2">{asociado.descripcion}</p>
        )}
      </div>
    </div>
  );
}
