import { Request, Response, NextFunction } from 'express';
import { ClienteService } from '../services/ClienteService';
import { CreateClienteDTO, UpdateClienteDTO } from '../dtos/cliente.dto';

export class ClienteController {
  constructor(private readonly service = new ClienteService()) {}

  listar = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const clientes = await this.service.listar();
      res.json({ success: true, data: clientes });
    } catch (err) {
      next(err);
    }
  };

  obtener = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cliente = await this.service.obtenerPorId(req.params.identificacion);
      res.json({ success: true, data: cliente });
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
      const dto = req.body as CreateClienteDTO;
      const cliente = await this.service.crear(dto);
      res.status(201).json({ success: true, data: cliente });
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
      const dto = req.body as UpdateClienteDTO;
      const cliente = await this.service.actualizar(
        req.params.identificacion,
        dto,
      );
      res.json({ success: true, data: cliente });
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
      await this.service.eliminar(req.params.identificacion);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
