/**
 * Enumeración de Permisos del Sistema
 * Define todos los permisos granulares disponibles
 */
export enum PermisoEnum {
  // Productos
  PRODUCTOS_CREAR = 'productos:crear',
  PRODUCTOS_LEER = 'productos:leer',
  PRODUCTOS_ACTUALIZAR = 'productos:actualizar',
  PRODUCTOS_ELIMINAR = 'productos:eliminar',
  PRODUCTOS_GESTIONAR = 'productos:gestionar', // Todos los permisos de productos

  // Usuarios
  USUARIOS_CREAR = 'usuarios:crear',
  USUARIOS_LEER = 'usuarios:leer',
  USUARIOS_ACTUALIZAR = 'usuarios:actualizar',
  USUARIOS_ELIMINAR = 'usuarios:eliminar',
  USUARIOS_GESTIONAR = 'usuarios:gestionar', // Todos los permisos de usuarios

  // Pedidos
  PEDIDOS_CREAR = 'pedidos:crear',
  PEDIDOS_LEER = 'pedidos:leer',
  PEDIDOS_ACTUALIZAR = 'pedidos:actualizar',
  PEDIDOS_ELIMINAR = 'pedidos:eliminar',
  PEDIDOS_GESTIONAR = 'pedidos:gestionar', // Todos los permisos de pedidos

  // Roles y Permisos
  ROLES_CREAR = 'roles:crear',
  ROLES_LEER = 'roles:leer',
  ROLES_ACTUALIZAR = 'roles:actualizar',
  ROLES_ELIMINAR = 'roles:eliminar',
  ROLES_ASIGNAR = 'roles:asignar',
  ROLES_GESTIONAR = 'roles:gestionar', // Todos los permisos de roles

  // Reportes y Estadísticas
  REPORTES_VER = 'reportes:ver',
  ESTADISTICAS_VER = 'estadisticas:ver',

  // Configuración del Sistema
  CONFIGURACION_LEER = 'configuracion:leer',
  CONFIGURACION_ACTUALIZAR = 'configuracion:actualizar',
}

/**
 * Mapeo de permisos por rol
 */
export const PermisosPorRol: Record<string, PermisoEnum[]> = {
  ADMIN: [
    // El admin tiene todos los permisos
    PermisoEnum.PRODUCTOS_GESTIONAR,
    PermisoEnum.PRODUCTOS_CREAR,
    PermisoEnum.PRODUCTOS_LEER,
    PermisoEnum.PRODUCTOS_ACTUALIZAR,
    PermisoEnum.PRODUCTOS_ELIMINAR,

    PermisoEnum.USUARIOS_GESTIONAR,
    PermisoEnum.USUARIOS_CREAR,
    PermisoEnum.USUARIOS_LEER,
    PermisoEnum.USUARIOS_ACTUALIZAR,
    PermisoEnum.USUARIOS_ELIMINAR,

    PermisoEnum.PEDIDOS_GESTIONAR,
    PermisoEnum.PEDIDOS_CREAR,
    PermisoEnum.PEDIDOS_LEER,
    PermisoEnum.PEDIDOS_ACTUALIZAR,
    PermisoEnum.PEDIDOS_ELIMINAR,

    PermisoEnum.ROLES_GESTIONAR,
    PermisoEnum.ROLES_CREAR,
    PermisoEnum.ROLES_LEER,
    PermisoEnum.ROLES_ACTUALIZAR,
    PermisoEnum.ROLES_ELIMINAR,
    PermisoEnum.ROLES_ASIGNAR,

    PermisoEnum.REPORTES_VER,
    PermisoEnum.ESTADISTICAS_VER,

    PermisoEnum.CONFIGURACION_LEER,
    PermisoEnum.CONFIGURACION_ACTUALIZAR,
  ],

  CLIENTE: [
    // El cliente solo puede leer productos y gestionar sus propios pedidos
    PermisoEnum.PRODUCTOS_LEER,
    PermisoEnum.PEDIDOS_CREAR,
    PermisoEnum.PEDIDOS_LEER, // Solo sus propios pedidos
  ],
};

/**
 * Función helper para verificar si un rol tiene un permiso específico
 */
export function tienePermiso(rol: string, permiso: PermisoEnum): boolean {
  const permisos = PermisosPorRol[rol] || [];

  // Si tiene el permiso específico
  if (permisos.includes(permiso)) {
    return true;
  }

  // Si tiene el permiso de gestión del módulo
  const [modulo] = permiso.split(':');
  const permisoGestionar = `${modulo}:gestionar` as PermisoEnum;

  return permisos.includes(permisoGestionar);
}

/**
 * Función helper para obtener todos los permisos de un rol
 */
export function obtenerPermisosPorRol(rol: string): PermisoEnum[] {
  return PermisosPorRol[rol] || [];
}
