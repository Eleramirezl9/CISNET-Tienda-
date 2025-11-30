/**
 * Adaptador: Cloudinary
 * Implementación del servicio de almacenamiento usando Cloudinary
 */
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { IServicioAlmacenamiento } from '../../puertos/servicio-almacenamiento.port';

@Injectable()
export class CloudinaryServicio implements IServicioAlmacenamiento {
  constructor(private configService: ConfigService) {
    // Configurar Cloudinary con las credenciales
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Sube una imagen a Cloudinary usando upload_stream
   * Esto es necesario para despliegue serverless (Render, Vercel, etc.)
   */
  async subirImagen(
    archivo: Express.Multer.File,
    carpeta: string = 'productos',
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `tienda/${carpeta}`, // Organizar por carpetas
          resource_type: 'image',
          transformation: [
            {
              width: 1000,
              height: 1000,
              crop: 'limit', // No recortar, solo limitar tamaño
              quality: 'auto:good', // Optimización automática
              fetch_format: 'auto', // Formato automático (webp si es compatible)
            },
          ],
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            return reject(
              new BadRequestException(
                `Error al subir imagen a Cloudinary: ${error.message}`,
              ),
            );
          }

          // Devolver la URL segura de la imagen
          resolve(result.secure_url);
        },
      );

      // Convertir el buffer a stream y subirlo
      streamifier.createReadStream(archivo.buffer).pipe(uploadStream);
    });
  }

  /**
   * Elimina una imagen de Cloudinary
   */
  async eliminarImagen(idPublico: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(idPublico);
    } catch (error) {
      throw new BadRequestException(
        `Error al eliminar imagen de Cloudinary: ${error.message}`,
      );
    }
  }

  /**
   * Extrae el ID público de una URL de Cloudinary
   * Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234/tienda/productos/abc123.jpg
   * Resultado: tienda/productos/abc123
   */
  extraerIdPublico(url: string): string {
    try {
      // Extraer la parte después de /upload/
      const parts = url.split('/upload/');
      if (parts.length < 2) {
        throw new Error('URL de Cloudinary inválida');
      }

      // Tomar todo después de /upload/vXXXX/
      const pathWithVersion = parts[1];

      // Remover la versión (vXXXX/)
      const pathParts = pathWithVersion.split('/');
      const pathWithoutVersion = pathParts.slice(1).join('/');

      // Remover la extensión (.jpg, .png, etc.)
      const pathWithoutExtension = pathWithoutVersion.replace(/\.[^.]+$/, '');

      return pathWithoutExtension;
    } catch (error) {
      throw new BadRequestException(
        `Error al extraer ID público de Cloudinary: ${error.message}`,
      );
    }
  }
}
