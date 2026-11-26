# Implementación del backend y la seguridad

MiTienda · Full Stack II · Noviembre de 2026

## Propósito de esta entrega

La tienda integra ahora una API REST desarrollada con Spring Boot 4.1.2 y Java 21. React conserva la presentación y los colores del proyecto, pero obtiene el catálogo, los usuarios y los pedidos desde el servidor. Esta separación permite aplicar las mismas reglas de negocio aunque una petición se envíe fuera de la interfaz.

El entorno local utiliza H2 en archivo. Se incluye un perfil para PostgreSQL, cuya conexión se configura mediante variables de entorno. Las pruebas de integración de esta entrega se ejecutaron sobre H2. El pago continúa siendo una simulación académica y no se conecta a servicios bancarios.

## Arquitectura y recorrido de los datos

El navegador presenta las páginas con React y React Router. Los contextos invocan el cliente REST de src/services/api.js, que agrega el JWT de acceso, las cookies y la protección CSRF. Durante el desarrollo, Vite reenvía /api al servidor del puerto 8080. Al compilar el JAR completo, Spring sirve también los archivos del frontend en el mismo origen.

Los controladores reciben objetos de transferencia validados. Los servicios aplican las reglas del negocio dentro de transacciones y los repositorios JPA consultan la base relacional. Las respuestas se construyen con vistas explícitas, de modo que nunca se serializa una entidad con su contraseña o su token de renovación.

| Capa | Responsabilidad | Archivo principal |
| --- | --- | --- |
| Presentación | Formularios, navegación y estados de carga | src/pages y src/components |
| Integración | REST, errores, CSRF y renovación | src/services/api.js |
| Controladores | Contratos y permisos de endpoints | ApiController.java y AuthController.java |
| Servicios | Compras, catálogo, usuarios y autenticación | PedidosService.java y AuthService.java |
| Persistencia | Entidades y consultas JPA | Repositorios.java y entidades Java |
| Migraciones | Esquema reproducible de la base | V1__esquema_inicial.sql |

Los archivos Java se encuentran en backend/src/main/java/cl/mitienda. La migración está en backend/src/main/resources/db/migration.

## Modelo relacional

| Entidad | Datos y relaciones principales |
| --- | --- |
| usuarios | Identidad, correo único, hash BCrypt, rol y cuenta activa |
| categorias | Nombre y referencia opcional a una categoría padre |
| productos | Código único, precio, stock y referencia a categoría |
| sesiones | Usuario, vencimiento, revocación y hash del token de renovación |
| pedidos | Propietario, contacto, entrega, estado, totales y clave de compra |
| pedido_items | Pedido, referencia de producto y copia del precio y nombre al comprar |
| consultas | Contacto y mensaje recibido mediante el formulario público |

Un usuario tiene varias sesiones y pedidos. Un pedido contiene varias líneas. Cada producto pertenece a una categoría y una categoría puede tener subcategorías. Las claves foráneas protegen estas relaciones. Los productos se retiran del catálogo y los usuarios se desactivan para conservar el historial de las compras.

Flyway ejecuta la migración inicial y registra su versión. JPA utiliza ddl-auto=validate para comprobar que las entidades coinciden con el esquema; no reconstruye tablas al iniciar. En una base vacía se cargan 32 productos, 14 categorías y tres cuentas ficticias cuando la opción de demostración está habilitada.

## Servicios REST y Swagger

La documentación interactiva está en http://127.0.0.1:8080/swagger-ui.html. La especificación JSON se publica en /v3/api-docs. Las operaciones incluyen descripciones, esquemas de entrada y salida y el mecanismo bearerAuth para JWT.

| Recurso | Operaciones | Acceso |
| --- | --- | --- |
| /api/productos | GET de lista y detalle; POST, PUT y DELETE | Lectura pública; escritura según rol |
| /api/categorias | GET de lista y detalle; POST, PUT y DELETE | Lectura pública; cambios por administrador |
| /api/usuarios | GET, POST, PUT y DELETE | Administrador |
| /api/pedidos | GET de lista y detalle; POST de compra | Usuario autenticado; propiedad validada |
| /api/pedidos/{id}/estado | PATCH | Administrador o vendedor |
| /api/pedidos/{id} | DELETE de pedido cancelado | Administrador |
| /api/admin/pedidos | POST de venta manual | Administrador |
| /api/consultas | POST público y GET de administración | Según operación |
| /api/auth | Registro, login, refresh, logout, me y csrf | Según operación |

