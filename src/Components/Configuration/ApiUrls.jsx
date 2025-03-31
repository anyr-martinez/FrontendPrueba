// Base URL
export const Servidor = 'http://localhost:3000';

// Usuario endpoints
export const UsuarioIniciarSesion = '/api/users/login';
export const UsuarioActualizarContrasena = `/api/users/updatePassword`;
export const UsuarioExistente = '/api/users/users/{usuario}';
export const ListarUsuarios = '/api/users/user';
export const ActualizarUsuario = '/api/users/updateUser';
export const CrearUsuario = '/api/users/register';
export const EliminarUsuario = '/api/users/deleteUser';

// Equipos endpoints
export const GuardarEquipo = '/api/equipment/create';
export const ListarEquiposActivos = '/api/equipment/equipments/active';
export const ListarEquipos = '/api/equipment/equipments';
export const ObtenerEquipoById = '/api/equipment/equipments';
export const ActualizarEquipo = '/api/equipment/updateEquipment';
export const EliminarEquipo = '/api/equipment/deleteEquipment';
export const ReporteEquipos =  '/api/equipment/reporte';
export const ReporteEquiposTerminados =  '/api/equipment/reporte/inactivos'

// Mantenimiento endpoints
export const GuardarMantenimiento = '/api/maintenance/create';
export const ListarMantenimientos = '/api/maintenance/maintenances';
export const ObtenerMantenimientoById = '/api/maintenance/maintenances';
export const ObtenerEstadoMantenimiento = '/api/maintenance/maintenance/status';
export const ActualizarMantenimiento = '/api/maintenance/updateMaintenance';
export const EliminarMantenimiento = '/api/maintenance/deleteMaintenance';
export const ReporteMantenimientoFecha = '/api/maintenance/report/date';
export const ReporteMantenimientoTipo = '/api/maintenance/report/type';
export const ReporteMantenimientoGeneral = '/api/maintenance/report';

