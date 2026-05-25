import { Router } from 'express';
import { ServicioController } from '../controllers/ServicioController';
import {
  validate,
  createServicioValidators,
  updateServicioValidators,
  servicioParamsValidator,
  identificacionParamValidator,
} from '../middlewares/validators';

const router = Router();
const controller = new ServicioController();

router.get(
  '/:identificacion',
  validate(identificacionParamValidator),
  controller.listarPorCliente,
);
router.post('/', validate(createServicioValidators), controller.crear);
router.put(
  '/:identificacion/:servicio',
  validate(updateServicioValidators),
  controller.actualizar,
);
router.delete(
  '/:identificacion/:servicio',
  validate(servicioParamsValidator),
  controller.eliminar,
);

export default router;
