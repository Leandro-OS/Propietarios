import type { Comunidad, Propietario, ComunidadHistorico, PropietarioHistorico, PaginationInfo, ComunidadIncidenciaCount, IncidenciaComunidadTitulo, PropietarioIncidenciaCount, IncidenciaPropietarioTitulo } from '../types';

const API_BASE = '/api';

// Comunidades
export const getComunidades = async (page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/comunidades?page=${page}&limit=${limit}`);
  return res.json() as Promise<{ comunidades: Comunidad[]; pagination: PaginationInfo }>;
};

export const getComunidadById = async (id: number) => {
  const res = await fetch(`${API_BASE}/comunidades/${id}`);
  return res.json() as Promise<Comunidad>;
};

export const getComunidadWithPropietarios = async (id: number) => {
  const res = await fetch(`${API_BASE}/comunidades/${id}/detalles`);
  return res.json() as Promise<Comunidad>;
};

export const createComunidad = async (data: Partial<Comunidad>) => {
  const res = await fetch(`${API_BASE}/comunidades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<Comunidad>;
};

export const updateComunidad = async (id: number, data: Partial<Comunidad>) => {
  const res = await fetch(`${API_BASE}/comunidades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<Comunidad>;
};

export const deleteComunidad = async (id: number, motivo?: string) => {
  const res = await fetch(`${API_BASE}/comunidades/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivo })
  });
  return res.json();
};

// Propietarios
export const getPropietariosByComunidad = async (comunidadId: number) => {
  const res = await fetch(`${API_BASE}/propietarios/comunidad/${comunidadId}`);
  return res.json() as Promise<Propietario[]>;
};

export const getPropietariosByComunidadOrdered = async (comunidadId: number) => {
  const res = await fetch(`${API_BASE}/propietarios/comunidad/${comunidadId}/ordenados`);
  return res.json() as Promise<Propietario[]>;
};

export const getPropietarioById = async (id: number) => {
  const res = await fetch(`${API_BASE}/propietarios/${id}`);
  return res.json() as Promise<Propietario>;
};

export const createPropietario = async (data: Partial<Propietario>) => {
  const res = await fetch(`${API_BASE}/propietarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<Propietario>;
};

export const updatePropietario = async (id: number, data: Partial<Propietario>) => {
  const res = await fetch(`${API_BASE}/propietarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<Propietario>;
};

export const deletePropietario = async (id: number, motivoBaja?: string) => {
  const res = await fetch(`${API_BASE}/propietarios/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivoBaja })
  });
  return res.json();
};

// Historicos
export const getComunidadesHistoricas = async (page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/historicos/comunidades?page=${page}&limit=${limit}`);
  return res.json() as Promise<{ comunidades: ComunidadHistorico[]; pagination: PaginationInfo }>;
};

export const getComunidadHistoricaById = async (id: number) => {
  const res = await fetch(`${API_BASE}/historicos/comunidades/${id}`);
  return res.json() as Promise<ComunidadHistorico>;
};

export const getPropietariosHistoricosByComunidad = async (comunidadId: number) => {
  const res = await fetch(`${API_BASE}/historicos/propietarios/comunidad/${comunidadId}`);
  return res.json() as Promise<PropietarioHistorico[]>;
};

export const getPropietarioHistoricoById = async (id: number) => {
  const res = await fetch(`${API_BASE}/historicos/propietarios/${id}`);
  return res.json() as Promise<PropietarioHistorico>;
};

// Busqueda
export const buscarComunidades = async (texto: string, page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/busqueda/comunidades?texto=${encodeURIComponent(texto)}&page=${page}&limit=${limit}`);
  return res.json() as Promise<{ comunidades: Comunidad[]; pagination: PaginationInfo }>;
};

export const buscarPropietarios = async (texto: string, page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/busqueda/propietarios?texto=${encodeURIComponent(texto)}&page=${page}&limit=${limit}`);
  return res.json() as Promise<{ propietarios: Propietario[]; pagination: PaginationInfo }>;
};

export const checkPropietarioAvailability = async (data: {
  comunidadId: number;
  tipoPropiedad: string;
  numPropiedad?: number;
  numTrastero?: number;
  numParking?: number;
}) => {
  const res = await fetch(`${API_BASE}/propietarios/check-availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<{ errors: string[] }>;
};

// ==================== INCIDENCIAS DE COMUNIDAD ====================

export const getComunidadesConIncidencias = async (page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/incidencias/comunidades?page=${page}&limit=${limit}`);
  return res.json() as Promise<{ comunidades: ComunidadIncidenciaCount[]; pagination: PaginationInfo }>;
};

export const getIncidenciasByComunidad = async (comunidadId: number) => {
  const res = await fetch(`${API_BASE}/incidencias/comunidades/${comunidadId}/incidencias`);
  return res.json() as Promise<{ comunidad: any; incidencias: IncidenciaComunidadTitulo[] }>;
};

export const createIncidenciaComunidad = async (data: {
  idCom: number;
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string;
}) => {
  const res = await fetch(`${API_BASE}/incidencias/comunidades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<IncidenciaComunidadTitulo>;
};

export const updateIncidenciaComunidad = async (id: number, data: {
  estado: string;
  descripcionEstado: string;
}) => {
  const res = await fetch(`${API_BASE}/incidencias/comunidades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw errorData;
  }
  return res.json() as Promise<IncidenciaComunidadTitulo>;
};

export const deleteIncidenciaComunidad = async (id: number) => {
  const res = await fetch(`${API_BASE}/incidencias/comunidades/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

// ==================== INCIDENCIAS DE PROPIETARIO ====================

export const getPropietariosConIncidencias = async (page: number = 1, limit: number = 10) => {
  const res = await fetch(`${API_BASE}/incidencias/propietarios?page=${page}&limit=${limit}`);
  return res.json() as Promise<{ propietarios: PropietarioIncidenciaCount[]; pagination: PaginationInfo }>;
};

export const getIncidenciasByPropietario = async (propietarioId: number) => {
  const res = await fetch(`${API_BASE}/incidencias/propietarios/${propietarioId}/incidencias`);
  return res.json() as Promise<{ propietario: any; incidencias: IncidenciaPropietarioTitulo[] }>;
};

export const createIncidenciaPropietario = async (data: {
  idPro: number;
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string | null;
}) => {
  const res = await fetch(`${API_BASE}/incidencias/propietarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<IncidenciaPropietarioTitulo>;
};

export const updateIncidenciaPropietario = async (id: number, data: {
  tipoIncidencia: string;
  subtipoIncidencia: string | null;
  descripcion: string;
  estado: string;
  descripcionEstado: string | null;
}) => {
  const res = await fetch(`${API_BASE}/incidencias/propietarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json() as Promise<IncidenciaPropietarioTitulo>;
};

export const deleteIncidenciaPropietario = async (id: number) => {
  const res = await fetch(`${API_BASE}/incidencias/propietarios/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};
