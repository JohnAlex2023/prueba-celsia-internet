import { useState, type FormEvent } from 'react';
import { clientesApi, serviciosApi } from '../api/client';
import type { Cliente, Servicio, TipoServicio } from '../types';
import { Alert } from '../components/Alert';
import { ServicioForm } from '../components/ServicioForm';

export function ConsultarPage() {
  const [identificacion, setIdentificacion] = useState('');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refrescarCliente(id: string) {
    const data = await clientesApi.obtener(id);
    setCliente(data);
    return data;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!identificacion.trim()) {
      setError('Ingrese una identificación');
      return;
    }
    setError(null);
    setSuccess(null);
    setCliente(null);
    setEditingServicio(null);
    setLoading(true);
    try {
      const data = await clientesApi.obtener(identificacion.trim());
      setCliente(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminarServicio(servicio: TipoServicio) {
    if (!cliente) return;
    if (!window.confirm(`¿Cancelar el servicio "${servicio}"?`)) return;
    setError(null);
    setSuccess(null);
    try {
      await serviciosApi.eliminar(cliente.identificacion, servicio);
      if (editingServicio?.servicio === servicio) {
        setEditingServicio(null);
      }
      await refrescarCliente(cliente.identificacion);
      setSuccess(`Servicio "${servicio}" cancelado correctamente.`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleActualizarServicio(servicio: Servicio) {
    if (!cliente) return;
    setError(null);
    setSuccess(null);
    try {
      await serviciosApi.actualizar(cliente.identificacion, servicio.servicio, {
        fechaInicio: servicio.fechaInicio,
        ultimaFacturacion: servicio.ultimaFacturacion,
        ultimoPago: servicio.ultimoPago,
      });
      await refrescarCliente(cliente.identificacion);
      setEditingServicio(null);
      setSuccess(`Servicio "${servicio.servicio}" actualizado correctamente.`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Consultar cliente por identificación</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Número de identificación</label>
              <input
                type="text"
                value={identificacion}
                placeholder="Ej: 1088123456"
                onChange={(e) => setIdentificacion(e.target.value)}
              />
            </div>
          </div>
          <div className="actions-row">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Buscando…' : 'Consultar'}
            </button>
          </div>
        </form>
        {error && !cliente && (
          <div style={{ marginTop: '1rem' }}>
            <Alert type="error">{error}</Alert>
          </div>
        )}
      </div>

      {cliente && (
        <div className="card">
          <h2>
            {cliente.nombres} {cliente.apellidos}{' '}
            <span className="badge">{cliente.tipoIdentificacion}</span>
          </h2>
          {error && (
            <div style={{ marginBottom: '1rem' }}>
              <Alert type="error">{error}</Alert>
            </div>
          )}
          {success && (
            <div style={{ marginBottom: '1rem' }}>
              <Alert type="success">{success}</Alert>
            </div>
          )}
          <div className="form-grid" style={{ marginBottom: '1rem' }}>
            <div>
              <strong>Identificación:</strong> {cliente.identificacion}
            </div>
            <div>
              <strong>Fecha de nacimiento:</strong> {cliente.fechaNacimiento}
            </div>
            <div>
              <strong>Celular:</strong> {cliente.numeroCelular}
            </div>
            <div>
              <strong>Correo:</strong> {cliente.correoElectronico}
            </div>
          </div>

          <h3>Servicios contratados</h3>
          {!cliente.servicios || cliente.servicios.length === 0 ? (
            <p className="muted">Este cliente no tiene servicios contratados.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Servicio</th>
                  <th>Fecha inicio</th>
                  <th>Última facturación</th>
                  <th>Último pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cliente.servicios.map((s) => (
                  <tr key={s.servicio}>
                    <td>{s.servicio}</td>
                    <td>{s.fechaInicio}</td>
                    <td>{s.ultimaFacturacion}</td>
                    <td>${s.ultimoPago.toLocaleString('es-CO')}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingServicio(s);
                          setError(null);
                          setSuccess(null);
                        }}
                      >
                        Editar
                      </button>{' '}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleEliminarServicio(s.servicio)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editingServicio && (
            <div
              className="card"
              style={{
                marginTop: '1.5rem',
                background: 'var(--color-bg)',
                boxShadow: 'none',
              }}
            >
              <h3>Editar servicio: {editingServicio.servicio}</h3>
              <ServicioForm
                key={`${editingServicio.identificacion}-${editingServicio.servicio}`}
                mode="edit"
                initialValues={editingServicio}
                lockClienteFields
                onSubmit={handleActualizarServicio}
                onCancel={() => setEditingServicio(null)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
