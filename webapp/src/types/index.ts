export type TipoIdentificacion = 'CC' | 'TI' | 'CE' | 'RC';

export type TipoServicio =
  | 'Internet 200 MB'
  | 'Internet 400 MB'
  | 'Internet 600 MB'
  | 'Directv Go'
  | 'Paramount+'
  | 'Win+';

export interface Cliente {
  identificacion: string;
  nombres: string;
  apellidos: string;
  tipoIdentificacion: TipoIdentificacion;
  fechaNacimiento: string;
  numeroCelular: string;
  correoElectronico: string;
  servicios?: Servicio[];
}

export interface Servicio {
  identificacion: string;
  servicio: TipoServicio;
  fechaInicio: string;
  ultimaFacturacion: string;
  ultimoPago: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  details?: unknown;
}
