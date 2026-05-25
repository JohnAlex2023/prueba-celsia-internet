# 1. PRUEBA TÉCNICA DESARROLLO

## DESCRIPCIÓN DEL PROBLEMA

La empresa Celsia Internet S.A.S. requiere implementar una solución para su proceso de venta que permita la captura de información de los clientes y la contratación de uno o varios servicios del portafolio de internet.

El ejercicio consiste en implementar un backend y frontend con su configuración de despliegue en contenedores, para el registro y consulta de la información de los servicios contratados por los clientes, de acuerdo con el modelo de datos presentado a continuación.
## MODELO DE DATOS

Las tablas donde se almacena la información son las siguientes:

```console
CREATE TABLE clientes {
  identificacion VARCHAR(20) NOT NUL PRIMARY KEY,
  nombres VARCHAR(80) NOT NULL,
  apellidos VARCHAR(80) NOT NULL,
  tipoIdentificacion VARCHAR(2) NOT NULL,
  fechaNacimiento DATE NOT NULL,
  numeroCelular VARCHAR(20) NOT NULL,
  correoElectronico VARCHAR(80) NOT NULL
};


CREATE TABLE servicios {
  identificacion VARCHAR(20) NOT NUL,
  servicio VARCHAR(80) NOT NUL,
  fechaInicio DATE NOT NULL,
  ultimaFacturacion DATE NOT NULL,
  ultimoPago INTEGER NOT NUL DEFAULT 0,
  PRIMARY KEY (identificacion, servicio),
  CONSTRAINT servicios_FK1 FOREING KEY (identificacion) REFERENCES clientes(identificacion) ON UPDATE CASCADE ON DELETE NO ACTION
}
```

Para la prueba se deben crear las tablas en el motor de base de datos de su preferencia. Sobre esta base se deben almacenar los registros de los clientes y servicios que se especifican para la prueba.

## Puntos de la prueba

1.1. Implemente en el lenguaje de su preferencia, una `CRUD (Create, Read, Update and Delete)` que permita capturar y administrar la información de los clientes y sus servicios.

1.2. Se deben realizar las siguientes validaciones:

- No dejar datos en blanco.
- El tipo de dato, de acuerdo con la estructura en la base de datos.
- Si el registro ya existe muestre el mensaje `“El registro ya existe”`.

  1.3. Implementar un formulario que permita registrar los servicios contratados de los clientes. `Nota: Tener en cuenta integridad referencial.`

  1.4. Implementar un formulario para la consulta por número de identificación, la información de un cliente y los servicios que tiene contratados.

TIPS:

a. Para el campo `tipoIdentificacion` ingresar solamente los siguientes valores:

- CEDULA → CC
- TARJETA IDENTIDAD → TI
- CEDULA EXTRANJERIA → CE
- REGISTRO CIVIL → RC

b. Para el campo `servicio` ingresar solamente los siguientes tipos:

- Internet 200 MB
- Internet 400 MB
- Internet 600 MB
- Directv Go
- Paramount+
- Win+

c. Se evaluará el uso de patrones de diseño, en backend y frontend, la configuración de despliegue en contenedores y de la imagen a desplegar.

d. En el docker-compose se debe incluir la configuración del servicio de base de datos que haya escogido y una política de manejo de logs para cada servicio.

## ENTREGABLE

Se espera como resultado un clone del repositorio `https://github.com/celsia-internet/pruebas.git`, con la siguiente estructura.

```
api/
|-- docker-compose.yml
|-- Dockerfile
|-- README.md
|-- ...
webapp/
|-- docker-compose.yml
|-- Dockerfile
|-- README.md
|-- ...
```

El repositorio de la prueba deberá estar publicado en `github` de manera pública con el nombre `prueba-celsia-internet` usando git-flow por desarrollador.

```
main/
|-- develop
||-- <desarrollador>
```

# 2. PRUEBA TEORICO-PRACTICA

Para el desarrollo de la prueba teórica, tendrás que escribir tus respuestas en el archivo README.md del repositorio, tomando como referencia la aplicación desarrollada en la `PRUEBA TÉCNICA DE DESARROLLO`.

## PREGUNTAS

 2.1. Elabore un diagrama de componentes de la aplicación. Debe cargar el archivo en la siguiente ruta del repositorio: `./assets/diagrama.png`


