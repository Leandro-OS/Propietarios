import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPropietariosByComunidad = async (req: Request, res: Response) => {
  try {
    const propietarios = await prisma.propietario.findMany({
      where: { comunidadId: parseInt(req.params.comunidadId as string) }
    });
    res.json(propietarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propietarios' });
  }
};

export const getPropietariosByComunidadOrdered = async (req: Request, res: Response) => {
  try {
    const propietarios = await prisma.propietario.findMany({
      where: { comunidadId: parseInt(req.params.comunidadId as string) },
      orderBy: [
        { tipoPropiedad: 'asc' },
        { numPropiedad: 'asc' }
      ]
    });
    res.json(propietarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propietarios ordenados' });
  }
};

export const getPropietarioById = async (req: Request, res: Response) => {
  try {
    const propietario = await prisma.propietario.findUnique({
      where: { id: parseInt(req.params.id as string) }
    });
    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }
    res.json(propietario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propietario' });
  }
};

export const createPropietario = async (req: Request, res: Response) => {
  try {
    const {
      nombre, apellido1, apellido2, tipoPropiedad, numPropiedad, pisoPropiedad,
      tipo, pertenece, tieneTrastero, numTrastero, lugarTrastero,
      tieneParking, numParking, lugarParking, comunidadId
    } = req.body;

    const propietario = await prisma.propietario.create({
      data: {
        nombre,
        apellido1,
        apellido2,
        tipoPropiedad,
        numPropiedad,
        pisoPropiedad,
        tipo,
        pertenece,
        tieneTrastero,
        numTrastero,
        lugarTrastero,
        tieneParking,
        numParking,
        lugarParking,
        comunidadId
      }
    });
    res.status(201).json(propietario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear propietario' });
  }
};

export const updatePropietario = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido1, apellido2 } = req.body;

    const propietario = await prisma.propietario.update({
      where: { id: parseInt(req.params.id as string) },
      data: {
        nombre,
        apellido1,
        apellido2,
        pertenece: `${nombre} ${apellido1} ${apellido2}`,
        numActualizaciones: { increment: 1 }
      }
    });
    res.json(propietario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar propietario' });
  }
};

export const deletePropietario = async (req: Request, res: Response) => {
  try {
    const propietario = await prisma.propietario.findUnique({
      where: { id: parseInt(req.params.id as string) }
    });

    if (!propietario) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    const motivoBaja = req.body.motivoBaja || null;

    // Save to historico
    await prisma.propietarioHistorico.create({
      data: {
        nombre: propietario.nombre,
        apellido1: propietario.apellido1,
        apellido2: propietario.apellido2,
        tipoPropiedad: propietario.tipoPropiedad,
        numPropiedad: propietario.numPropiedad,
        pisoPropiedad: propietario.pisoPropiedad,
        tipo: propietario.tipo,
        pertenece: propietario.pertenece,
        tieneTrastero: propietario.tieneTrastero,
        numTrastero: propietario.numTrastero,
        lugarTrastero: propietario.lugarTrastero,
        tieneParking: propietario.tieneParking,
        numParking: propietario.numParking,
        lugarParking: propietario.lugarParking,
        comunidadId: propietario.comunidadId,
        createdAt: propietario.createdAt,
        updatedAt: propietario.updatedAt,
        numActualizaciones: propietario.numActualizaciones,
        fechaSupresion: new Date(),
        motivoBaja: motivoBaja
      }
    });

    // Delete
    await prisma.propietario.delete({
      where: { id: parseInt(req.params.id as string) }
    });

    res.json({ message: 'Propietario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar propietario' });
  }
};
