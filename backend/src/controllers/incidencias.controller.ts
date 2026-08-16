import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==================== INCIDENCIAS DE COMUNIDAD ====================

export const getComunidadesConIncidencias = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const comunidades = await prisma.comunidad.findMany({
      orderBy: { direccion: 'asc' },
      skip: offset,
      take: limit
    });

    const total = await prisma.comunidad.count();

    const resultado = await Promise.all(
      comunidades.map(async (comunidad) => {
        const incidencias = await prisma.incidenciaComunidadTitulo.findMany({
          where: { idCom: comunidad.id }
        });

        const activas = incidencias.filter(
          (inc) => inc.estado !== 'Bloqueada' && inc.estado !== 'Cerrada'
        ).length;
        const bloqueadas = incidencias.filter(
          (inc) => inc.estado === 'Bloqueada'
        ).length;
        const cerradas = incidencias.filter(
          (inc) => inc.estado === 'Cerrada'
        ).length;

        return {
          id: comunidad.id,
          comunidad: `${comunidad.direccion} ${comunidad.numero}`,
          poblacion: comunidad.poblacion,
          activas,
          bloqueadas,
          cerradas
        };
      })
    );

    res.json({
      comunidades: resultado,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comunidades con incidencias' });
  }
};

export const getIncidenciasByComunidad = async (req: Request, res: Response) => {
  try {
    const comunidadId = parseInt(req.params.comunidadId as string);

    const comunidad = await prisma.comunidad.findUnique({
      where: { id: comunidadId }
    });

    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }

    const incidencias = await prisma.incidenciaComunidadTitulo.findMany({
      where: { idCom: comunidadId },
      orderBy: { fechaCreacion: 'desc' }
    });

    res.json({
      comunidad: {
        id: comunidad.id,
        direccion: comunidad.direccion,
        numero: comunidad.numero,
        poblacion: comunidad.poblacion
      },
      incidencias
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener incidencias de comunidad' });
  }
};

export const createIncidenciaComunidad = async (req: Request, res: Response) => {
  try {
    const { idCom, tipoIncidencia, subtipoIncidencia, descripcion, estado, descripcionEstado } = req.body;

    const comunidad = await prisma.comunidad.findUnique({
      where: { id: idCom }
    });

    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }

    const incidencia = await prisma.incidenciaComunidadTitulo.create({
      data: {
        idCom,
        tipoIncidencia,
        subtipoIncidencia,
        descripcion,
        estado,
        descripcionEstado,
        fechaCreacion: new Date(),
        fechaModificacion: null,
        fechaCierre: null
      }
    });

    // Crear registro histórico (fechaCreación del título si estado es "Registrada", sino fechaModificación)
    const fechaParaRegistro = estado === 'Registrada' 
      ? incidencia.fechaCreacion 
      : (incidencia.fechaModificacion || new Date());

    await prisma.incidenciaComunidadRegistros.create({
      data: {
        idIncCom: incidencia.idIncidencia,
        tipoIncidencia,
        subtipoIncidencia,
        descripcion,
        estado,
        descripcionEstado,
        fechaCreacion: fechaParaRegistro
      }
    });

    res.status(201).json(incidencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear incidencia de comunidad' });
  }
};

export const updateIncidenciaComunidad = async (req: Request, res: Response) => {
  try {
    const idIncidencia = parseInt(req.params.id as string);
    const { tipoIncidencia, subtipoIncidencia, descripcion, estado, descripcionEstado } = req.body;

    const incidencia = await prisma.incidenciaComunidadTitulo.findUnique({
      where: { idIncidencia }
    });

    if (!incidencia) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    if (incidencia.estado === 'Cerrada') {
      return res.status(403).json({ error: 'La incidencia cerrada no puede ser modificada' });
    }

    // Solo se permiten actualizar estado, descripcionEstado y fechaModificacion
    // Flujo de estados validos
    const flujo: Record<string, string[]> = {
      'Registrada': ['Abierta'],
      'Abierta': ['En proceso', 'Bloqueada'],
      'En proceso': ['En ejecucion', 'Bloqueada'],
      'En ejecucion': ['Resuelta', 'Bloqueada'],
      'Bloqueada': ['En ejecucion', 'Resuelta'],
      'Resuelta': ['Cerrada'],
      'Cerrada': []
    };

    const allowed = flujo[incidencia.estado] || [];
    if (!allowed.includes(estado)) {
      return res.status(403).json({
        error: `Estado no válido. Desde "${incidencia.estado}" solo se puede pasar a: ${allowed.join(', ') || 'ningún estado (cerrada)'}`
      });
    }

    const updateData: any = {
      estado,
      descripcionEstado,
      fechaModificacion: new Date()
    };

    if (estado === 'Cerrada') {
      updateData.fechaCierre = new Date();
    }

    const updated = await prisma.incidenciaComunidadTitulo.update({
      where: { idIncidencia },
      data: updateData
    });

    // Copiar todo el contenido de titulo a registros
    // Usar fechaModificación del título si estado NO es "Registrada", sino fechaCreación
    const fechaParaRegistro = estado === 'Registrada'
      ? updated.fechaCreacion
      : updated.fechaModificacion;

    await prisma.incidenciaComunidadRegistros.create({
      data: {
        idIncCom: updated.idIncidencia,
        tipoIncidencia: updated.tipoIncidencia,
        subtipoIncidencia: updated.subtipoIncidencia,
        descripcion: updated.descripcion,
        estado: updated.estado,
        descripcionEstado: updated.descripcionEstado,
        fechaCreacion: fechaParaRegistro!
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar incidencia de comunidad' });
  }
};

export const deleteIncidenciaComunidad = async (req: Request, res: Response) => {
  try {
    const idIncidencia = parseInt(req.params.id as string);

    const incidencia = await prisma.incidenciaComunidadTitulo.findUnique({
      where: { idIncidencia }
    });

    if (!incidencia) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    if (incidencia.estado === 'Cerrada') {
      return res.status(403).json({ error: 'La incidencia cerrada no puede ser eliminada' });
    }

    await prisma.incidenciaComunidadTitulo.delete({
      where: { idIncidencia }
    });

    res.json({ message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar incidencia de comunidad' });
  }
};

// ==================== INCIDENCIAS DE PROPIETARIO ====================

export const getPropietariosConIncidencias = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const propietarios = await prisma.propietario.findMany({
      orderBy: { nombre: 'asc' },
      skip: offset,
      take: limit,
      include: { comunidad: true }
    });

    const total = await prisma.propietario.count();

    const resultado = await Promise.all(
      propietarios.map(async (propietario) => {
        const incidencias = await prisma.incidenciaPropietarioTitulo.findMany({
          where: { idPro: propietario.id }
        });

        const activas = incidencias.filter(
          (inc) => inc.estado !== 'Bloqueada' && inc.estado !== 'Cerrada'
        ).length;
        const bloqueadas = incidencias.filter(
          (inc) => inc.estado === 'Bloqueada'
        ).length;
        const cerradas = incidencias.filter(
          (inc) => inc.estado === 'Cerrada'
        ).length;

        return {
          id: propietario.id,
          nombre: `${propietario.nombre} ${propietario.apellido1} ${propietario.apellido2 || ''}`,
          comunidad: `${propietario.comunidad.direccion} ${propietario.comunidad.numero}`,
          activas,
          bloqueadas,
          cerradas
        };
      })
    );

    res.json({
      propietarios: resultado,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propietarios con incidencias' });
  }
};

export const getIncidenciasByPropietario = async (req: Request, res: Response) => {
  try {
    const propietarioId = parseInt(req.params.propietarioId as string);

    const propietario = await prisma.propietario.findUnique({
      where: { id: propietarioId },
      include: { comunidad: true }
    });

    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    const incidencias = await prisma.incidenciaPropietarioTitulo.findMany({
      where: { idPro: propietarioId },
      orderBy: { fechaCreacion: 'desc' }
    });

    res.json({
      propietario: {
        id: propietario.id,
        nombre: `${propietario.nombre} ${propietario.apellido1} ${propietario.apellido2 || ''}`,
        comunidad: `${propietario.comunidad.direccion} ${propietario.comunidad.numero}`
      },
      incidencias
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener incidencias de propietario' });
  }
};

export const createIncidenciaPropietario = async (req: Request, res: Response) => {
  try {
    const { idPro, tipoIncidencia, subtipoIncidencia, descripcion, estado, descripcionEstado } = req.body;

    const propietario = await prisma.propietario.findUnique({
      where: { id: idPro }
    });

    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    const incidencia = await prisma.incidenciaPropietarioTitulo.create({
      data: {
        idPro,
        tipoIncidencia,
        subtipoIncidencia,
        descripcion,
        estado,
        descripcionEstado,
        fechaCreacion: new Date(),
        fechaModificacion: null,
        fechaCierre: null
      }
    });

    await prisma.incidenciaPropietarioRegistros.create({
      data: {
        idIncPro: incidencia.idIncidencia,
        tipoIncidencia,
        subtipoIncidencia,
        descripcion,
        estado,
        descripcionEstado,
        fechaCreacion: incidencia.fechaCreacion
      }
    });

    res.status(201).json(incidencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear incidencia de propietario' });
  }
};

export const updateIncidenciaPropietario = async (req: Request, res: Response) => {
  try {
    const idIncidencia = parseInt(req.params.id as string);
    const { tipoIncidencia, subtipoIncidencia, descripcion, estado, descripcionEstado } = req.body;

    const incidencia = await prisma.incidenciaPropietarioTitulo.findUnique({
      where: { idIncidencia }
    });

    if (!incidencia) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    if (incidencia.estado === 'Cerrada') {
      return res.status(403).json({ error: 'La incidencia cerrada no puede ser modificada' });
    }

    let fechaRegistro: Date;
    if (estado === 'Registrada') {
      fechaRegistro = incidencia.fechaCreacion;
    } else {
      fechaRegistro = new Date();
    }

    const updateData: any = {
      tipoIncidencia,
      subtipoIncidencia,
      descripcion,
      estado,
      descripcionEstado,
      fechaModificacion: new Date()
    };

    if (estado === 'Cerrada') {
      updateData.fechaCierre = new Date();
    }

    const updated = await prisma.incidenciaPropietarioTitulo.update({
      where: { idIncidencia },
      data: updateData
    });

    await prisma.incidenciaPropietarioRegistros.create({
      data: {
        idIncPro: updated.idIncidencia,
        tipoIncidencia,
        subtipoIncidencia,
        descripcion,
        estado,
        descripcionEstado,
        fechaCreacion: fechaRegistro
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar incidencia de propietario' });
  }
};

export const deleteIncidenciaPropietario = async (req: Request, res: Response) => {
  try {
    const idIncidencia = parseInt(req.params.id as string);

    const incidencia = await prisma.incidenciaPropietarioTitulo.findUnique({
      where: { idIncidencia }
    });

    if (!incidencia) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    if (incidencia.estado === 'Cerrada') {
      return res.status(403).json({ error: 'La incidencia cerrada no puede ser eliminada' });
    }

    await prisma.incidenciaPropietarioTitulo.delete({
      where: { idIncidencia }
    });

    res.json({ message: 'Incidencia eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar incidencia de propietario' });
  }
};
