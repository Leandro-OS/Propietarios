export interface Comunidad {
  id: number;
  via: string;
  direccion: string;
  numero: string;
  codigoPostal: string;
  urbanizacion: string | null;
  poblacion: string;
  numPisos: number;
  numViviendas: number;
  numLocales: number;
  numSotanos: number;
  numParkings: number;
  numTrasteros: number;
  createdAt: string;
  updatedAt: string;
  numActualizaciones: number;
  propietarios?: Propietario[];
}

export interface Propietario {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string | null;
  tipoPropiedad: string;
  numPropiedad: number | null;
  pisoPropiedad: number | null;
  tipo: string;
  residente: string | null;
  tieneTrastero: boolean;
  numTrastero: number | null;
  lugarTrastero: number | null;
  tieneParking: boolean;
  numParking: number | null;
  lugarParking: number | null;
  comunidadId: number;
  createdAt: string;
  updatedAt: string;
  numActualizaciones: number;
  descripcionPropiedad: string | null;
}

export interface ComunidadHistorico {
  id: number;
  via: string;
  direccion: string;
  numero: string;
  codigoPostal: string;
  urbanizacion: string | null;
  poblacion: string;
  numPisos: number;
  numViviendas: number;
  numLocales: number;
  numSotanos: number;
  numParkings: number;
  numTrasteros: number;
  createdAt: string;
  updatedAt: string;
  fechaSupresion: string;
  motivo: string | null;
  propietarios?: PropietarioHistorico[];
}

export interface PropietarioHistorico {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string | null;
  tipoPropiedad: string;
  numPropiedad: number | null;
  pisoPropiedad: number | null;
  tipo: string;
  residente: string | null;
  tieneTrastero: boolean;
  numTrastero: number | null;
  lugarTrastero: number | null;
  tieneParking: boolean;
  numParking: number | null;
  lugarParking: number | null;
  comunidadId: number;
  createdAt: string;
  updatedAt: string;
  fechaSupresion: string;
  motivo: string | null;
  descripcionPropiedad: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==================== INCIDENCIAS ====================

export const TIPOS_INCIDENCIA = ['Mantenimiento', 'Desperfecto', 'Catastrofe'] as const;

export const SUBTIPOS_MANTENIMIENTO = ['Electrico', 'Fontaneria', 'Desague', 'Ventilacion', 'Ext. Incendio', 'Det. Incendio', 'Basuras', 'Teleco', 'Ascensores'] as const;
export const SUBTIPOS_DESPERFECTO = ['Funcionales', 'Esteticos', 'Seguridad'] as const;
export const SUBTIPOS_CATASTROFE = ['Meteorologica', 'Externa', 'Interna'] as const;

export const ESTADOS_INCIDENCIA = ['Registrada', 'Abierta', 'En proceso', 'En ejecucion', 'Bloqueada', 'Resuelta', 'Cerrada'] as const;

export interface IncidenciaComunidadTitulo {
  idIncidencia: number;
  idCom: number;
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  fechaCierre: string | null;
}

export interface IncidenciaComunidadRegistros {
  idIncComReg: number;
  idIncCom: number;
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string;
  fechaCreacion: string;
}

export interface ComunidadIncidenciaCount {
  id: number;
  comunidad: string;
  poblacion: string;
  activas: number;
  bloqueadas: number;
  cerradas: number;
}

export interface IncidenciaPropietarioTitulo {
  idIncidencia: number;
  idPro: number;
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string | null;
  fechaCreacion: string;
  fechaModificacion: string | null;
  fechaCierre: string | null;
}

export interface PropietarioIncidenciaCount {
  id: number;
  nombre: string;
  comunidad: string;
  activas: number;
  bloqueadas: number;
  cerradas: number;
}
