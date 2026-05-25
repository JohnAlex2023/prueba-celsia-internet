import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clientesApi } from '../api/client';
import type { Cliente } from '../types';
import { Alert } from '../components/Alert';

export function ClientesListPage() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function cargar() {
    setLoading(true);
    setError(null);
    try {
      const data = await clientesApi.listar();
      setClientes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function handleEliminar(identificacion: string) {
    if (!window.confirm(`¿Eliminar el cliente ${identificacion}?`)) return;
    try {
      await clientesApi.eliminar(identificacion);
      await cargar();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="card">
      <h2>Clientes registrados</h2>
      {error && <Alert type="error">{error}</Alert>}

      {loading ? (
        <p>Cargando…</p>
      ) : clientes.length === 0 ? (
        <div className="empty-state">
          <p>No hay clientes registrados.</p>
          <Link className="btn btn-primary" to="/clientes/nuevo">
            Crear el primero
          </Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Tipo</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Celular</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.identificacion}>
                <td>{c.identificacion}</td>
                <td>
                  <span className="badge">{c.tipoIdentificacion}</span>
                </td>
                <td>{c.nombres}</td>
                <td>{c.apellidos}</td>
                <td>{c.numeroCelular}</td>
                <td>{c.correoElectronico}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/clientes/${c.identificacion}/editar`)
                    }
                  >
                    Editar
                  </button>{' '}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminar(c.identificacion)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
