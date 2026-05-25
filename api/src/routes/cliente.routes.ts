import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import {
  validate,
  createClienteValidators,
  updateClienteValidators,
  identificacionParamValidator,
} from '../middlewares/validators';

const router = Router();
const controller = new ClienteController();

router.get('/', controller.listar);
router.get(
  '/:identificacion',
  validate(identificacionParamValidator),
  controller.obtener,
);
router.post('/', validate(createClienteValidators), controller.crear);
router.put(
  '/:identificacion',
  validate(updateClienteValidators),
  controller.actualizar,
);
router.delete(
  '/:identificacion',
  validate(identificacionParamValidator),
  controller.eliminar,
);

export default router;
