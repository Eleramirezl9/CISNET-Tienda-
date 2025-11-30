'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, X, Upload, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string; // URL de imagen existente
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Crear preview local
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative
          border-2 border-dashed rounded-lg
          transition-all duration-200
          cursor-pointer
          ${
            isDragActive
              ? 'border-zinc-900 bg-zinc-50'
              : 'border-zinc-300 bg-zinc-50/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-zinc-400'}
          ${preview ? 'p-0' : 'p-12'}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          // Vista previa de la imagen
          <div className="relative aspect-square w-full group">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {/* Botón para eliminar */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full
                         opacity-0 group-hover:opacity-100 transition-opacity
                         hover:bg-red-600 shadow-lg z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {/* Overlay al hacer hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                          transition-colors rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-12 h-12 text-white" />
                <p className="text-white text-sm font-medium mt-2">
                  Cambiar imagen
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Estado vacío - zona de drop
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className={`
              p-4 rounded-full mb-4 transition-colors
              ${
                isDragActive
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-200 text-zinc-600'
              }
            `}
            >
              {isDragActive ? (
                <Cloud className="w-8 h-8" />
              ) : (
                <ImageIcon className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-lg font-medium text-zinc-900 mb-1">
              {isDragActive
                ? 'Suelta la imagen aquí'
                : 'Arrastra tu imagen aquí'}
            </h3>
            <p className="text-sm text-zinc-500 mb-4">
              o haz clic para seleccionar
            </p>

            <div className="text-xs text-zinc-400 space-y-1">
              <p>JPG, PNG o WEBP</p>
              <p>Tamaño máximo: 5MB</p>
              <p>Recomendado: 1000x1000px</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
