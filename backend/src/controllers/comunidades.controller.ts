import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getComunidades = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [comunidades, total] = await Promise.all([
      prisma.comunidad.findMany({
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' }
      }),
      prisma.comunidad.count()
    ]);

    res.json({
      comunidades,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comunidades' });
  }
};

export const getComunidadById = async (req: Request, res: Response) => {
  try {
    const comunidad = await prisma.comunidad.findUnique({
      where: { id: parseInt(req.params.id as string) }
    });
    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }
    res.json(comunidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comunidad' });
  }
};

export const getComunidadWithPropietarios = async (req: Request, res: Response) => {
  try {
    const comunidad = await prisma.comunidad.findUnique({
      where: { id: parseInt(req.params.id as string) },
      include: {
        propietarios: true
      }
    });
    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }
    res.json(comunidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comunidad con propietarios' });
  }
};

export const createComunidad = async (req: Request, res: Response) => {
  try {
    const { via, direccion, numero, codigoPostal, urbanizacion, poblacion,
      numPisos, numViviendas, numLocales, numSotanos, numParkings, numTrasteros } = req.body;

    const comunidad = await prisma.comunidad.create({
      data: {
        via,
        direccion,
        numero,
        codigoPostal,
        urbanizacion,
        poblacion,
        numPisos,
        numViviendas,
        numLocales,
        numSotanos,
        numParkings,
        numTrasteros
      }
    });
    res.status(201).json(comunidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear comunidad' });
  }
};

export const updateComunidad = async (req: Request, res: Response) => {
  try {
    const { via, direccion, numero, codigoPostal, urbanizacion, poblacion,
      numPisos, numViviendas, numLocales, numSotanos, numParkings, numTrasteros } = req.body;

    const comunidad = await prisma.comunidad.update({
      where: { id: parseInt(req.params.id as string) },
      data: {
        via,
        direccion,
        numero,
        codigoPostal,
        urbanizacion,
        poblacion,
        numPisos,
        numViviendas,
        numLocales,
        numSotanos,
        numParkings,
        numTrasteros,
        numActualizaciones: { increment: 1 }
      }
    });
    res.json(comunidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar comunidad' });
  }
};

export const deleteComunidad = async (req: Request, res: Response) => {
  try {
    const { motivo } = req.body;
    const comunidadId = parseInt(req.params.id as string);

    const comunidad = await prisma.comunidad.findUnique({
      where: { id: comunidadId },
      include: { propietarios: true }
    });

    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad no encontrada' });
    }

    // Save to historico
    const fechaSupresion = new Date();

    const historicoComunidad = await prisma.comunidadHistorico.create({
      data: {
        via: comunidad.via,
        direccion: comunidad.direccion,
        numero: comunidad.numero,
        codigoPostal: comunidad.codigoPostal,
        urbanizacion: comunidad.urbanizacion,
        poblacion: comunidad.poblacion,
        numPisos: comunidad.numPisos,
        numViviendas: comunidad.numViviendas,
        numLocales: comunidad.numLocales,
        numSotanos: comunidad.numSotanos,
        numParkings: comunidad.numParkings,
        numTrasteros: comunidad.numTrasteros,
        createdAt: comunidad.createdAt,
        updatedAt: comunidad.updatedAt,
        fechaSupresion,
        motivo: motivo || null
      }
    });

    // Save all propietarios to historico
    for (const prop of comunidad.propietarios) {
      await prisma.propietarioHistorico.create({
        data: {
          nombre: prop.nombre,
          apellido1: prop.apellido1,
          apellido2: prop.apellido2,
          tipoPropiedad: prop.tipoPropiedad,
          numPropiedad: prop.numPropiedad,
          pisoPropiedad: prop.pisoPropiedad,
          tipo: prop.tipo,
          residente: prop.residente,
          tieneTrastero: prop.tieneTrastero,
          numTrastero: prop.numTrastero,
          lugarTrastero: prop.lugarTrastero,
          tieneParking: prop.tieneParking,
          numParking: prop.numParking,
          lugarParking: prop.lugarParking,
          comunidadId: historicoComunidad.id,
          createdAt: prop.createdAt,
          updatedAt: prop.updatedAt,
          fechaSupresion,
          motivo: motivo || null
        }
      });
    }

    // Delete cascade
    await prisma.comunidad.delete({
      where: { id: comunidadId }
    });

    res.json({ message: 'Comunidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comunidad' });
  }
};
