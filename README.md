# MiTienda

Tienda de tecnología y gaming con React, Spring Boot, una base de datos relacional y autenticación JWT. Conserva el diseño oscuro y los acentos verde lima del proyecto.

## Ejecutar en tu equipo

Extrae el ZIP completo. Instala [Node.js 24 o superior](https://nodejs.org/).

En Windows puedes abrir **INICIAR_TIENDA.cmd**. Instala las dependencias, prepara Java 21 portátil si hace falta e inicia la tienda y el backend. La primera ejecución necesita Internet y puede tardar varios minutos. Mantén la ventana abierta mientras revisas el proyecto.

Desde Visual Studio Code:

```sh
npm ci
npm run dev:full
```

En macOS y Linux instala también un JDK 21 o superior y ejecuta `sh iniciar.sh`. Maven se descarga mediante el wrapper incluido, sin instalarlo globalmente.

| Recurso | Dirección local |
| --- | --- |
| Tienda durante el desarrollo | http://127.0.0.1:5173/ |
| Swagger con los endpoints | http://127.0.0.1:8080/swagger-ui.html |
| Especificación OpenAPI | http://127.0.0.1:8080/v3/api-docs |
| Estado del backend | http://127.0.0.1:8080/api/health |

`npm run dev` inicia solamente React. Para trabajar por separado, abre otra terminal con `npm run backend`. El proxy de Vite conecta `/api` al puerto 8080. Usa siempre el mismo nombre de host para conservar las cookies de sesión.

## Cuentas de demostración

Se crean únicamente si la base de datos está vacía y `SEED_DEMO=true`, que es el valor local predeterminado.

| Rol | Correo | Contraseña local |
| --- | --- | --- |
| Administrador | admin@duoc.cl | Admin123! |
| Cliente | cliente@duoc.cl | Cliente123! |
| Vendedor | vendedor@duoc.cl | Vendedor123! |

El administrador gestiona todo el panel. El vendedor gestiona productos y estados de pedidos y consulta su perfil. El cliente compra y consulta sus propios pedidos. El registro público siempre crea clientes.

El pago es una simulación: tarjeta aprobada `4242 4242 4242 4242`, rechazada `4000 0000 0000 0002`, vencimiento futuro como `12/30`, titular ficticio y CVV `123`. No introduzcas tarjetas reales. No se realizan cobros, correos ni envíos reales.

## Datos y seguridad

H2 guarda los datos en `backend/data/mitienda.mv.db`. Flyway crea el esquema y JPA verifica su estructura. Los precios, totales y stock se resuelven en el servidor dentro de transacciones. Las cancelaciones reponen stock una sola vez y cada confirmación lleva una clave de idempotencia.

Las contraseñas se guardan como hashes BCrypt. El JWT de acceso dura 10 minutos y vive solamente en memoria. La sesión se restaura con una cookie de renovación HttpOnly y SameSite Strict; el servidor guarda únicamente su hash, la rota y permite revocarla. El frontend obtiene un token CSRF vigente antes de enviar formularios. En el navegador solo persisten las líneas del carrito, sin precios ni credenciales.

La clave de firma local se genera en `backend/data/jwt.key`. La base, la clave, `.env`, las herramientas descargadas y las dependencias están excluidas de Git y del ZIP. La configuración HTTP local usa `COOKIE_SECURE=false`; para publicar se requiere HTTPS, `COOKIE_SECURE=true`, un secreto propio de al menos 32 bytes, orígenes explícitos y cuentas de demostración deshabilitadas.

## PostgreSQL opcional

La demostración funciona con H2 sin configurar nada. También se incluye el perfil `postgres` y `compose.yml` para una base PostgreSQL local. Docker es opcional. La validación automatizada de esta entrega se ejecutó sobre H2; la configuración PostgreSQL debe comprobarse en el entorno donde se use.

1. Copia `.env.example` a `.env` y reemplaza las claves de ejemplo.
2. Ejecuta `docker compose up -d`.
3. En PowerShell establece `$env:SPRING_PROFILES_ACTIVE='postgres'` y ejecuta `node --env-file=.env scripts/backend.mjs run`.
4. En otra terminal ejecuta `npm run dev`.

En bash el paso 3 es `SPRING_PROFILES_ACTIVE=postgres node --env-file=.env scripts/backend.mjs run`. El perfil no cambia ni convierte la base H2 existente. Cada base conserva sus propios datos.

## Compilar y probar

```sh
npm test
npm run test:coverage
npm run test:backend
npm run build:full
```

Vitest y React Testing Library prueban las funciones, componentes y contextos del frontend. Cada `.test.jsx` está en la misma carpeta que el componente. La suite Java usa JUnit, Spring Boot Test, MockMvc y H2 real para comprobar REST, JWT, roles, transacciones y concurrencia. JaCoCo genera la cobertura en `backend/target/site/jacoco/index.html`.

Detén el backend antes de compilar el JAR en Windows, para que no bloquee el archivo. `build:full` incorpora el frontend en `backend/target/mitienda-api-0.0.1-SNAPSHOT.jar`. Con Java 21 puedes ejecutarlo desde la carpeta `backend`:

```sh
java -jar target/mitienda-api-0.0.1-SNAPSHOT.jar
```

Entonces toda la tienda y Swagger funcionan en el puerto **8080**, incluso al recargar rutas. Para generar otro HTML de instrucciones ejecuta `npm run vista:portatil`. `VER_TIENDA.html` explica cómo abrir la aplicación completa; el backend es necesario para comprar o administrar.

## Documentos para la evaluación

- [ERS actualizado](docs/ERS_v3.md) y `docs/ERS_v3.docx`.
- [Backend y seguridad con los doce indicadores](docs/Backend_y_seguridad.md) y su Word.
- [Cobertura de testing](docs/Cobertura_testing.md) y su Word.
- [Propuesta de pruebas con Vitest](docs/Propuesta_pruebas_Vitest.md) y su Word.
- [Guion de demostración local](docs/REVISION_LOCAL.md).
- Evidencia automática y capturas en `docs/evidencia/backend/`.

Los archivos de `src/data` sirven como fuente de las semillas del catálogo y como datos ficticios para pruebas; la aplicación obtiene los datos activos desde REST. Si se cambia esa fuente, `node scripts/exportar-semillas.mjs` actualiza el JSON de semillas antes de iniciar una base nueva. Una base existente se modifica desde el panel o mediante nuevas migraciones.
