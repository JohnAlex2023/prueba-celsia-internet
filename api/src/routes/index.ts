import { Router } from 'express';
import clienteRoutes from './cliente.routes';
import servicioRoutes from './servicio.routes';
import { TIPOS_IDENTIFICACION, TIPOS_SERVICIO } from '../utils/constants';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'celsia-internet-api' });
});

// Endpoint utilitario para alimentar selects del frontend
router.get('/catalogos', (_req, res) => {
  res.json({
    success: true,
    data: {
      tiposIdentificacion: TIPOS_IDENTIFICACION,
      tiposServicio: TIPOS_SERVICIO,
    },
  });
});

router.use('/clientes', clienteRoutes);
router.use('/servicios', servicioRoutes);

export default router;
