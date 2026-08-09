import { Router } from 'express';
import {
  getPropietariosByComunidad,
  getPropietarioById,
  createPropietario,
  updatePropietario,
  deletePropietario,
  getPropietariosByComunidadOrdered
} from '../controllers/propietarios.controller.js';

const router = Router();

router.get('/comunidad/:comunidadId', getPropietariosByComunidad);
router.get('/comunidad/:comunidadId/ordenados', getPropietariosByComunidadOrdered);
router.get('/:id', getPropietarioById);
router.post('/', createPropietario);
router.put('/:id', updatePropietario);
router.delete('/:id', deletePropietario);

export default router;