Los errores utilizan ProblemDetail con un mensaje en español y un código de aplicación. Una entrada inválida devuelve 400; la falta de autenticación, 401; la falta de permiso, 403; un recurso inexistente, 404; un conflicto de stock o unicidad, 409; y un pago de prueba rechazado, 402. Las consultas correctas devuelven 200, las creaciones 201 y las eliminaciones 204.

Para probar cambios desde Swagger, ejecuta GET /api/auth/csrf, realiza el login y pega accessToken en Authorize. Vuelve a obtener CSRF antes de una operación que modifique datos. La interfaz Swagger utiliza la cookie XSRF-TOKEN y la cabecera X-XSRF-TOKEN. Las compras requieren también una cabecera Idempotency-Key con un UUID nuevo.

## Reglas de compra y consistencia

El frontend envía únicamente los identificadores y cantidades de los productos, los datos de entrega y los datos ficticios de pago. El servidor consulta los precios vigentes y calcula subtotal, envío y total. Un precio agregado por el cliente se rechaza como campo desconocido. Las cantidades deben ser enteras positivas y no superar el stock.

El envío cuesta 4.990 pesos cuando el subtotal es inferior a 100.000; desde ese monto es gratuito. El retiro presencial no tiene costo de envío. El domicilio requiere calle, comuna y región. La validación del celular y de los datos se repite en el backend.

La compra bloquea los productos en orden de identificador y registra el pedido y el descuento de stock en una sola transacción. Si falta stock o se rechaza el pago, no se registra una compra parcial. La clave de idempotencia evita duplicar un pedido cuando se repite la misma confirmación; reutilizar esa clave con otros datos produce un conflicto.

Cancelar un pedido devuelve sus cantidades una sola vez. Los estados cancelado y entregado son finales. El servidor impide modificar posteriormente esos estados y solo permite eliminar pedidos cancelados. Las líneas conservan el precio y el nombre originales aunque después se edite el catálogo. El número de tarjeta, su vencimiento y el CVV no se guardan en la base ni se incluyen en el pedido devuelto.

## Autenticación JWT y permisos del servidor

La contraseña se compara mediante BCrypt con costo 12. El registro público siempre asigna el rol cliente y rechaza una propiedad rol enviada por el solicitante. Solo el administrador puede asignar roles desde la gestión de usuarios. La aplicación impide retirar o degradar al último administrador activo.

El login devuelve un JWT firmado con HS256 que contiene el identificador del usuario, rol, emisor, audiencia, vencimiento e identificador de sesión. El filtro verifica la firma y el tiempo de validez y consulta la sesión y el usuario en la base. Los permisos efectivos se obtienen del rol actual del usuario. Así, revocar una sesión o desactivar una cuenta invalida también los accesos emitidos para ella.

| Operación | Cliente | Vendedor | Administrador |
| --- | --- | --- | --- |
| Comprar y consultar compras propias | Sí | Sí | Sí |
| Ver todos los pedidos y cambiar su estado | No | Sí | Sí |
| Crear o editar productos | No | Sí | Sí |
| Retirar productos | No | No | Sí |
| Gestionar categorías y usuarios | No | No | Sí |
| Dashboard, reportes generales y venta manual | No | No | Sí |

Los clientes reciben únicamente sus pedidos y una consulta directa a un pedido ajeno devuelve 403. Los métodos administrativos utilizan PreAuthorize. El cierre de sesión y los cambios de correo, rol o contraseña revocan las sesiones correspondientes. La API nunca confía en un rol escrito en localStorage.

## Gestión segura de sesiones en React

El JWT de acceso dura 10 minutos y se mantiene en una variable del módulo REST, sin persistirlo en localStorage ni sessionStorage. La cookie de renovación es HttpOnly, SameSite Strict y está limitada a /api/auth. El token de renovación es aleatorio; la base conserva su hash SHA-256, vencimiento y estado de revocación.

