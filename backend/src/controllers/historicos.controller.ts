import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getComunidadesHistoricas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [comunidades, total] = await Promise.all([
      prisma.comunidadHistorico.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.comunidadHistorico.count()
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
    res.status(500).json({ error: 'Error al obtener comunidades históricas' });
  }
};

export const getComunidadHistoricaById = async (req: Request, res: Response) => {
  try {
    const comunidad = await prisma.comunidadHistorico.findUnique({
      where: { id: parseInt(req.params.id as string) }
    });
    if (!comunidad) {
      return res.status(404).json({ error: 'Comunidad histórica no encontrada' });
    }
    res.json(comunidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comunidad histórica' });
  }
};

export const getPropietariosHistoricosByComunidad = async (req: Request, res: Response) => {
  try {
    const propietarios = await prisma.propietarioHistorico.findMany({
      where: { comunidadId: parseInt(req.params.comunidadId as string) },
      orderBy: [
        { tipoPropiedad: 'asc' },
        { numPropiedad: 'asc' }
      ]
    });
    res.json(propietarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propietarios históricos' });
  }
};

export const getPropietarioHistoricoById = async (req: Request, res: Response) => {
  try {
    const propietario = await prisma.propietarioHistorico.findUnique({
      where: { id: parseInt(req.params.id as string) }
    });
    if (!propietario) {
      return res.status(404).json({ error: 'Propietario histórico no encontrado' });
    }
    res.json(propietario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propietario histórico' });
  }
};
