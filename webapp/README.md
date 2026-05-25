# Celsia Internet — Web App

Frontend SPA para la gestión de clientes y servicios de internet.

## Stack

- **React 18** + **TypeScript**
- **Vite** como bundler
- **React Router 6** para navegación
- **Axios** para llamadas HTTP
- **Nginx** para servir el build en producción
- **Docker** multi-stage build

## Funcionalidades

- **Listado** de clientes registrados con acciones de editar/eliminar.
- **Registrar nuevo cliente** con validaciones en vivo (campos vacíos, formato de correo, tipo de identificación).
- **Editar cliente** existente (la identificación queda inmutable).
- **Contratar servicio** asociándolo a un cliente existente (valida integridad referencial vía API).
- **Consultar por identificación**: muestra los datos del cliente y todos sus servicios contratados, con opción de editar o cancelar servicios.

## Patrones de diseño aplicados

| Patrón | Dónde | Beneficio |
|---|---|---|
| **Container/Presentational** | `pages/` vs `components/` | Separa lógica de estado del renderizado. |
| **Custom Hooks** | `hooks/useCatalogos.ts` | Reusa lógica de carga de catálogos. |
| **Adapter** | `api/client.ts` | Encapsula axios; el resto del código no depende de la librería HTTP. |
| **Module pattern** | `clientesApi`, `serviciosApi` | Agrupa endpoints relacionados en objetos cohesivos. |
| **Composition** | formularios reutilizables | `ClienteForm` se usa tanto en crear como editar. |

## Estructura

```
webapp/
├── src/
│   ├── api/           # Cliente HTTP (axios)
│   ├── components/    # Componentes reutilizables (Alert, Navbar, Forms)
│   ├── pages/         # Vistas conectadas a rutas
│   ├── hooks/         # Custom hooks
│   ├── types/         # Tipos TypeScript compartidos
│   ├── App.tsx        # Routing
│   ├── main.tsx       # Entry point
│   └── index.css      # Estilos globales
├── public/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Rutas de la aplicación

| Ruta | Descripción |
|---|---|
| `/` | Lista de clientes |
| `/clientes/nuevo` | Formulario de registro |
| `/clientes/:id/editar` | Edición de cliente existente |
| `/servicios/contratar` | Contratar un servicio para un cliente |
| `/consultar` | Búsqueda por número de identificación |

## Ejecución

### Con Docker (recomendado)

Desde la carpeta `webapp/` (la API debe estar corriendo primero):

```bash
docker compose up --build
```

App disponible en: **http://localhost:8080**

### Local (sin Docker)

```bash
cp .env.example .env
npm install
npm run dev
```

App disponible en: **http://localhost:5173**

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api/v1` | URL base del backend |

## Build de producción

El `Dockerfile` hace un build multi-stage:
1. **Stage builder**: `node:20-alpine` compila TypeScript y genera bundle con Vite.
2. **Stage runtime**: `nginx:1.27-alpine` sirve los assets estáticos con:
   - Compresión gzip
   - Cache de 1 año para assets con hash
   - Fallback SPA al `index.html` para rutas client-side
   - Cabeceras de seguridad (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)

## Validaciones

Validaciones cliente-side (UX inmediato) + server-side (autoridad):

- Campos obligatorios no pueden quedar vacíos.
- Email con formato válido.
- Celular: solo dígitos, espacios, `+`, `-`.
- Tipos de identificación y servicio restringidos a los valores del catálogo.
- Si la API responde `409 Conflict` con `"El registro ya existe"`, el mensaje se muestra al usuario.
