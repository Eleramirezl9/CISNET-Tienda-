interface TarjetaEstadisticaProps {
  icono: React.ReactNode;
  valor: string;
  etiqueta: string;
  descripcion?: string;
}

export function TarjetaEstadistica({
  icono,
  valor,
  etiqueta,
  descripcion
}: TarjetaEstadisticaProps) {
  return (
    <div className="text-center p-8 bg-gradient-to-br from-white to-zinc-50 rounded-2xl border border-zinc-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 text-white mb-4">
        {icono}
      </div>
      <div className="text-4xl font-bold text-zinc-900 mb-2">
        {valor}
      </div>
      <div className="text-sm font-semibold text-zinc-700 mb-1">
        {etiqueta}
      </div>
      {descripcion && (
        <p className="text-xs text-zinc-500 mt-2">
          {descripcion}
        </p>
      )}
    </div>
  );
}
