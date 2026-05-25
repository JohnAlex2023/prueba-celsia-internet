import { TipoServicio } from '../entities/Servicio';

export interface CreateServicioDTO {
  identificacion: string;
  servicio: TipoServicio;
  fechaInicio: string;
  ultimaFacturacion: string;
  ultimoPago?: number;
}

export interface UpdateServicioDTO {
  fechaInicio?: string;
  ultimaFacturacion?: string;
  ultimoPago?: number;
}
