# Especificación de requisitos del software

MiTienda · Versión 3 · Integración con Spring Boot

## Propósito y alcance

Esta especificación define el comportamiento de MiTienda para la entrega de Full Stack II de noviembre de 2026. Actualiza la versión anterior para incorporar una base relacional, servicios REST, autenticación JWT y restricciones por rol. Mantiene el catálogo de tecnología y gaming, los colores oscuros y verde lima y las páginas de la tienda y del panel.

La solución está formada por un frontend React y un backend Java 21 con Spring Boot 4.1.2. H2 conserva los datos localmente y Flyway administra el esquema. Se incluye configuración para PostgreSQL. La compra representa un proceso académico y no realiza cobros ni envíos reales.

La versión sustituye el almacenamiento de usuarios, productos y pedidos en el navegador por persistencia en el servidor. El carrito mantiene solo identificadores y cantidades en localStorage. Los datos locales de la versión anterior no se importan automáticamente a la base nueva.

## Actores y permisos

| Actor | Funciones disponibles |
| --- | --- |
| Visitante | Navegar, buscar, filtrar, leer páginas informativas, registrar cuenta, contactar y preparar carrito |
| Cliente | Iniciar y cerrar sesión, comprar y consultar únicamente sus pedidos |
| Vendedor | Usar la tienda, crear y editar productos, consultar pedidos y cambiar sus estados, consultar su perfil |
| Administrador | Gestionar productos, categorías y usuarios, ventas manuales, pedidos, dashboard y reportes |

El control de permisos se aplica en la interfaz y en el servidor. Ocultar un botón no sustituye la autorización de una petición REST. La propiedad de los pedidos se determina mediante el identificador autenticado y no mediante un correo enviado por el navegador.

## Requisitos del catálogo y la presentación

### RF01 Inicio y navegación

El inicio debe presentar una selección organizada de categorías y hasta ocho productos distribuidos en dos bloques sin repetir tarjetas. La cabecera permite acceder a categorías, carrito y sesión. El pie contiene las páginas informativas. Aceptación: el usuario puede llegar al catálogo y al carrito desde escritorio y móvil sin desbordamiento horizontal.

### RF02 Catálogo y búsqueda

La tienda debe consultar los productos activos desde GET /api/productos. Debe permitir búsqueda por texto, categoría y subcategoría, filtros disponibles y ordenamiento. El detalle muestra fotografía, descripción, precio y disponibilidad. Aceptación: un cambio confirmado desde el panel se refleja al volver a consultar el catálogo.

### RF03 Carrito

El visitante puede añadir, reducir o retirar cantidades y vaciar el carrito. Solo se guardan identificador y cantidad; el precio y el stock se consultan desde el catálogo. Aceptación: no se ofrece una cantidad superior al stock visible y el servidor vuelve a comprobarla al comprar.

### RF04 Información y contacto

Las páginas Nosotros, Blogs y Contacto deben conservar una presentación coherente con la tienda. El formulario envía una consulta validada a POST /api/consultas y muestra confirmación solo después de recibir éxito. Aceptación: el mensaje se conserva en la base y su listado está restringido al administrador. No se promete envío de correo.

## Requisitos de identidad y sesiones

### RF05 Registro público

El registro solicita nombre, correo y contraseña de entre 8 y 128 caracteres. El servidor normaliza el correo, verifica su unicidad y crea exclusivamente clientes. Aceptación: un correo duplicado devuelve conflicto y un campo rol agregado por el solicitante se rechaza.

### RF06 Inicio de sesión

El sistema debe autenticar credenciales contra el hash BCrypt guardado en la base. Una respuesta correcta entrega un JWT de acceso y una cookie protegida de renovación. Aceptación: la contraseña no aparece en respuestas de usuario y las credenciales inválidas muestran un mensaje genérico.

### RF07 Persistencia de sesión

El frontend debe restaurar la cuenta después de recargar usando la cookie HttpOnly. El JWT de acceso permanece en memoria. Aceptación: una recarga conserva la cuenta válida y las peticiones simultáneas comparten una sola renovación.

