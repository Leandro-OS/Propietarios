import { Router } from 'express';
import {
  getComunidades,
  getComunidadById,
  createComunidad,
  updateComunidad,
  deleteComunidad,
  getComunidadWithPropietarios
} from '../controllers/comunidades.controller.js';

const router = Router();

router.get('/', getComunidades);
router.get('/:id', getComunidadById);
router.get('/:id/detalles', getComunidadWithPropietarios);
router.post('/', createComunidad);
router.put('/:id', updateComunidad);
router.delete('/:id', deleteComunidad);

export default router;
