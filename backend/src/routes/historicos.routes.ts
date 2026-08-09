import { Router } from 'express';
import {
  getComunidadesHistoricas,
  getComunidadHistoricaById,
  getPropietariosHistoricosByComunidad,
  getPropietarioHistoricoById
} from '../controllers/historicos.controller.js';

const router = Router();

router.get('/comunidades', getComunidadesHistoricas);
router.get('/comunidades/:id', getComunidadHistoricaById);
router.get('/propietarios/comunidad/:comunidadId', getPropietariosHistoricosByComunidad);
router.get('/propietarios/:id', getPropietarioHistoricoById);

export default router;
