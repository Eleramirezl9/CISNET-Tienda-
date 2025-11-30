/**
 * Puerto: Servicio de Almacenamiento de Imágenes
 *
 * Define el contrato para cualquier proveedor de almacenamiento
 * (Cloudinary, AWS S3, Google Cloud Storage, etc.)
 */

/**
 * Token de inyección de dependencias
 */
export const SERVICIO_ALMACENAMIENTO = Symbol('SERVICIO_ALMACENAMIENTO');

/**
 * Interfaz del servicio de almacenamiento
 */
export interface IServicioAlmacenamiento {
  /**
   * Sube una imagen al servicio de almacenamiento
   *
   * @param archivo - Archivo de imagen (buffer en memoria)
   * @param carpeta - Carpeta opcional donde guardar la imagen (ej: 'productos', 'usuarios')
   * @returns URL pública de la imagen subida
   */
  subirImagen(
    archivo: Express.Multer.File,
    carpeta?: string,
  ): Promise<string>;

  /**
   * Elimina una imagen del servicio de almacenamiento
   *
   * @param idPublico - ID público de la imagen (sin extensión)
   * @returns void
   */
  eliminarImagen(idPublico: string): Promise<void>;

  /**
   * Extrae el ID público de Cloudinary desde una URL
   *
   * @param url - URL completa de la imagen
   * @returns ID público (ej: 'productos/abc123')
   */
  extraerIdPublico(url: string): string;
}
