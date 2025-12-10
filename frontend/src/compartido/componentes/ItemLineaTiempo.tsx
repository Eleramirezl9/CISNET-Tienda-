interface ItemLineaTiempoProps {
  ano: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  esUltimo?: boolean;
}

export function ItemLineaTiempo({
  ano,
  titulo,
  descripcion,
  icono,
  esUltimo = false
}: ItemLineaTiempoProps) {
  return (
    <div className="relative flex gap-8 pb-12">
      {/* Línea vertical */}
      {!esUltimo && (
        <div className="absolute left-7 top-14 w-0.5 h-full bg-zinc-200" />
      )}

      {/* Icono */}
      <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow-lg">
        {icono}
      </div>

      {/* Contenido */}
      <div className="flex-1 pt-2">
        <div className="inline-block px-3 py-1 bg-zinc-100 rounded-full text-sm font-semibold text-zinc-700 mb-3">
          {ano}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          {titulo}
        </h3>
        <p className="text-zinc-600 leading-relaxed">
          {descripcion}
        </p>
      </div>
    </div>
  );
}
