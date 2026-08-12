import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const buscarComunidades = async (req: Request, res: Response) => {
  try {
    const texto = (req.query.texto as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [comunidades, total] = await Promise.all([
      prisma.comunidad.findMany({
        where: {
          OR: [
            { direccion: { contains: texto, mode: 'insensitive' } },
            { poblacion: { contains: texto, mode: 'insensitive' } }
          ]
        },
        skip: offset,
        take: limit,
        orderBy: { direccion: 'asc' }
      }),
      prisma.comunidad.count({
        where: {
          OR: [
            { direccion: { contains: texto, mode: 'insensitive' } },
            { poblacion: { contains: texto, mode: 'insensitive' } }
          ]
        }
      })
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
    res.status(500).json({ error: 'Error al buscar comunidades' });
  }
};

export const buscarPropietarios = async (req: Request, res: Response) => {
  try {
    const texto = (req.query.texto as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [propietarios, total] = await Promise.all([
      prisma.propietario.findMany({
        where: {
          OR: [
            { nombre: { contains: texto, mode: 'insensitive' } },
            { apellido1: { contains: texto, mode: 'insensitive' } },
            { apellido2: { contains: texto, mode: 'insensitive' } },
            { tipo: { contains: texto, mode: 'insensitive' } }
          ]
        },
        skip: offset,
        take: limit,
        orderBy: { nombre: 'asc' }
      }),
      prisma.propietario.count({
        where: {
          OR: [
            { nombre: { contains: texto, mode: 'insensitive' } },
            { apellido1: { contains: texto, mode: 'insensitive' } },
            { apellido2: { contains: texto, mode: 'insensitive' } },
            { tipo: { contains: texto, mode: 'insensitive' } }
          ]
        }
      })
    ]);

    res.json({
      propietarios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar propietarios' });
  }
};
