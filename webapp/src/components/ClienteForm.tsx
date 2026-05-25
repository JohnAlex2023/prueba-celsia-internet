import { useState, type FormEvent } from 'react';
import type { Cliente, TipoIdentificacion } from '../types';
import { useCatalogos } from '../hooks/useCatalogos';

interface Props {
  initialValues?: Partial<Cliente>;
  disableIdentificacion?: boolean;
  onSubmit: (cliente: Omit<Cliente, 'servicios'>) => Promise<void>;
  submitLabel?: string;
}

interface FieldErrors {
  [key: string]: string;
}

export function ClienteForm({
  initialValues = {},
  disableIdentificacion = false,
  onSubmit,
  submitLabel = 'Guardar',
}: Props) {
  const { catalogos, loading: catalogosLoading } = useCatalogos();

  const [form, setForm] = useState<Omit<Cliente, 'servicios'>>({
    identificacion: initialValues.identificacion ?? '',
    nombres: initialValues.nombres ?? '',
    apellidos: initialValues.apellidos ?? '',
    tipoIdentificacion: (initialValues.tipoIdentificacion ?? 'CC') as TipoIdentificacion,
    fechaNacimiento: initialValues.fechaNacimiento ?? '',
    numeroCelular: initialValues.numeroCelular ?? '',
    correoElectronico: initialValues.correoElectronico ?? '',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  // Validaciones cliente-side (refuerzan lo que valida el backend)
  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.identificacion.trim()) e.identificacion = 'La identificación es obligatoria';
    if (!form.nombres.trim()) e.nombres = 'Los nombres son obligatorios';
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios';
    if (!form.tipoIdentificacion) e.tipoIdentificacion = 'Seleccione un tipo';
    if (!form.fechaNacimiento) e.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    if (!form.numeroCelular.trim()) e.numeroCelular = 'El celular es obligatorio';
    else if (!/^[0-9+\-\s]{7,20}$/.test(form.numeroCelular))
      e.numeroCelular = 'Formato inválido';
    if (!form.correoElectronico.trim()) e.correoElectronico = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoElectronico))
      e.correoElectronico = 'Correo inválido';

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  if (catalogosLoading) return <p>Cargando catálogos…</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group">
          <label>Identificación *</label>
          <input
            type="text"
            value={form.identificacion}
            disabled={disableIdentificacion}
            maxLength={20}
            onChange={(e) => handleChange('identificacion', e.target.value)}
          />
          {errors.identificacion && (
            <span className="error-text">{errors.identificacion}</span>
          )}
        </div>

        <div className="form-group">
          <label>Tipo de identificación *</label>
          <select
            value={form.tipoIdentificacion}
            onChange={(e) =>
              handleChange('tipoIdentificacion', e.target.value)
            }
          >
            {catalogos?.tiposIdentificacion.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tipoIdentificacion && (
            <span className="error-text">{errors.tipoIdentificacion}</span>
          )}
        </div>

        <div className="form-group">
          <label>Nombres *</label>
          <input
            type="text"
            value={form.nombres}
            maxLength={80}
            onChange={(e) => handleChange('nombres', e.target.value)}
          />
          {errors.nombres && <span className="error-text">{errors.nombres}</span>}
        </div>

        <div className="form-group">
          <label>Apellidos *</label>
          <input
            type="text"
            value={form.apellidos}
            maxLength={80}
            onChange={(e) => handleChange('apellidos', e.target.value)}
          />
          {errors.apellidos && (
            <span className="error-text">{errors.apellidos}</span>
          )}
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento *</label>
          <input
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
          />
          {errors.fechaNacimiento && (
            <span className="error-text">{errors.fechaNacimiento}</span>
          )}
        </div>

        <div className="form-group">
          <label>Número celular *</label>
          <input
            type="text"
            value={form.numeroCelular}
            maxLength={20}
            onChange={(e) => handleChange('numeroCelular', e.target.value)}
          />
          {errors.numeroCelular && (
            <span className="error-text">{errors.numeroCelular}</span>
          )}
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Correo electrónico *</label>
          <input
            type="email"
            value={form.correoElectronico}
            maxLength={80}
            onChange={(e) => handleChange('correoElectronico', e.target.value)}
          />
          {errors.correoElectronico && (
            <span className="error-text">{errors.correoElectronico}</span>
          )}
        </div>
      </div>

      <div className="actions-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
