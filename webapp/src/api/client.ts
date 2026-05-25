import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Cliente,
  Servicio,
  ApiResponse,
  TipoServicio,
} from '../types';

/**
 * Capa de acceso al API.
 * Encapsula axios (patrón Adapter) y expone funciones tipadas por recurso.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Normaliza el mensaje de error para el frontend
function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiResponse<unknown>>;
    const message =
      err.response?.data?.message ||
      err.message ||
      'Error de comunicación con el servidor';
    throw new Error(message);
  }
  throw new Error('Error inesperado');
}

// ---------- Catálogos ----------
export interface Catalogos {
  tiposIdentificacion: readonly string[];
  tiposServicio: readonly string[];
}

export const catalogosApi = {
  obtener: async (): Promise<Catalogos> => {
    try {
      const { data } = await http.get<ApiResponse<Catalogos>>('/catalogos');
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },
};

// ---------- Clientes ----------
export const clientesApi = {
  listar: async (): Promise<Cliente[]> => {
    try {
      const { data } = await http.get<ApiResponse<Cliente[]>>('/clientes');
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  obtener: async (identificacion: string): Promise<Cliente> => {
    try {
      const { data } = await http.get<ApiResponse<Cliente>>(
        `/clientes/${encodeURIComponent(identificacion)}`,
      );
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  crear: async (cliente: Omit<Cliente, 'servicios'>): Promise<Cliente> => {
    try {
      const { data } = await http.post<ApiResponse<Cliente>>('/clientes', cliente);
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  actualizar: async (
    identificacion: string,
    cambios: Partial<Cliente>,
  ): Promise<Cliente> => {
    try {
      const { data } = await http.put<ApiResponse<Cliente>>(
        `/clientes/${encodeURIComponent(identificacion)}`,
        cambios,
      );
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  eliminar: async (identificacion: string): Promise<void> => {
    try {
      await http.delete(`/clientes/${encodeURIComponent(identificacion)}`);
    } catch (err) {
      handleError(err);
    }
  },
};

// ---------- Servicios ----------
export const serviciosApi = {
  porCliente: async (identificacion: string): Promise<Servicio[]> => {
    try {
      const { data } = await http.get<ApiResponse<Servicio[]>>(
        `/servicios/${encodeURIComponent(identificacion)}`,
      );
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  crear: async (servicio: Servicio): Promise<Servicio> => {
    try {
      const { data } = await http.post<ApiResponse<Servicio>>('/servicios', servicio);
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  actualizar: async (
    identificacion: string,
    servicio: TipoServicio,
    cambios: Pick<Servicio, 'fechaInicio' | 'ultimaFacturacion' | 'ultimoPago'>,
  ): Promise<Servicio> => {
    try {
      const { data } = await http.put<ApiResponse<Servicio>>(
        `/servicios/${encodeURIComponent(identificacion)}/${encodeURIComponent(servicio)}`,
        cambios,
      );
      return data.data;
    } catch (err) {
      handleError(err);
    }
  },

  eliminar: async (
    identificacion: string,
    servicio: TipoServicio,
  ): Promise<void> => {
    try {
      await http.delete(
        `/servicios/${encodeURIComponent(identificacion)}/${encodeURIComponent(servicio)}`,
      );
    } catch (err) {
      handleError(err);
    }
  },
};
