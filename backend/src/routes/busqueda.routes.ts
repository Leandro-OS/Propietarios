import { Router } from 'express';
import {
  buscarComunidades,
  buscarPropietarios
} from '../controllers/busqueda.controller.js';

const router = Router();

router.get('/comunidades', buscarComunidades);
router.get('/propietarios', buscarPropietarios);

export default router;
