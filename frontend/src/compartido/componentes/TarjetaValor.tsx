interface TarjetaValorProps {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}

export function TarjetaValor({ icono, titulo, descripcion }: TarjetaValorProps) {
  return (
    <div className="group p-8 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300">
      <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
        {icono}
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-3">
        {titulo}
      </h3>
      <p className="text-zinc-600 leading-relaxed">
        {descripcion}
      </p>
    </div>
  );
}
