export interface Comunidad {
  id: number;
  via: string;
  direccion: string;
  numero: string;
  codigoPostal: string;
  urbanizacion: string;
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
  apellido2: string;
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

export interface ComunidadHistorico extends Comunidad {
  fechaSupresion: string;
}

export interface PropietarioHistorico extends Propietario {
  fechaSupresion: string;
  motivoBaja: string | null;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
