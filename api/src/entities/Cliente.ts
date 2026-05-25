import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Servicio } from './Servicio';

export type TipoIdentificacion = 'CC' | 'TI' | 'CE' | 'RC';

@Entity({ name: 'clientes' })
export class Cliente {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  identificacion!: string;

  @Column({ type: 'varchar', length: 80 })
  nombres!: string;

  @Column({ type: 'varchar', length: 80 })
  apellidos!: string;

  @Column({ type: 'varchar', length: 2, name: 'tipoIdentificacion' })
  tipoIdentificacion!: TipoIdentificacion;

  @Column({ type: 'date', name: 'fechaNacimiento' })
  fechaNacimiento!: string;

  @Column({ type: 'varchar', length: 20, name: 'numeroCelular' })
  numeroCelular!: string;

  @Column({ type: 'varchar', length: 80, name: 'correoElectronico' })
  correoElectronico!: string;

  @OneToMany(() => Servicio, (servicio) => servicio.cliente, { cascade: false })
  servicios?: Servicio[];
}
