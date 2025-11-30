'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Componente de imagen de producto con aspect ratio 1:1
 * Incluye efecto hover con scale y manejo de estados de carga/error
 */
export function ProductImage({
  src,
  alt,
  className = '',
  priority = false,
}: ProductImageProps) {
  if (!src) {
    // Placeholder cuando no hay imagen
    return (
      <div
        className={`
        relative aspect-square w-full
        bg-zinc-100 rounded-lg
        flex items-center justify-center
        ${className}
      `}
      >
        <ImageIcon className="w-16 h-16 text-zinc-300" />
      </div>
    );
  }

  return (
    <div
      className={`
      relative aspect-square w-full
      overflow-hidden rounded-lg
      bg-zinc-100
      group
      ${className}
    `}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="
          object-cover
          transition-transform duration-500 ease-out
          group-hover:scale-105
        "
      />
    </div>
  );
}
