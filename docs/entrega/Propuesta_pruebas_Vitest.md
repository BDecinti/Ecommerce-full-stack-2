# Propuesta de pruebas con Vitest

MiTienda · Componentes, sesiones e integración REST

## Objetivo y estrategia

El plan verifica que los cambios de la tienda conserven el comportamiento visible y respeten las respuestas de la API. Vitest ejecuta pruebas rápidas de funciones, componentes y contextos con React Testing Library y JSDOM. Se usa un servidor HTTP simulado para controlar respuestas sin depender de que el backend esté encendido.

La seguridad y las reglas que modifican datos se comprueban también con la suite Java sobre H2 real. Finalmente se recorre la tienda en Edge conectada con Spring Boot. Una prueba de componente aprobada no sustituye la prueba de autorización del servidor.

## Organización junto a los componentes

Cada prueba comparte carpeta con el archivo que verifica. ProductCard.test.jsx comprueba ProductCard.jsx; RequireRole.test.jsx comprueba RequireRole.jsx; AuthContext.test.jsx comprueba AuthContext.jsx. Las utilidades comunes se mantienen en src/test para evitar repetir proveedores y preparación.

El archivo de configuración es vite.config.js. setup.js prepara el DOM y limpia almacenamiento y datos entre casos. render.jsx monta los proveedores reales y permite esperar la restauración. server.js simula exclusivamente las respuestas necesarias para el frontend. Los cambios de seguridad del servidor deben tener su caso correspondiente en ApiIntegrationTest.

## Casos prioritarios del frontend

| Grupo | Propuesta y resultado esperado |
| --- | --- |
| Catálogo y tarjetas | Mostrar datos recibidos, estados sin stock y navegación; añadir hasta la cantidad disponible |
| Categorías y filtros | Combinar texto y categoría, cambiar orden y mostrar una búsqueda sin resultados |
| Carrito | Aumentar, reducir y retirar; persistir solo identificadores y cantidades; recalcular con el catálogo |
| Registro y login | Normalizar correo, omitir rol público y mostrar errores de API; esperar antes de navegar |
| Sesión | Restaurar mediante cookie, no guardar JWT, renovar una sola vez y revocar al cerrar |
| Rutas | No renderizar contenido privado para invitados; rechazar roles insuficientes y recuperar la compra pendiente |
| Compra | Validar entrega y tarjeta, conservar datos entre pasos, esperar respuesta y mostrar aprobación o rechazo |
| Administración | Aplicar respuestas de CRUD con IDs estables y mantener datos si una operación falla |
| Recuperación | Mostrar carga y errores de conexión; volver a intentar sin dejar una página vacía |

Los casos deben comprobar lo que observa el usuario mediante roles, etiquetas y textos accesibles. Se esperan resultados asíncronos con findBy o waitFor. Se evitan esperas arbitrarias y aserciones sobre detalles internos de React que puedan cambiar sin modificar la función del componente.

## Casos prioritarios del backend

| Riesgo | Prueba y criterio de aceptación |
| --- | --- |
| Escalada de permisos | Un cliente no crea productos y no lista usuarios; un vendedor no gestiona categorías ni retira productos |
| Suplantación de sesión | JWT con firma, emisor o audiencia inválidos devuelve 401; cookie de renovación sola no habilita recursos |
| Revocación | Logout, cambio de rol o desactivación impide usar el JWT anterior |
| Escritura sin CSRF | Login y cambios sin cookie y cabecera válidas se rechazan |
| Manipulación de importes | El cliente no envía precios aceptados; el total se calcula en el servidor |
| Sobreventa | Dos compras concurrentes de una unidad generan exactamente un pedido |
| Repetición de pago | Confirmar de nuevo la misma clave devuelve el pedido original sin volver a descontar |
| Integridad histórica | Retirar un producto conserva sus líneas compradas; cancelar repone una vez |

La suite utiliza peticiones HTTP simuladas por MockMvc con filtros de seguridad y servicios reales. La base H2 se migra antes de ejecutar los casos. Los datos se limpian entre pruebas para que el resultado no dependa del orden de ejecución.

## Demostración integrada

La revisión comienza con catálogo público y login de cliente. Se recarga la página para comprobar la restauración, se intenta acceder al panel y se verifica el rechazo. Después se realiza un pago rechazado y uno aprobado y se consulta el pedido en Mis compras.

Se cierra la sesión, se intenta falsificar un rol en localStorage y se comprueba que la ruta privada sigue exigiendo ingreso. Con vendedor se revisa el menú limitado y con administrador se recorren usuarios, categorías y dashboard. Se visita Swagger y se comprueba la presentación móvil. Las capturas y el resumen de resultados se conservan en docs/evidencia/backend.

## Ejecución y aceptación

Para una revisión rápida se usa npm test. Para medir cobertura se ejecuta npm run test:coverage. Durante el desarrollo, npm run test:watch repite las pruebas afectadas. La verificación Java se ejecuta con npm run test:backend y la compilación con npm run build:full.

La entrega registra 138 pruebas de frontend y 44 pruebas Java aprobadas. Cualquier fallo debe corregirse o quedar identificado explícitamente antes de presentar el proyecto. La cobertura actual se informa en Cobertura_testing y no se usa como prueba de ausencia de defectos.

Se propone ampliar los escenarios a PostgreSQL, varios navegadores, múltiples pestañas y carga sostenida. Estas tareas son posteriores a la evidencia local incluida. Para reproducir una regresión se debe conservar el requisito afectado, la petición o acción que la activa y el resultado esperado antes de corregir el código.
