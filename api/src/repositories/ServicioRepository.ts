import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { Servicio, TipoServicio } from '../entities/Servicio';

export class ServicioRepository {
  private repo: Repository<Servicio>;

  constructor() {
    this.repo = AppDataSource.getRepository(Servicio);
  }

  async findAll(): Promise<Servicio[]> {
    return this.repo.find();
  }

  async findByCliente(identificacion: string): Promise<Servicio[]> {
    return this.repo.find({ where: { identificacion } });
  }

  async findOne(
    identificacion: string,
    servicio: TipoServicio,
  ): Promise<Servicio | null> {
    return this.repo.findOne({ where: { identificacion, servicio } });
  }

  async create(servicio: Partial<Servicio>): Promise<Servicio> {
    const entity = this.repo.create(servicio);
    return this.repo.save(entity);
  }

  async update(
    identificacion: string,
    servicio: TipoServicio,
    data: Partial<Servicio>,
  ): Promise<Servicio | null> {
    await this.repo.update({ identificacion, servicio }, data);
    return this.findOne(identificacion, servicio);
  }

  async delete(identificacion: string, servicio: TipoServicio): Promise<boolean> {
    const result = await this.repo.delete({ identificacion, servicio });
    return (result.affected ?? 0) > 0;
  }

  async exists(identificacion: string, servicio: TipoServicio): Promise<boolean> {
    const count = await this.repo.count({ where: { identificacion, servicio } });
    return count > 0;
  }

  async countByCliente(identificacion: string): Promise<number> {
    return this.repo.count({ where: { identificacion } });
  }
}