### RF08 Cierre y revocación

El cierre de sesión debe revocar la sesión en la base y retirar la cookie. Desactivar una cuenta o cambiar correo, rol o contraseña debe revocar sus sesiones. Aceptación: el JWT anterior deja de permitir acceso después de la revocación; si la conexión falla al cerrar, la interfaz muestra un error y permite reintentar.

### RF09 Control de acceso

El visitante que solicita una ruta privada debe iniciar sesión. Una cuenta sin el rol necesario recibe una vista de acceso restringido. El backend comprueba cada recurso y acción con independencia de la navegación. Aceptación: un cliente no puede consultar usuarios, un vendedor no puede administrar categorías y falsificar localStorage no habilita el panel.

## Requisitos de compra y pedidos

### RF10 Entrega y retiro

La compra requiere una cuenta autenticada, productos disponibles, nombre, correo y celular chileno válido. El retiro presencial no solicita domicilio. El envío requiere dirección, comuna y región. Aceptación: el backend rechaza un envío sin esos datos y el frontend permite volver entre pasos sin perder el contacto.

### RF11 Pago de demostración

El flujo permite tarjeta aprobada 4242424242424242 o rechazada 4000000000000002, titular ficticio, vencimiento vigente y CVV de tres dígitos. Aceptación: el rechazo devuelve 402 y conserva stock y carrito; la aprobación registra el pedido y presenta su comprobante. No se almacenan número, vencimiento ni CVV.

### RF12 Cálculo y confirmación

El servidor debe obtener los precios vigentes, validar cantidades enteras y aplicar envío gratuito al retiro o a compras desde 100.000 pesos. El envío por debajo del umbral cuesta 4.990 pesos. Aceptación: el frontend no puede fijar el precio mediante el cuerpo de la compra y la misma clave de idempotencia no duplica un pedido.

### RF13 Stock e historial

El pedido y el descuento de existencias deben confirmarse en una sola transacción. Las líneas conservan una copia del precio, nombre e imagen comprados. Aceptación: dos compras simultáneas de la última unidad producen una sola venta y nunca un stock negativo.

### RF14 Consulta de pedidos

El cliente debe consultar su historial en Mis compras. El vendedor y el administrador consultan el listado de gestión. Aceptación: el servidor filtra por propietario y devuelve 403 al cliente que solicita un pedido ajeno.

### RF15 Estados y cancelación

El vendedor o administrador puede cambiar pedidos no finalizados a pagado, en preparación, entregado o cancelado. Cancelar devuelve las existencias una sola vez. Los estados entregado y cancelado son finales. Aceptación: repetir la cancelación no vuelve a incrementar el stock y un pedido activo no se elimina.

## Requisitos del panel y los servicios

### RF16 Gestión del catálogo

El administrador y el vendedor pueden crear y editar productos. Solo el administrador puede retirarlos. El precio debe ser positivo, el stock no negativo y el código único. Aceptación: la API valida la categoría y las restricciones, y un producto retirado deja de aparecer en el catálogo público.

### RF17 Gestión de categorías

Solo el administrador puede crear, editar y eliminar categorías. Se permiten dos niveles y se prohíben ciclos. Una categoría con productos o subcategorías no se elimina. Aceptación: la API devuelve error ante autorreferencia o dependencias, y la navegación conserva la jerarquía válida.

### RF18 Gestión de usuarios

Solo el administrador puede consultar, crear, editar o desactivar usuarios y asignar roles. Una contraseña vacía al editar conserva la actual. Aceptación: los identificadores permanecen estables, los hashes no se exponen y no es posible retirar o degradar al último administrador activo.

### RF19 Reportes y venta manual

El administrador consulta dashboard, inventario y reportes generales y puede registrar ventas para clientes existentes. El vendedor consulta inventario y pedidos según sus permisos. Aceptación: los cálculos de la venta manual utilizan los precios y el stock del backend y los reportes usan los datos autorizados recibidos de la API.

### RF20 API documentada

