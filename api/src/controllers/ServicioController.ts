import { Request, Response, NextFunction } from 'express';
import { ServicioService } from '../services/ServicioService';
import { CreateServicioDTO, UpdateServicioDTO } from '../dtos/servicio.dto';
import { TipoServicio } from '../entities/Servicio';

export class ServicioController {
  constructor(private readonly service = new ServicioService()) {}

  listarPorCliente = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.service.listarPorCliente(req.params.identificacion);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  crear = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateServicioDTO;
      const servicio = await this.service.crear(dto);
      res.status(201).json({ success: true, data: servicio });
    } catch (err) {
      next(err);
    }
  };

  actualizar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as UpdateServicioDTO;
      const servicio = await this.service.actualizar(
        req.params.identificacion,
        req.params.servicio as TipoServicio,
        dto,
      );
      res.json({ success: true, data: servicio });
    } catch (err) {
      next(err);
    }
  };

  eliminar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.service.eliminar(
        req.params.identificacion,
        req.params.servicio as TipoServicio,
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
