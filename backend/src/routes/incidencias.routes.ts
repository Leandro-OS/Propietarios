import { Router } from 'express';
import {
  getComunidadesConIncidencias,
  getIncidenciasByComunidad,
  createIncidenciaComunidad,
  updateIncidenciaComunidad,
  deleteIncidenciaComunidad,
  getEvolucionIncidenciaComunidad,
  getPropietariosConIncidencias,
  getIncidenciasByPropietario,
  createIncidenciaPropietario,
  updateIncidenciaPropietario,
  deleteIncidenciaPropietario,
  getEvolucionIncidenciaPropietario
} from '../controllers/incidencias.controller.js';

const router = Router();

// Rutas de incidencias por comunidad
router.get('/comunidades', getComunidadesConIncidencias);
router.get('/comunidades/:comunidadId/incidencias', getIncidenciasByComunidad);
router.post('/comunidades', createIncidenciaComunidad);
router.put('/comunidades/:id', updateIncidenciaComunidad);
router.delete('/comunidades/:id', deleteIncidenciaComunidad);
router.get('/comunidades/:id/evolucion', getEvolucionIncidenciaComunidad);

// Rutas de incidencias por propietario
router.get('/propietarios', getPropietariosConIncidencias);
router.get('/propietarios/:propietarioId/incidencias', getIncidenciasByPropietario);
router.post('/propietarios', createIncidenciaPropietario);
router.put('/propietarios/:id', updateIncidenciaPropietario);
router.delete('/propietarios/:id', deleteIncidenciaPropietario);
router.get('/propietarios/:id/evolucion', getEvolucionIncidenciaPropietario);

export default router;