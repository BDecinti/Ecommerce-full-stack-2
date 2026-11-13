# Cobertura de testing

MiTienda · Frontend integrado y backend Spring Boot

## Alcance de la verificación

La entrega comprueba el frontend con Vitest y React Testing Library, y el backend con JUnit, Spring Boot Test y MockMvc. El frontend usa un servidor HTTP simulado para aislar los componentes; las pruebas Java ejecutan los controladores, filtros JWT, validación, servicios, migración y persistencia sobre una base H2 de pruebas.

Esta separación evita atribuir a una prueba de interfaz la validación real de la seguridad del servidor. Los recorridos adicionales en Edge conectan React con la API en ejecución y verifican la integración observable. Los datos usados son ficticios.

## Resultados de la ejecución

| Suite | Pruebas | Resultado |
| --- | --- | --- |
| Vitest | {{FRONT_TESTS}} en {{FRONT_FILES}} archivos | {{FRONT_RESULT}} |
| JUnit y Spring Boot Test | {{BACK_TESTS}} | {{BACK_RESULT}} |
| Recorridos en Edge | {{BROWSER_TESTS}} | {{BROWSER_RESULT}} |

Las métricas se obtienen de los reportes generados por las herramientas, no de conteos manuales de expectativas. El resumen reproducible está en docs/evidencia/backend/resumen.json. El detalle de casos de Vitest está en frontend-pruebas.json y el de Java en backend-pruebas.json.

## Cobertura medida del frontend

| Métrica de V8 | Resultado |
| --- | --- |
| Sentencias | {{FRONT_STATEMENTS}} |
| Ramas | {{FRONT_BRANCHES}} |
| Funciones | {{FRONT_FUNCTIONS}} |
| Líneas | {{FRONT_LINES}} |

El denominador incluye los archivos JavaScript y JSX de src, excepto las propias pruebas y src/test. Incluye vistas administrativas que no tienen recorridos unitarios exhaustivos. La cobertura no equivale a una certificación funcional; una línea ejecutada no garantiza que todos sus datos posibles estén validados.

El cliente REST tiene pruebas de CSRF vigente, credenciales enviadas con cookies, token en memoria, agrupación de renovaciones, reintento ante 401, tratamiento de 403 y errores de conexión. RequireRole y ConnectionBoundary tienen pruebas junto a sus archivos y cubren rechazo por rol, ingreso requerido y recuperación de la carga inicial.

## Cobertura medida del backend

| Métrica de JaCoCo | Resultado |
| --- | --- |
| Instrucciones | {{BACK_INSTRUCTIONS}} |
| Ramas | {{BACK_BRANCHES}} |
| Líneas | {{BACK_LINES}} |

JaCoCo mide las clases de producción compiladas en el proyecto Maven, incluidas entidades, DTO, configuración y servicios. Las métricas de V8 y JaCoCo utilizan distintos denominadores y no deben compararse como si fueran una sola medición. El informe HTML completo se genera localmente en backend/target/site/jacoco/index.html.

## Riesgos y casos comprobados

| Área | Comprobaciones principales |
| --- | --- |
| Registro y usuarios | Normalización, correo duplicado, BCrypt, contraseña corta, rechazo de rol público y retiro de cuenta |
| JWT y sesión | Firma alterada, expiración, emisor y audiencia, cookie HttpOnly, rotación, revocación y cambio de rol |
| Autorización | Invitado 401; cliente y vendedor sin permisos 403; lectura de pedidos por propietario |
| REST | Catálogo público, CRUD de productos, categorías y usuarios, validación y Swagger |
| Compra | Totales del servidor, envío, rechazo sin escrituras, stock insuficiente y cantidades fraccionarias |
| Consistencia | Idempotencia, cancelación única y dos compras concurrentes de la última unidad |
| Interfaz | Tarjetas, menús, filtros, formularios, carrito, compra, rutas privadas y estados de carga |
| Integración visible | Sesión tras recarga, compra rechazada y aprobada, permisos, panel y vista móvil |

Las pruebas de concurrencia se coordinan con dos hilos y una última unidad disponible: se espera una sola venta y stock cero. La prueba de idempotencia repite la clave y verifica el mismo identificador de pedido. Las pruebas de CSRF usan la cookie y el token reales del endpoint; no sustituyen la protección por un permiso artificial en MockMvc.

## Organización de las pruebas

Los archivos .test.jsx están junto a sus componentes, por ejemplo ProductCard.jsx con ProductCard.test.jsx, RequireRole.jsx con RequireRole.test.jsx y MyOrders.jsx con MyOrders.test.jsx. Los contextos y el cliente REST también tienen sus pruebas en la misma carpeta. src/test contiene solamente utilidades compartidas, preparación y el servidor simulado.

La suite Java se encuentra en backend/src/test/java/cl/mitienda. ApiIntegrationTest usa el contexto completo y una base en memoria; cada caso limpia sus datos de prueba. MiTiendaApplicationTests comprueba el arranque del contexto. Estas pruebas no modifican la base local que utiliza la tienda.

## Reproducción

Después de instalar las dependencias con npm ci, ejecuta npm test o npm run test:coverage. El modo interactivo se inicia con npm run test:watch. Para el backend ejecuta npm run test:backend; necesita JDK 21 y el wrapper prepara Maven. En Windows el asistente del proyecto prepara Java portátil cuando falta.

La compilación completa se comprueba con npm run build:full. En Windows debe detenerse el backend que esté utilizando el JAR antes de reconstruirlo. El frontend queda en dist y el JAR incluye esos archivos. El guion de demostración está en docs/REVISION_LOCAL.md.

## Límites y trabajo posterior

La evidencia corresponde al entorno local y H2. No se ejecutó la misma suite contra PostgreSQL, navegadores Safari o Firefox, ni una prueba de carga sostenida. Los componentes usan respuestas simuladas en Vitest; su integración real se revisa por separado en el navegador y en las pruebas Java.

Quedan por ampliar las combinaciones de formularios administrativos, fallos simultáneos de red, escenarios de múltiples pestañas y carga prolongada. Tampoco se ha realizado una auditoría externa de seguridad o accesibilidad. Estos límites deben presentarse junto a los resultados y no ocultarse detrás del porcentaje de cobertura.
