/**
 * Skeleton de carga para tarjetas de asociados
 */

export function SkeletonAsociado() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 animate-pulse">
      {/* Foto skeleton */}
      <div className="aspect-square bg-zinc-200" />

      {/* Info skeleton */}
      <div className="p-6 space-y-3">
        <div className="h-5 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
        <div className="h-4 bg-zinc-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonAsociadosGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonAsociado key={i} />
      ))}
    </div>
  );
}
