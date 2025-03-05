// Base URL
export const Servidor = 'http://localhost:3000';

// Usuario endpoints
export const UsuarioIniciarSesion = '/api/users/login';
export const ActualizarContrasena = `/api/users/updatePassword/{id}`;
export const ListarUsuarios = '/api/users/user';
export const ActualizarUsuario = '/api/users/updateUser/{id}';
export const CrearUsuario = '/api/users/register';

// Equipos endpoints
export const GuardarEquipo = '/api/equipment/create';
export const ListarEquipos = '/api/equipment/equipments';
export const ObtenerEquipoById = '/api/equipment/equipments';
export const ActualizarEquipo = '/api/equipment/updateEquipment';
export const EliminarEquipo = '/api/equipment/deleteEquipment';

// Mantenimiento endpoints
export const GuardarMantenimiento = '/api/maintenance/create';
export const ListarMantenimientos = '/api/maintenance/maintenances';
export const ObtenerMantenimientoById = '/api/maintenance/maintenance/{id}';
export const ActualizarMantenimiento = '/api/maintenance/updateMaintenance/{id}';
export const EliminarMantenimiento = '/api/maintenance/deleteMaintenance/{id_mantenimiento}';
