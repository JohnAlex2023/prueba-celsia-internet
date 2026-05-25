import { useState, type FormEvent } from 'react';
import type { Servicio, TipoServicio } from '../types';
import { useCatalogos } from '../hooks/useCatalogos';

interface Props {
  mode?: 'create' | 'edit';
  initialValues?: Partial<Servicio>;
  initialIdentificacion?: string;
  lockClienteFields?: boolean;
  onSubmit: (servicio: Servicio) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

interface FieldErrors {
  [key: string]: string;
}

function buildInitialForm(
  initialValues: Partial<Servicio> | undefined,
  initialIdentificacion: string | undefined,
): Servicio {
  return {
    identificacion: initialValues?.identificacion ?? initialIdentificacion ?? '',
    servicio: (initialValues?.servicio ?? 'Internet 200 MB') as TipoServicio,
    fechaInicio: initialValues?.fechaInicio ?? '',
    ultimaFacturacion: initialValues?.ultimaFacturacion ?? '',
    ultimoPago: initialValues?.ultimoPago ?? 0,
  };
}

export function ServicioForm({
  mode = 'create',
  initialValues,
  initialIdentificacion,
  lockClienteFields = false,
  onSubmit,
  onCancel,
  submitLabel,
}: Props) {
  const { catalogos, loading } = useCatalogos();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState<Servicio>(() =>
    buildInitialForm(initialValues, initialIdentificacion),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const buttonLabel =
    submitLabel ?? (isEdit ? 'Guardar cambios' : 'Contratar servicio');
  const pendingLabel = isEdit ? 'Guardando…' : 'Contratando…';

  function handleChange<K extends keyof Servicio>(field: K, value: Servicio[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.identificacion.trim())
      e.identificacion = 'La identificación es obligatoria';
    if (!form.servicio) e.servicio = 'Seleccione un servicio';
    if (!form.fechaInicio) e.fechaInicio = 'La fecha de inicio es obligatoria';
    if (!form.ultimaFacturacion)
      e.ultimaFacturacion = 'La última facturación es obligatoria';
    if (form.ultimoPago < 0) e.ultimoPago = 'El monto no puede ser negativo';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (!isEdit) {
        setForm((prev) => ({
          ...prev,
          servicio: 'Internet 200 MB' as TipoServicio,
          fechaInicio: '',
          ultimaFacturacion: '',
          ultimoPago: 0,
        }));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Cargando catálogos…</p>;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-group">
          <label>Identificación del cliente *</label>
          <input
            type="text"
            value={form.identificacion}
            maxLength={20}
            disabled={lockClienteFields}
            onChange={(e) => handleChange('identificacion', e.target.value)}
          />
          {errors.identificacion && (
            <span className="error-text">{errors.identificacion}</span>
          )}
        </div>

        <div className="form-group">
          <label>Servicio *</label>
          <select
            value={form.servicio}
            disabled={lockClienteFields}
            onChange={(e) =>
              handleChange('servicio', e.target.value as TipoServicio)
            }
          >
            {catalogos?.tiposServicio.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.servicio && <span className="error-text">{errors.servicio}</span>}
        </div>

        <div className="form-group">
          <label>Fecha de inicio *</label>
          <input
            type="date"
            value={form.fechaInicio}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
          />
          {errors.fechaInicio && (
            <span className="error-text">{errors.fechaInicio}</span>
          )}
        </div>

        <div className="form-group">
          <label>Última facturación *</label>
          <input
            type="date"
            value={form.ultimaFacturacion}
            onChange={(e) => handleChange('ultimaFacturacion', e.target.value)}
          />
          {errors.ultimaFacturacion && (
            <span className="error-text">{errors.ultimaFacturacion}</span>
          )}
        </div>

        <div className="form-group">
          <label>Último pago (COP)</label>
          <input
            type="number"
            min={0}
            value={form.ultimoPago}
            onChange={(e) =>
              handleChange('ultimoPago', parseInt(e.target.value || '0', 10))
            }
          />
          {errors.ultimoPago && (
            <span className="error-text">{errors.ultimoPago}</span>
          )}
        </div>
      </div>

      <div className="actions-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? pendingLabel : buttonLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            disabled={submitting}
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
