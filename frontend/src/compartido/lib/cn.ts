/**
 * Utilidad para combinar clases de Tailwind
 * Usa clsx para condicionales y tailwind-merge para evitar conflictos
 */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
