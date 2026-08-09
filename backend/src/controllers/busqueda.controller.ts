import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const buscarComunidades = async (req: Request, res: Response) => {
  try {
    const texto = (req.query.texto as string) || '';
    const comunidades = await prisma.comunidad.findMany({
      where: {
        OR: [
          { via: { contains: texto, mode: 'insensitive' } },
          { direccion: { contains: texto, mode: 'insensitive' } },
          { numero: { contains: texto, mode: 'insensitive' } },
          { poblacion: { contains: texto, mode: 'insensitive' } },
          { urbanizacion: { contains: texto, mode: 'insensitive' } }
        ]
      },
      orderBy: { id: 'asc' }
    });
    res.json(comunidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar comunidades' });
  }
};

export const buscarPropietarios = async (req: Request, res: Response) => {
  try {
    const texto = (req.query.texto as string) || '';
    const propietarios = await prisma.propietario.findMany({
      where: {
        OR: [
          { nombre: { contains: texto, mode: 'insensitive' } },
          { apellido1: { contains: texto, mode: 'insensitive' } },
          { apellido2: { contains: texto, mode: 'insensitive' } }
        ]
      },
      orderBy: { id: 'asc' }
    });
    res.json(propietarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar propietarios' });
  }
};
