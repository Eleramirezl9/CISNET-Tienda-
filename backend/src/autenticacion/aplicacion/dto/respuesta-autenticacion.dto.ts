/**
 * DTO: Respuesta de Autenticación
 * Datos retornados después de un login o registro exitoso
 */
export class RespuestaAutenticacionDTO {
  accessToken: string;
  usuario: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  };

  constructor(accessToken: string, usuario: any) {
    this.accessToken = accessToken;
    this.usuario = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
    };
  }
}
