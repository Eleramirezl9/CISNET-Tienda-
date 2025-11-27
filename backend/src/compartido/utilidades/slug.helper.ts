/**
 * UTILIDAD COMPARTIDA - Generador de Slugs
 * 
 * Genera slugs únicos para URLs amigables
 * Usado por: Productos, Categorías, Blog posts, etc.
 */

export class SlugHelper {
  /**
   * Genera un slug a partir de un texto
   * 
   * @example
   * generarSlug('Laptop Dell XPS 15') → 'laptop-dell-xps-15'
   * generarSlug('¡Oferta! 20% OFF') → 'oferta-20-off'
   */
  static generar(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')                    // Normalizar caracteres
      .replace(/[\u0300-\u036f]/g, '')     // Eliminar acentos
      .replace(/[^\w\s-]/g, '')            // Eliminar caracteres especiales
      .replace(/\s+/g, '-')                // Espacios → guiones
      .replace(/--+/g, '-')                // Múltiples guiones → uno solo
      .replace(/^-+/, '')                  // Eliminar guión inicial
      .replace(/-+$/, '')                  // Eliminar guión final
      .trim();
  }

  /**
   * Genera un slug único agregando un sufijo numérico
   * 
   * @example
   * generarUnico('laptop-dell', 1) → 'laptop-dell-1'
   */
  static generarUnico(slugBase: string, numero: number): string {
    return `${slugBase}-${numero}`;
  }

  /**
   * Valida si un slug tiene el formato correcto
   */
  static esValido(slug: string): boolean {
    const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return regex.test(slug);
  }
}
