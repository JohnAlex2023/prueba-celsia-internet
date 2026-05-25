import { useEffect, useState } from 'react';
import { catalogosApi, type Catalogos } from '../api/client';

export function useCatalogos() {
  const [catalogos, setCatalogos] = useState<Catalogos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    catalogosApi
      .obtener()
      .then(setCatalogos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { catalogos, loading, error };
}
