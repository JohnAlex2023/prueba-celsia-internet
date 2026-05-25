import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientesApi } from '../api/client';
import { ClienteForm } from '../components/ClienteForm';
import { Alert } from '../components/Alert';
import type { Cliente } from '../types';

export function ClienteEditPage() {
  const { identificacion } = useParams<{ identificacion: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!identificacion) return;
    clientesApi
      .obtener(identificacion)
      .then(setCliente)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [identificacion]);

  async function handleSubmit(data: Omit<Cliente, 'servicios'>) {
    if (!identificacion) return;
    setError(null);
    setSuccess(null);
    try {
      const { identificacion: _, ...cambios } = data;
      await clientesApi.actualizar(identificacion, cambios);
      setSuccess('Cliente actualizado');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <div className="card">Cargando…</div>;
  if (!cliente)
    return (
      <div className="card">
        <Alert type="error">{error ?? 'Cliente no encontrado'}</Alert>
      </div>
    );

  return (
    <div className="card">
      <h2>Editar cliente {cliente.identificacion}</h2>
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      <ClienteForm
        initialValues={cliente}
        disableIdentificacion
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
