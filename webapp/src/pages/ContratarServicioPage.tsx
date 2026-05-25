import { useState } from 'react';
import { serviciosApi } from '../api/client';
import { ServicioForm } from '../components/ServicioForm';
import { Alert } from '../components/Alert';
import type { Servicio } from '../types';

export function ContratarServicioPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(servicio: Servicio) {
    setError(null);
    setSuccess(null);
    try {
      await serviciosApi.crear(servicio);
      setSuccess(
        `Servicio "${servicio.servicio}" contratado para el cliente ${servicio.identificacion}`,
      );
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="card">
      <h2>Contratar servicio</h2>
      <p className="muted">
        Registra un nuevo servicio asociado a un cliente existente. Se valida
        integridad referencial contra la tabla de clientes.
      </p>
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      <ServicioForm onSubmit={handleSubmit} />
    </div>
  );
}
