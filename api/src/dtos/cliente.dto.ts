import { TipoIdentificacion } from '../entities/Cliente';

export interface CreateClienteDTO {
  identificacion: string;
  nombres: string;
  apellidos: string;
  tipoIdentificacion: TipoIdentificacion;
  fechaNacimiento: string;
  numeroCelular: string;
  correoElectronico: string;
}

export interface UpdateClienteDTO {
  nombres?: string;
  apellidos?: string;
  tipoIdentificacion?: TipoIdentificacion;
  fechaNacimiento?: string;
  numeroCelular?: string;
  correoElectronico?: string;
}