Cuando se recarga una página, AuthContext solicita la renovación mediante la cookie. El backend rota el token y entrega un JWT nuevo. Las peticiones simultáneas comparten una sola renovación. Si una petición recibe 401, el cliente intenta renovar una vez y repetirla. Si no es posible, limpia la sesión y muestra el ingreso requerido.

Antes de cada formulario se obtiene un CSRF vigente. Esto permite enviar cambios después de restaurar la autenticación, cuando la protección puede haberse renovado. Al cerrar sesión, la interfaz espera la revocación del servidor; una caída de red muestra un error y permite reintentar. El carrito persiste solo con identificador y cantidad de productos.

En HTTP local la cookie Secure está desactivada para permitir la demostración. La configuración de publicación debe usar HTTPS y COOKIE_SECURE=true, una clave externa robusta, orígenes permitidos explícitos y SEED_DEMO=false. La configuración local no constituye una auditoría de seguridad para un comercio real.

## Restricciones y experiencia del frontend

RequireRole espera a que termine la restauración antes de resolver una ruta. El visitante se dirige al login; una cuenta autenticada sin permiso recibe una pantalla de acceso restringido. Los enlaces del vendedor muestran productos, pedidos y perfil. Los enlaces del administrador incluyen el resto de las secciones.

La compra exige una cuenta autenticada y Mis compras presenta el historial permitido por la API. El destino posterior al login se valida según el rol, para no enviar al vendedor a una sección administrativa que no puede utilizar. Los formularios muestran los errores devueltos por el backend y la carga inicial permite reintentar si no hay conexión.

## Relación con los doce indicadores

| Indicador | Implementación y evidencia |
| --- | --- |
| IE3.1.1 | Entidades JPA, repositorios, Flyway, H2 persistente y servicios transaccionales. Ver modelo y reglas de compra. |
| IE3.2.1 | CRUD REST con Spring Boot y contratos publicados por springdoc en Swagger. |
| IE3.2.2 | Cliente REST, contextos React y proxy Vite; compra y panel integrados con la API. |
| IE3.3.1 | JWT firmado, filtro de autenticación, roles y permisos con PreAuthorize. |
| IE3.3.2 | JWT en memoria, renovación por cookie, restauración al recargar y logout con revocación. |
| IE3.3.3 | RequireRole, menú por rol, destino de login y pantallas de acceso restringido. |
| IE3.1.2 | Este informe describe arquitectura, relaciones de datos y lógica de negocio. |
| IE3.2.3 | Este informe explica los recursos CRUD, contratos, respuestas y uso de Swagger. |
| IE3.2.4 | Se justifica la integración por contratos explícitos y validación centralizada de precios y stock. |
| IE3.3.4 | Se describen BCrypt, emisión y validación de JWT, roles y revocación. |
| IE3.3.5 | Se expone el ciclo de sesión desde login hasta renovación, recarga y cierre. |
| IE3.3.6 | Se explican restricciones de rutas y acciones, con validación independiente en la API. |

## Verificación y límites

La suite de frontend contiene 138 pruebas en 47 archivos. La suite Java contiene 44 pruebas con base H2 y filtros de seguridad reales. La cobertura medida y los resultados están en el informe de testing y en docs/evidencia/backend. La revisión del navegador recorre la sesión persistente, restricciones por rol, compra rechazada y aprobada, panel y vista móvil.

No se incluye pasarela bancaria, recuperación de contraseña, verificación de correo, autenticación multifactor ni una auditoría de penetración. El perfil PostgreSQL está preparado, pero la evidencia ejecutada corresponde a H2. Antes de una publicación real se debe configurar infraestructura, copias de seguridad, secretos y controles operativos adecuados.

## Referencias técnicas

Spring Boot: https://spring.io/projects/spring-boot/

Spring Security y CSRF: https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html

JWT en Spring Security: https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html

springdoc OpenAPI: https://springdoc.org/

Vitest: https://vitest.dev/guide/
