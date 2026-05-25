# Celsia Internet — API

Backend REST para la gestión de clientes y servicios de internet contratados.

## Stack

- **Node.js 20** + **TypeScript**
- **Express** como framework HTTP
- **TypeORM** + **MySQL 8** como capa de persistencia
- **express-validator** para validación declarativa
- **helmet**, **cors**, **morgan** para seguridad y observabilidad
- **Docker** + **docker-compose**

## Arquitectura

Arquitectura en capas con responsabilidades claramente separadas:

```
HTTP request
   ↓
Routes        ← define endpoints y compone middlewares
   ↓
Middlewares   ← validación, manejo de errores
   ↓
Controllers   ← orquestan request/response
   ↓
Services      ← lógica de negocio (reglas, integridad)
   ↓
Repositories  ← acceso a datos (patrón Repository)
   ↓
Entities      ← modelos TypeORM
   ↓
MySQL
```

### Patrones de diseño aplicados

| Patrón | Dónde | Beneficio |
|---|---|---|
| **Repository** | `repositories/` | Aísla persistencia del dominio. Permite mockear DB en tests. |
| **Service Layer** | `services/` | Centraliza lógica de negocio; controllers quedan delgados. |
| **DTO (Data Transfer Object)** | `dtos/` | Contrato explícito de entrada/salida del API. |
| **Dependency Injection** | constructores de Service/Controller | Permite inyectar implementaciones (testing, swap de DB). |
| **Singleton** | `AppDataSource` | Una sola conexión a DB compartida en todo el proceso. |
| **Adapter / Facade** | error handler, validators | Normaliza errores de fuentes diversas en una respuesta única. |
| **Chain of Responsibility** | middlewares Express | Pipeline de validación → controller → error handler. |

## Estructura

```
api/
├── src/
│   ├── config/           # DataSource (Singleton)
│   ├── entities/         # Cliente, Servicio (TypeORM)
│   ├── repositories/     # ClienteRepository, ServicioRepository
│   ├── services/         # Lógica de negocio
│   ├── controllers/      # Handlers HTTP
│   ├── routes/           # Definición de rutas
│   ├── middlewares/      # errorHandler, validators
│   ├── dtos/             # Tipos de entrada
│   ├── utils/            # AppError, constants
│   └── server.ts         # Bootstrap
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

## Endpoints

Base URL: `http://localhost:3000/api/v1`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Healthcheck |
| GET | `/catalogos` | Tipos de identificación y servicio válidos |
| GET | `/clientes` | Lista todos los clientes |
| GET | `/clientes/:id` | Obtiene cliente con sus servicios |
| POST | `/clientes` | Crea cliente |
| PUT | `/clientes/:id` | Actualiza cliente |
| DELETE | `/clientes/:id` | Elimina cliente |
| GET | `/servicios/:id` | Lista servicios contratados por un cliente |
| POST | `/servicios` | Contrata un servicio para un cliente existente |
| PUT | `/servicios/:id/:servicio` | Actualiza un servicio contratado |
| DELETE | `/servicios/:id/:servicio` | Cancela un servicio |

### Ejemplos

**Crear cliente:**
```bash
curl -X POST http://localhost:3000/api/v1/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "identificacion": "1088123456",
    "nombres": "Juan Carlos",
    "apellidos": "Pérez Gómez",
    "tipoIdentificacion": "CC",
    "fechaNacimiento": "1990-05-15",
    "numeroCelular": "3001234567",
    "correoElectronico": "juan@example.com"
  }'
```

**Contratar servicio:**
```bash
curl -X POST http://localhost:3000/api/v1/servicios \
  -H "Content-Type: application/json" \
  -d '{
    "identificacion": "1088123456",
    "servicio": "Internet 400 MB",
    "fechaInicio": "2026-01-15",
    "ultimaFacturacion": "2026-05-15",
    "ultimoPago": 89900
  }'
```

**Consultar cliente con servicios:**
```bash
curl http://localhost:3000/api/v1/clientes/1088123456
```

## Validaciones implementadas

- Ningún campo puede quedar en blanco.
- `tipoIdentificacion` ∈ {CC, TI, CE, RC}.
- `servicio` ∈ {Internet 200 MB, Internet 400 MB, Internet 600 MB, Directv Go, Paramount+, Win+}.
- `fechaNacimiento`, `fechaInicio`, `ultimaFacturacion` en formato ISO 8601 (`YYYY-MM-DD`).
- `correoElectronico` con formato de email válido.
- `numeroCelular` solo dígitos, espacios, `+` y `-`.
- Si el cliente o servicio ya existe → respuesta **409 Conflict** con mensaje `"El registro ya existe"`.
- Si se contrata un servicio para un cliente inexistente → **404 Not Found** (integridad referencial).
- Si se elimina un cliente con servicios contratados → **409 Conflict** con mensaje indicando que debe cancelar los servicios primero.

## Ejecución

### Con Docker (recomendado)

Desde la carpeta `api/`:

```bash
docker compose up --build
```

Esto levanta MySQL + API. Probar:

```bash
curl http://localhost:3000/api/v1/health
```

### Local (sin Docker)

```bash
cp .env.example .env
# Editar .env con credenciales de tu MySQL local
npm install
npm run dev
```

## Política de logs

`docker-compose.yml` usa el driver `json-file` con:
- `max-size: 10m` por archivo
- `max-file: 5` (rotación automática)
- Labels `service` para identificar logs por servicio

Esto evita que los contenedores llenen el disco en producción.

## Healthchecks

- **MySQL**: `mysqladmin ping` cada 10s
- **API**: `wget --spider http://localhost:3000/api/v1/health` cada 30s

`depends_on.condition: service_healthy` asegura que el API solo arranque cuando MySQL esté listo.
