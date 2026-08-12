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
  numPropiedad: number;
  pisoPropiedad: number;
  tipo: string;
  pertenece: string;
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
  numPropiedad: number;
  pisoPropiedad: number;
  tipo: string;
  pertenece: string;
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
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