**RTA:**
<img src="./assets/diagrama.png" alt="Diagrama" width="400">

1. El usuario abre el navegador y usa el frontend React.
2. El frontend llama al backend Express por la API.
3. El backend guarda y consulta datos en MySQL en las tablas `clientes` y `servicios`.
4. Todo se despliega con Docker Compose: `webapp`, `api` y `mysql`.

En el backend separé responsabilidades en capas para que el código sea fácil de entender y mantener.

 2.2. ¿Qué mecanismos de seguridad incluirías en la aplicación para garantizar la protección del acceso a los datos?

- RTA: 

En esta prueba no había login, así que la app quedó sin autenticación para no complicar el alcance. Lo que sí hice fue aplicar seguridad básica:

- Validación de entrada con `express-validator` para evitar datos vacíos o tipos inválidos.
- `helmet` en Express para agregar buenas cabeceras de seguridad.
- CORS limitado a los orígenes del frontend.
- React ayuda a evitar XSS porque no inyecta HTML sin control.

  2.2. ¿Qué mecanismos de seguridad incluirías en la aplicación para garantizar la protección del acceso a los datos?
- RTA:

Para proteger el acceso a los datos implementaría autenticación y autorización usando JWT, permitiendo validar la identidad de los usuarios antes de acceder a la aplicación. También aplicaría validaciones de datos tanto en frontend como backend para evitar datos inválidos o ataques de inyección SQL. Las contraseñas se almacenarían cifradas usando bcrypt y la comunicación entre cliente y servidor se realizaría mediante HTTPS. Adicionalmente, limitaría el acceso a la base de datos únicamente desde el backend y configuraría variables de entorno para proteger información sensible como credenciales y claves secretas.

 2.3. ¿Qué estrategia de escalabilidad recomendarías para la aplicación considerando que el crecimiento proyectado será de 1,000,000 de clientes por año?

- RTA:

Para soportar un crecimiento de 1,000,000 de clientes por año recomendaría una arquitectura escalable basada en contenedores usando Docker. Inicialmente podría manejarse como un monolito bien estructurado, pero preparado para evolucionar a microservicios si el volumen aumenta.

Para mí, la idea clave es dividir la carga en capas:

- La API debe ser stateless para poder correr varias instancias detrás de un balanceador.
- La base de datos puede manejar más lecturas si tiene réplicas de lectura.
- Los catálogos fijos se pueden cachear en memoria o en Redis.
- Las tareas que no necesitan respuesta inmediata se pueden sacar a una cola.

Con esta estrategia, la aplicación puede crecer horizontalmente agregando más instancias de backend y escalando la base de datos según sea necesario. Además, el uso de contenedores facilita el despliegue y la gestión de la infraestructura a medida que la demanda aumenta.

 2.4. ¿Qué patrón o patrones de diseño recomendarías para esta solución y cómo se implementarían? (Justifique)

- RTA:

Para esta solución usaría principalmente el patrón MVC (Modelo-Vista-Controlador). Este patrón permite separar la lógica de negocio, la interfaz de usuario y el acceso a datos, haciendo la aplicación más organizada y fácil de mantener. El modelo manejaría la interacción con la base de datos, el controlador procesaría las peticiones y reglas del negocio, y la vista mostraría la información al usuario.

También implementaría el patrón Repository en el backend para desacoplar la lógica de acceso a datos. De esta forma, si en un futuro cambia el motor de base de datos, la lógica principal de la aplicación no tendría grandes modificaciones.

En este proyecto usé patrones básicos porque me ayudan a escribir código ordenado:

- Repository: para separar el acceso a datos de la lógica de negocio.
- Service Layer: para tener la lógica en un solo lugar y no mezclarla con HTTP.
- Adapter: en el frontend uso un cliente HTTP que oculta axios al resto de la app.
- Singleton: en el `AppDataSource` del backend hay una sola conexión/pool.
- Middleware: en Express uso validación y manejo de errores antes del controller.

Creo que estos patrones son suficientes para esta prueba y ayudan a que el código sea más fácil de cambiar después.

  2.5. ¿Qué recomendaciones harías para optimizar el manejo y la persistencia de datos de la aplicación, teniendo en cuenta que esta aplicación tiene una alta transaccionalidad?

- RTA:

