import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesApi } from '../api/client';
import { ClienteForm } from '../components/ClienteForm';
import { Alert } from '../components/Alert';
import type { Cliente } from '../types';

export function ClienteCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(cliente: Omit<Cliente, 'servicios'>) {
    setError(null);
    setSuccess(null);
    try {
      await clientesApi.crear(cliente);
      setSuccess('Cliente registrado correctamente');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="card">
      <h2>Registrar nuevo cliente</h2>
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      <ClienteForm onSubmit={handleSubmit} submitLabel="Registrar cliente" />
    </div>
  );
}
