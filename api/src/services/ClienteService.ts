import { Cliente } from '../entities/Cliente';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { ServicioRepository } from '../repositories/ServicioRepository';
import { CreateClienteDTO, UpdateClienteDTO } from '../dtos/cliente.dto';
import { ConflictError, NotFoundError } from '../utils/AppError';

/**
 * Capa de servicio del agregado Cliente.
 * Aquí va la lógica de negocio: la capa de controllers no debe hablar con el repositorio.
 */
export class ClienteService {
  constructor(
    private readonly repository = new ClienteRepository(),
    private readonly servicioRepository = new ServicioRepository(),
  ) {}

  async listar(): Promise<Cliente[]> {
    return this.repository.findAll();
  }

  async obtenerPorId(identificacion: string): Promise<Cliente> {
    const cliente = await this.repository.findByIdWithServicios(identificacion);
    if (!cliente) {
      throw new NotFoundError(
        `No se encontró el cliente con identificación ${identificacion}`,
      );
    }
    return cliente;
  }

  async crear(data: CreateClienteDTO): Promise<Cliente> {
    const yaExiste = await this.repository.exists(data.identificacion);
    if (yaExiste) {
      throw new ConflictError('El registro ya existe');
    }
    return this.repository.create(data);
  }

  async actualizar(
    identificacion: string,
    data: UpdateClienteDTO,
  ): Promise<Cliente> {
    const existe = await this.repository.exists(identificacion);
    if (!existe) {
      throw new NotFoundError(
        `No se encontró el cliente con identificación ${identificacion}`,
      );
    }
    const actualizado = await this.repository.update(identificacion, data);
    if (!actualizado) {
      throw new NotFoundError('No se pudo actualizar el cliente');
    }
    return actualizado;
  }

  async eliminar(identificacion: string): Promise<void> {
    const existe = await this.repository.exists(identificacion);
    if (!existe) {
      throw new NotFoundError(
        `No se encontró el cliente con identificación ${identificacion}`,
      );
    }

    const serviciosContratados =
      await this.servicioRepository.countByCliente(identificacion);
    if (serviciosContratados > 0) {
      throw new ConflictError(
        'No se puede eliminar el cliente: tiene servicios contratados. Cancele los servicios primero.',
      );
    }

    const eliminado = await this.repository.delete(identificacion);
    if (!eliminado) {
      throw new NotFoundError(
        `No se encontró el cliente con identificación ${identificacion}`,
      );
    }
  }
}
