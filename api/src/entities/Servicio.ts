import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './Cliente';

export type TipoServicio =
  | 'Internet 200 MB'
  | 'Internet 400 MB'
  | 'Internet 600 MB'
  | 'Directv Go'
  | 'Paramount+'
  | 'Win+';

@Entity({ name: 'servicios' })
export class Servicio {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  identificacion!: string;

  @PrimaryColumn({ type: 'varchar', length: 80 })
  servicio!: TipoServicio;

  @Column({ type: 'date', name: 'fechaInicio' })
  fechaInicio!: string;

  @Column({ type: 'date', name: 'ultimaFacturacion' })
  ultimaFacturacion!: string;

  @Column({ type: 'int', name: 'ultimoPago', default: 0 })
  ultimoPago!: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.servicios, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'identificacion' })
  cliente?: Cliente;
}
