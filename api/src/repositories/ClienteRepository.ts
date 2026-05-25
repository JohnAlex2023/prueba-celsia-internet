import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Cliente } from '../entities/Cliente';

/**
 * Repositorio del agregado Cliente.
 * Aísla la lógica de acceso a datos del resto de la aplicación (patrón Repository).
 */
export class ClienteRepository {
  private repo: Repository<Cliente>;

  constructor() {
    this.repo = AppDataSource.getRepository(Cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return this.repo.find({ order: { identificacion: 'ASC' } });
  }

  async findById(identificacion: string): Promise<Cliente | null> {
    return this.repo.findOne({ where: { identificacion } });
  }

  async findByIdWithServicios(identificacion: string): Promise<Cliente | null> {
    return this.repo.findOne({
      where: { identificacion },
      relations: ['servicios'],
    });
  }

  async create(cliente: Partial<Cliente>): Promise<Cliente> {
    const entity = this.repo.create(cliente);
    return this.repo.save(entity);
  }

  async update(
    identificacion: string,
    data: Partial<Cliente>,
  ): Promise<Cliente | null> {
    await this.repo.update({ identificacion }, data);
    return this.findById(identificacion);
  }

  async delete(identificacion: string): Promise<boolean> {
    const result = await this.repo.delete({ identificacion });
    return (result.affected ?? 0) > 0;
  }

  async exists(identificacion: string): Promise<boolean> {
    const count = await this.repo.count({ where: { identificacion } });
    return count > 0;
  }
}
