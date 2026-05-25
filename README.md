# Prueba Celsia Internet — Desarrollo y Operaciones Aplicaciones III
Solución completa de la prueba técnica: backend, frontend **Celsia Internet S.A.S.**

## Tabla de contenido

- [Stack tecnológico](#stack-tecnológico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Cómo ejecutar](#cómo-ejecutar)
- [Modelo de datos](#modelo-de-datos)
- [Git Flow](#git-flow)
- [Parte 2 — Prueba teórico-práctica](#parte-2--prueba-teórico-práctica)
- [Parte 3 — Redes](#parte-3--redes)

---

## Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | SPA moderna, tipado estricto, hot-reload |
| Backend | Node.js 20 + Express + TypeScript | Stack ampliamente adoptado, arquitectura limpia |
| ORM | TypeORM | Patrón Repository nativo, decoradores, migraciones |
| DB | MySQL 8 | Solicitado, motor maduro con buena integridad referencial |
| Contenedores | Docker + docker-compose | Despliegue reproducible |
| Servidor estático | Nginx (alpine) | Servir el bundle de producción |

## Estructura del repositorio

```
prueba-celsia-internet/
├── api/                    # Backend Node + Express + TypeORM
│   ├── src/
│   │   ├── config/         # DataSource (Singleton)
│   │   ├── entities/       # Cliente, Servicio
│   │   ├── repositories/   # Patrón Repository
│   │   ├── services/       # Lógica de negocio
│   │   ├── controllers/    # HTTP handlers
│   │   ├── routes/         # Rutas REST
│   │   ├── middlewares/    # Validaciones y manejo de errores
│   │   ├── dtos/           # Data Transfer Objects
│   │   └── server.ts
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── README.md
├── webapp/                 # Frontend React + Vite
│   ├── src/
│   │   ├── api/            # Cliente HTTP (axios)
│   │   ├── components/     # Reutilizables (Forms, Navbar, Alert)
│   │   ├── pages/          # Vistas conectadas a rutas
│   │   ├── hooks/          # Custom hooks
│   │   └── types/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── docker-compose.yml
│   └── README.md
├── assets/
│   └── diagrama.png        # Diagrama de componentes
├── docker-compose.yml      # Stack completo (DB + API + Webapp)
└── README.md               # Este archivo
```

## Cómo ejecutar

### Opción A — Stack completo (recomendado)

Desde la raíz del repositorio:

```bash
docker compose up --build
```

Esto levanta los 3 servicios:

| Servicio | Puerto | URL |
|---|---|---|
| Frontend (Nginx) | 8080 | http://localhost:8080 |
| Backend (Express) | 3000 | http://localhost:3000/api/v1 |
| MySQL | 3307 | `mysql://celsia:celsia123@localhost:3307/celsia_internet` |

### Opción B — Servicios por separado

Ver `api/README.md` y `webapp/README.md`.

## Modelo de datos

```sql
CREATE TABLE clientes (
  identificacion       VARCHAR(20) NOT NULL PRIMARY KEY,
  nombres              VARCHAR(80) NOT NULL,
  apellidos            VARCHAR(80) NOT NULL,
  tipoIdentificacion   VARCHAR(2)  NOT NULL,
  fechaNacimiento      DATE        NOT NULL,
  numeroCelular        VARCHAR(20) NOT NULL,
  correoElectronico    VARCHAR(80) NOT NULL
);

CREATE TABLE servicios (
  identificacion       VARCHAR(20) NOT NULL,
  servicio             VARCHAR(80) NOT NULL,
  fechaInicio          DATE        NOT NULL,
  ultimaFacturacion    DATE        NOT NULL,
  ultimoPago           INTEGER     NOT NULL DEFAULT 0,
  PRIMARY KEY (identificacion, servicio),
  CONSTRAINT servicios_FK1 FOREIGN KEY (identificacion)
    REFERENCES clientes(identificacion)
    ON UPDATE CASCADE ON DELETE NO ACTION
);
```

TypeORM crea estas tablas automáticamente con `synchronize: true` en el primer arranque. En un entorno productivo se usarían migraciones (`typeorm migration:run`).

## Git Flow

Estrategia de ramas solicitada:

```
main                          ← producción / versiones liberadas
└── develop                   ← integración continua
    └── <desarrollador>       ← rama personal de cada dev
```

Comandos para inicializar:

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git checkout -b develop
git checkout -b <tu-usuario>     # ej: git checkout -b jperez
git remote add origin https://github.com/<tu-usuario>/prueba-celsia-internet.git
git push -u origin <tu-usuario>
```

---

# Parte 2 — Prueba teórico-práctica

## 2.1. Diagrama de componentes

Ver `./assets/diagrama.png`.

![Diagrama de Componentes](./assets/diagrama.png)

**RTA:**


1. El usuario abre el navegador y usa el frontend React.
2. El frontend llama al backend Express por la API.
3. El backend guarda y consulta datos en MySQL en las tablas `clientes` y `servicios`.
4. Todo se despliega con Docker Compose: `webapp`, `api` y `mysql`.

En el backend separé responsabilidades en capas para que el código sea fácil de entender y mantener.

## 2.2. Mecanismos de seguridad

**RTA:**

En esta prueba no había login, así que la app quedó sin autenticación para no complicar el alcance. Lo que sí hice fue aplicar seguridad básica:

- Validación de entrada con `express-validator` para evitar datos vacíos o tipos inválidos.
- `helmet` en Express para agregar buenas cabeceras de seguridad.
- CORS limitado a los orígenes del frontend.
- React ayuda a evitar XSS porque no inyecta HTML sin control.


- Autenticación con JWT o una sesión mínima.
- Roles simples (por ejemplo, vendedor y administrador).
- HTTPS obligatorio.
- Variables sensibles en un gestor de secretos, no en el compose.
- Un usuario de base de datos con permisos mínimos, no `root`.
- No exponer MySQL hacia internet.
- Backups periódicos y protección extra para datos personales.

## 2.3. Estrategia de escalabilidad para 1,000,000 de clientes/año

**RTA:**

Para mí, la idea clave es dividir la carga en capas:

- La API debe ser stateless para poder correr varias instancias detrás de un balanceador.
- La base de datos puede manejar más lecturas si tiene réplicas de lectura.
- Los catálogos fijos se pueden cachear en memoria o en Redis.
- Las tareas que no necesitan respuesta inmediata se pueden sacar a una cola.

En un primer paso, yo recomendaría:

- 2 o 3 réplicas del API.
- MySQL con réplica de lectura.
- Cache para datos que casi no cambian.

Luego, si crece más:

- aumentar réplicas del API,
- usar caché en consultas por identificación,
- archivar servicios antiguos o cancelados.

Si llegara a ser muy grande, consideraría particionar tablas y monitorear consultas lentas.

## 2.4. Patrones de diseño recomendados

**RTA:**

En este proyecto usé patrones básicos porque me ayudan a escribir código ordenado:

- **Repository:** para separar el acceso a datos de la lógica de negocio.
- **Service Layer:** para tener la lógica en un solo lugar y no mezclarla con HTTP.
- **DTO:** para definir claramente qué datos entran y salen del API.
- **Adapter:** en el frontend uso un cliente HTTP que oculta axios al resto de la app.
- **Singleton:** en el `AppDataSource` del backend hay una sola conexión/pool.
- **Middleware:** en Express uso validación y manejo de errores antes del controller.

Creo que estos patrones son suficientes para esta prueba y ayudan a que el código sea más fácil de cambiar después.

## 2.5. Optimización del manejo y persistencia de datos (alta transaccionalidad)

**RTA:**

Pienso que esta app debe ser clara en la base de datos y en las operaciones.

- El modelo está normalizado: `clientes` y `servicios` separados con FK.
- La tabla `servicios` usa PK compuesta para evitar duplicados.
- Uso `DATE` e `INT` donde corresponde.
- Las operaciones que tocan varias tablas deben ir en transacciones cortas.
- Un pool de conexiones bien configurado evita saturar MySQL.
- Para consultas frecuentes, sería bueno cachear los resultados.
- También es importante activar slow query log y revisar los `EXPLAIN` cuando algo ande lento.
- Si se acumulan muchos datos viejos, se pueden archivar en tablas aparte.

En resumen: base de datos ordenada, validación, control de duplicados, caché para lecturas y monitoreo.

---

# Parte 3 — Redes

## 3.1. Diferencia entre router y switch. ¿Cuándo usarías cada uno?

**RTA:**

Un **switch** conecta equipos dentro de la misma red local. Trabaja con direcciones MAC y es útil para conectar PCs, impresoras y servidores en la misma oficina.

Un **router** conecta redes diferentes. Trabaja con direcciones IP y sirve para unir la LAN con internet o separar subredes.

Normalmente en una red uso switch para el interior y router para la salida hacia otras redes o internet.

## 3.2. Las siete capas del modelo OSI

**RTA:**

El modelo OSI divide la comunicación en 7 capas. De abajo hacia arriba:

| # | Capa | Para qué sirve | Ejemplos |
|---|------|----------------|----------|
| 1 | Física | Cable y señales | UTP, fibra óptica |
| 2 | Enlace | Conecta equipos en la LAN | Ethernet, MAC |
| 3 | Red | Enruta paquetes | IP |
| 4 | Transporte | Manda datos confiables o rápidos | TCP, UDP |
| 5 | Sesión | Mantiene la conexión entre apps | Sesiones |
| 6 | Presentación | Formato y cifrado | TLS, JSON |
| 7 | Aplicación | Lo que usa el usuario | HTTP, DNS |



## 3.3. Diferencias entre TCP y UDP. Ejemplos de cuándo usar cada uno

**RTA:**

**TCP** es confiable y ordenado. Si hay pérdida de datos, se retransmite. Lo usaría para esta app (HTTP/HTTPS), MySQL y transferencias donde no se puede perder información.

**UDP** es más rápido pero no garantiza entrega ni orden. Sirve para streaming, llamadas en vivo o juegos, donde es mejor recibir algo rápido aunque se pierdan paquetes.

Así que mi regla práctica es: si necesito seguridad, TCP; si necesito velocidad, UDP.

## 3.4. ¿Qué es una máscara de subred y cómo se utiliza para dividir una red en subredes más pequeñas?

**RTA:**

La máscara de subred indica qué parte de la IP es la red y qué parte es el host. Por ejemplo, `192.168.1.45/24` significa que la red es `192.168.1.0`.

Para dividir una red grande se usan máscaras más largas, como pasar de `/24` a `/26`. Eso crea redes más pequeñas y ayuda a separar áreas como ventas, TI o administración.

## 3.5. Protocolos de enrutamiento dinámico

**RTA:**

Los protocolos dinámicos permiten que los routers aprendan rutas solos.

- **RIP:** sencillo y fácil, pero lento para redes grandes.
- **OSPF:** más usado en empresas, funciona bien con topologías más grandes.
- **EIGRP:** típico de Cisco, converge rápido.
- **BGP:** se usa entre proveedores de internet.

Para una empresa como Celsia yo diría que OSPF es buena opción dentro de la red propia y BGP para conectarse con otros ISPs.

---

## Autor

Desarrollado como prueba técnica para **Celsia Internet S.A.S.**

> *El objetivo de esta prueba es evaluar conocimiento, capacidad de adaptabilidad y habilidad para resolver problemas.*
