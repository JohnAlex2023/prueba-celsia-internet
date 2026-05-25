import { Servicio, TipoServicio } from '../entities/Servicio';
import { ServicioRepository } from '../repositories/ServicioRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { CreateServicioDTO, UpdateServicioDTO } from '../dtos/servicio.dto';
import { ConflictError, NotFoundError } from '../utils/AppError';

export class ServicioService {
  constructor(
    private readonly servicioRepo = new ServicioRepository(),
    private readonly clienteRepo = new ClienteRepository(),
  ) {}

  async listarPorCliente(identificacion: string): Promise<Servicio[]> {
    return this.servicioRepo.findByCliente(identificacion);
  }

  async crear(data: CreateServicioDTO): Promise<Servicio> {
    // Integridad referencial: el cliente debe existir
    const clienteExiste = await this.clienteRepo.exists(data.identificacion);
    if (!clienteExiste) {
      throw new NotFoundError(
        `No se puede contratar un servicio: el cliente ${data.identificacion} no existe`,
      );
    }

    const yaContratado = await this.servicioRepo.exists(
      data.identificacion,
      data.servicio,
    );
    if (yaContratado) {
      throw new ConflictError('El registro ya existe');
    }

    return this.servicioRepo.create({
      ...data,
      ultimoPago: data.ultimoPago ?? 0,
    });
  }

  async actualizar(
    identificacion: string,
    servicio: TipoServicio,
    data: UpdateServicioDTO,
  ): Promise<Servicio> {
    const existe = await this.servicioRepo.exists(identificacion, servicio);
    if (!existe) {
      throw new NotFoundError(
        `No se encontró el servicio ${servicio} para el cliente ${identificacion}`,
      );
    }
    const actualizado = await this.servicioRepo.update(
      identificacion,
      servicio,
      data,
    );
    if (!actualizado) {
      throw new NotFoundError('No se pudo actualizar el servicio');
    }
    return actualizado;
  }

  async eliminar(identificacion: string, servicio: TipoServicio): Promise<void> {
    const eliminado = await this.servicioRepo.delete(identificacion, servicio);
    if (!eliminado) {
      throw new NotFoundError(
        `No se encontró el servicio ${servicio} para el cliente ${identificacion}`,
      );
    }
  }
}