Pienso que esta app debe ser clara en la base de datos y en las operaciones.

- El modelo está normalizado: clientes y servicios separados con FK.
- La tabla servicios usa PK compuesta para evitar duplicados.
- Uso DATE e INT donde corresponde.
- Las operaciones que tocan varias tablas deben ir en transacciones cortas.
- Un pool de conexiones bien configurado evita saturar MySQL.
- Para consultas frecuentes, sería bueno cachear los resultados.
- También es importante activar slow query log y revisar los EXPLAIN cuando algo ande lento.
- Si se acumulan muchos datos viejos, se pueden archivar en tablas aparte.

En resumen: base de datos ordenada, validación, control de duplicados, caché para lecturas y monitoreo.

---

# Parte 3 — Redes

 3.1. Explica la diferencia entre un router y un switch. ¿Cuándo usarías cada uno?

- RTA:
Un switch se utiliza para conectar dispositivos dentro de una misma red local, por ejemplo computadores, impresoras o servidores en una oficina. Su función principal es enviar datos entre equipos usando direcciones MAC.

Por otro lado, un router se usa para conectar diferentes redes entre sí, por ejemplo una red local con internet. El router trabaja con direcciones IP y decide cuál es la mejor ruta para enviar la información. Usaría un switch para comunicación interna dentro de una LAN y un router cuando necesite comunicación entre redes diferentes.

  3.2. Describe las siete capas del modelo OSI y menciona brevemente la función principal de cada una

- RTA:
El modelo OSI está compuesto por siete capas:

Capa Física: transmite bits a través del medio físico como cables o señales inalámbricas.

Capa de Enlace de Datos: organiza la transmisión de datos entre dispositivos de la misma red y maneja direcciones MAC.

Capa de Red: administra direcciones IP y el enrutamiento de paquetes.

Capa de Transporte: garantiza la entrega correcta de datos mediante protocolos como TCP y UDP.

Capa de Sesión: administra la apertura, mantenimiento y cierre de conexiones.

Capa de Presentación: traduce, comprime o cifra la información para que pueda ser entendida.

Capa de Aplicación: permite la interacción directa entre aplicaciones y usuarios mediante servicios como HTTP, FTP o SMTP.


  3.3. Explica las diferencias entre los protocolos TCP y UDP. Dar un ejemplo de cuándo usarías cada uno?

- RTA:
TCP es un protocolo orientado a conexión, lo que significa que verifica la entrega correcta de los datos y garantiza confiabilidad. Es más seguro para aplicaciones donde perder información no es aceptable. Un ejemplo de uso sería una aplicación bancaria o una página web.

UDP es un protocolo más rápido porque no verifica si todos los datos llegaron correctamente. Se usa en aplicaciones donde la velocidad es más importante que la confiabilidad total. Un ejemplo sería streaming de video, videojuegos en línea o videollamadas.

  3.4. ¿Qué es una máscara de subred y cómo se utiliza para dividir una red en subredes más pequeñas?

- RTA:
Una máscara de subred es un valor que permite identificar qué parte de una dirección IP pertenece a la red y qué parte pertenece a los hosts. Se utiliza para dividir una red grande en varias subredes más pequeñas, facilitando una mejor administración, organización y aprovechamiento de direcciones IP.

Por ejemplo, una red puede dividirse por departamentos o áreas de una empresa para reducir tráfico y mejorar seguridad dentro de la infraestructura.

  3.5. ¿Puedes mencionar algunos protocolos de enrutamiento dinámico y explicar brevemente cómo funcionan?

- RTA:
Algunos protocolos de enrutamiento dinámico son RIP, OSPF y EIGRP.

RIP selecciona rutas usando la cantidad de saltos como métrica, siendo sencillo pero limitado en redes grandes. OSPF calcula la mejor ruta usando el costo del enlace y tiene mejor rendimiento en infraestructuras grandes y complejas. EIGRP combina velocidad y eficiencia, calculando rutas óptimas y permitiendo convergencia rápida.

Estos protocolos permiten que los routers compartan automáticamente información de rutas sin necesidad de configurar manualmente cada camino de la red.

### Por último, y no menos importante, te deseamos mucha suerte y esperamos que disfrutes haciendo la prueba. El objetivo es evaluar tu conocimiento, capacidad de adaptabilidad y habilidad para resolver problemas.