Los recursos principales deben exponer lectura, creación, actualización y eliminación o retiro mediante REST. Swagger debe mostrar contratos y autenticación. Aceptación: /v3/api-docs responde una especificación OpenAPI y Swagger permite explorar las operaciones del sistema.

## Requisitos de calidad

| Código | Requisito y aceptación |
| --- | --- |
| RNF01 Persistencia | Reiniciar el servidor conserva las operaciones confirmadas en H2; una migración versionada crea la base nueva. |
| RNF02 Seguridad | BCrypt, JWT firmado, sesiones revocables, CSRF y CORS con orígenes explícitos; respuestas sin contraseñas ni tarjetas. |
| RNF03 Publicación | HTTPS, cookies Secure, secreto externo y semillas de demostración deshabilitadas antes de un uso real. |
| RNF04 Usabilidad | Colores y tipografía coherentes; botones separados, etiquetas, avisos de carga y errores comprensibles. |
| RNF05 Compatibilidad | Desarrollo con Node.js 24 y JDK 21; revisión en Edge y prueba móvil a 390 píxeles. |
| RNF06 Mantenibilidad | Servicios y DTO separados; Vitest junto a componentes y pruebas Java de integración en src/test. |
| RNF07 Consistencia | Transacciones, restricciones relacionales, bloqueo de stock e idempotencia de compra. |
| RNF08 Verificación | Compilación de frontend y JAR, pruebas repetibles y métricas de cobertura fechadas con sus límites. |

## Entrega y criterios de aceptación

La entrega contiene los fuentes React y Maven, el wrapper, la migración SQL, semillas ficticias, instrucciones, informes Word y evidencia. El inicio local ejecuta ambos servicios y el JAR compilado permite servirlos en el puerto 8080.

La verificación registra 138 pruebas de frontend y 44 pruebas Java aprobadas. La cobertura de líneas es 80.37 % y 93.53 %, respectivamente. Cobertura_testing detalla el alcance; los porcentajes no garantizan ausencia de fallos ni seguridad absoluta.

Quedan fuera del alcance los cobros, correos y envíos reales, recuperación de contraseña, despliegue productivo y auditoría externa. PostgreSQL se entrega configurado como alternativa; las pruebas usan H2. Los cambios del esquema deben incorporarse mediante nuevas migraciones.

## Trazabilidad de la aceptación

La siguiente matriz vincula los requisitos con una comprobación observable. El detalle de casos y resultados está en docs/evidencia/backend. Las pruebas de componentes usan respuestas controladas; las reglas del servidor se verifican con la suite Java y la integración se recorre en Edge.

| Requisitos | Resultado que debe observarse | Evidencia |
| --- | --- | --- |
| RF01 a RF04 | Navegación, filtros, carrito y recepción de consultas funcionan con datos de API | Home, ProductFilters, CartContext y Contact en Vitest; contacto en Java |
| RF05 a RF09 | Registro sin privilegios, sesión restaurada y rechazo de rutas o recursos no permitidos | AuthContext, api y RequireRole en Vitest; JWT, CSRF y roles en Java |
| RF10 a RF13 | Entrega validada, total del servidor, rechazo sin escrituras y compra sin sobreventa | Payment en Vitest; checkout, idempotencia y concurrencia en Java |
| RF14 y RF15 | El cliente ve sus compras y cancelar devuelve stock una sola vez | MyOrders y PedidoContext en Vitest; propiedad y estados en Java |
| RF16 a RF18 | CRUD autorizado, validación, retiro histórico y revocación de cuentas | ApiIntegrationTest y recorridos de CRUD en Edge |
| RF19 | Inventario y ventas usan datos autorizados y la venta manual descuenta stock | Funciones de reportes en Vitest y venta manual en Java |
| RF20 | Swagger muestra los contratos y el mecanismo de autenticación de la API | Especificación OpenAPI en Java y recorrido Swagger en Edge |

Los resultados y límites deben revisarse de nuevo cuando cambie una regla o un contrato REST. El guion REVISION_LOCAL permite repetir la demostración con las tres cuentas de prueba sin utilizar datos bancarios reales.
