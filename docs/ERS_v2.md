# Especificación de requisitos del software

Tienda de tecnología y gaming MiTienda

21 de octubre de 2026

## 1 Propósito y alcance

Esta especificación define el comportamiento de MiTienda para la evaluación de Full Stack II. La versión 2 consolida catálogo, usuarios, compra simulada y administración, e incorpora los cambios de experiencia, pruebas y reportes. Sirve al equipo y al docente para revisar qué se implementa y cómo se acepta.

El producto es una aplicación React y Vite que se ejecuta en el navegador. Los datos se guardan en localStorage del mismo origen. La entrega cubre una demostración funcional local; no incluye servidor de autenticación, base de datos compartida, cobros bancarios ni entregas físicas.

### Actores

| Actor | Operaciones |
| --- | --- |
| Visitante | Explorar, filtrar, leer el blog, registrar cuenta, usar el carrito y comprar como invitado. |
| Cliente | Iniciar y cerrar sesión; usar el catálogo y la compra con datos de contacto precargados. |
| Administrador | Gestionar catálogo, categorías y usuarios; revisar pedidos, estados, inventario y ventas. |

### Entorno y arquitectura

Node.js 24 o superior ejecuta las herramientas y Jasmine. React presenta las vistas, React Router administra las rutas y los contextos comparten productos, categorías, carrito, pedidos y sesión. El CSS adapta la tienda a escritorio y móvil.

La línea base del repositorio es 396c877. Los contratos de datos existentes se conservan y se añaden campos de entrega, costo de envío y pago simulado.

### Convenciones

RF identifica requisitos funcionales, RNF requisitos de calidad y RN reglas del negocio. Cada requisito incluye un resultado observable. La cobertura y los casos ejecutados se registran en el documento de testing.

## 2 Catálogo y usuarios

### RF01 Inicio organizado

La página inicial debe mostrar una cabecera con acceso a categorías, bloques de categorías y dos selecciones de hasta cuatro productos cada una. Un producto seleccionado no debe repetirse entre ambas selecciones. Aceptación: se muestran como máximo ocho tarjetas y enlaces al catálogo completo.

### RF02 Búsqueda y filtros

El usuario debe buscar por nombre, marca, descripción o código sin distinguir mayúsculas ni tildes. En catálogo y categorías podrá combinar marca, precio mínimo y máximo, disponibilidad y orden por precio o nombre. Aceptación: los resultados y el contador reflejan la combinación; una búsqueda sin resultados muestra una salida para limpiar filtros.

### RF03 Categorías y subcategorías

La navegación debe permitir explorar categorías principales y sus subcategorías. Una categoría principal incluye los productos de sus hijos directos. La categoría Ofertas conserva su selección de destacados y productos de las categorías promocionales.

### RF04 Ficha y carrito

Cada tarjeta debe mostrar nombre, imagen, marca, descripción, precio CLP y acción de agregar. La ficha presenta el detalle del producto. Un producto agotado no admite añadidos y las cantidades respetan el stock del catálogo.

### RF05 Registro de cliente

El formulario público debe registrar exclusivamente clientes con nombre, correo válido y contraseña de al menos cuatro caracteres. El correo se recorta y normaliza a minúsculas y no puede repetirse. El rol administrador solo se gestiona desde el panel.

### RF06 Sesión y acceso

El inicio de sesión debe validar las credenciales de la demo. El encabezado debe permitir abrirlo como diálogo con cierre por botón o Escape; /login permanece disponible. Un cliente o visitante que intente acceder a /admin será llevado al login.

### RF07 Información y contacto

Nosotros debe explicar el proyecto y su equipo; el blog debe ofrecer guías con detalle navegable. Contacto debe validar nombre, correo y mensaje, guardar una consulta local y confirmar expresamente que no se envió un correo.

## 3 Compra y pago de demostración

### RF08 Carrito persistente

El carrito debe permitir aumentar y disminuir cantidades, eliminar con confirmación y vaciar. Debe recalcular el total y conservar únicamente id y cantidad. Sin productos debe mostrar acceso al catálogo y ocultar la acción de pago.

### RF09 Entrega y contacto

El paso de entrega debe solicitar receptor, correo y celular chileno. El envío exige calle y número, comuna y región. El retiro no exige dirección. El usuario podrá volver entre pasos sin perder lo completado.

### RF10 Tarjeta de prueba

El paso de pago debe informar dos números de demostración: 4242 4242 4242 4242 para aprobación y 4000 0000 0000 0002 para rechazo. Exige titular ficticio, vencimiento futuro MM/AA y CVV de tres dígitos. Otros números no avanzan.

### RF11 Revisión y aprobación

Antes de confirmar se muestran receptor, entrega, últimos cuatro dígitos y total. Al aprobar, se crea un único pedido, se descuentan las unidades compradas y se vacía el carrito. El comprobante presenta identificador, artículos, total y entrega, y permite imprimir.

### RF12 Rechazo y reintento

La tarjeta de rechazo debe mostrar una vista de error y permitir corregir los datos. Un rechazo no crea pedido, no descuenta stock y no vacía el carrito. El reintento aprobado crea un solo pedido.

### RF13 Tratamiento de datos de pago

El número completo, titular de tarjeta, vencimiento y CVV permanecen solo en el estado del formulario. El pedido guardado no contiene esos campos. No se invoca una pasarela externa.

| Regla | Condición |
| --- | --- |
| RN01 | El stock y las cantidades son enteros y no negativos; para comprar la cantidad es mayor a cero. |
| RN02 | Envío simulado de $4.990 si el subtotal es menor a $100.000; desde $100.000 es gratuito. |
| RN03 | Retiro sin costo; total de compra igual a subtotal más costo de envío. |
| RN04 | Un pedido cancelado repone el stock una vez y no admite nuevos cambios de estado. |

## 4 Administración y reportes

### RF14 Productos

El administrador debe listar, buscar por código o nombre, crear y editar productos. Los nuevos códigos deben ser únicos. El formulario conserva marca, descripción, categoría, precio, stock, umbral crítico, imagen y destacado; admite rutas locales o imágenes HTTPS.

### RF15 Reporte de inventario

La ruta /admin/products/reports debe mostrar cantidad de productos, unidades, productos críticos y valor del inventario a precio de venta. El filtro crítico incluye agotados y stock menor o igual al umbral. La descarga CSV contiene solo la selección visible y escapa separadores, comillas y prefijos de fórmula.

### RF16 Categorías

El panel debe crear, editar y eliminar categorías y subcategorías de dos niveles. La interfaz impide eliminar categorías con hijos o productos. Evita nombres repetidos en un mismo nivel y que una categoría con hijos pase a ser subcategoría.

### RF17 Usuarios

El panel debe listar, consultar, crear y editar usuarios y sus roles. El correo identifica al usuario y debe ser único. El detalle debe permitir consultar el historial de pedidos del usuario. El perfil muestra los datos del administrador y acceso a edición.

### RF18 Pedidos

El panel debe listar pedidos, filtrar por estado, consultar su detalle y crear pedidos manuales con productos disponibles. El detalle debe presentar datos del receptor y dirección cuando corresponda. Cambiar a cancelado devuelve el stock y bloquea cambios posteriores.

### RF19 Ventas y dashboard

El dashboard resume ingresos, productos, inventario, usuarios y pedidos recientes. El reporte de ventas permite agrupar por día, semana o mes, comparar períodos y desglosar por producto, marca y categoría. Los pedidos cancelados se excluyen de ventas.

### Rutas principales

| Área | Rutas |
| --- | --- |
| Tienda | / · /products · /products/:id · /categories · /categories/:id |
| Compra | /cart · /checkout · /payment como ruta compatible |
| Usuarios e información | /login · /signup · /about · /contact · /blog · /blog/:id |
| Panel | /admin y secciones products, categories, orders, users, reports y profile |

## 5 Calidad y datos

| Requisito | Criterio verificable |
| --- | --- |
| RNF01 Adaptación | La tienda debe funcionar a 390 px y en escritorio de 1440 px sin desbordamiento horizontal del documento. |
| RNF02 Accesibilidad | Inputs etiquetados, foco visible, botones con nombre, enlace de salto, diálogo nativo y respeto a movimiento reducido. |
| RNF03 Mantenibilidad | Componentes con una responsabilidad, contextos para estado compartido y reglas de compra como funciones puras. |
| RNF04 Reproducibilidad | npm ci, npm test, npm run test:coverage y npm run build deben poder ejecutarse con Node 24. |
| RNF05 Persistencia | Un recargo mantiene datos del mismo navegador; JSON no válido usa valores por defecto. |
| RNF06 Alcance de seguridad | La sesión y el control de roles son demostrativos. No se deben usar credenciales o tarjetas reales. |

### Modelo de datos

| Entidad o clave | Datos relevantes |
| --- | --- |
| productos | id, código, nombre, marca, precio, imagen, descripción, stock, stockCritico, categoriaId, destacado. |
| categorias | id, nombre y padreId nulo para principales; identificador del padre para subcategorías. |
| usuarios y usuarioLogueado | Nombre, correo, contraseña y rol de la demo; datos personales de ejemplo. |
| carrito | Lista de id de producto y cantidad; los demás datos se leen del catálogo. |
| pedidos | id, fecha, estado, items, subtotal, costoEnvio, total, nombre, usuario, teléfono, tipoEntrega y dirección. |
| consultas | Identificador, fecha, nombre, correo, asunto y comentario guardados localmente. |

Los pedidos conservan una copia del nombre y precio de sus artículos para preservar el detalle histórico. El catálogo y las categorías guardan una versión de sus datos iniciales; la migración de imágenes no reemplaza cambios de inventario realizados por el administrador.

## 6 Aceptación y trazabilidad

El flujo principal se acepta al completar una compra con envío, observar su comprobante, encontrar el pedido en administración y verificar que el carrito quede vacío y el stock disminuya. El flujo alternativo se acepta al rechazar una tarjeta, conservar el estado y aprobar un reintento.

| Requisitos | Casos Jasmine | Verificación adicional |
| --- | --- | --- |
| RF01 a RF04 | UT19 a UT23 y UI01 a UI07 | Inicio, catálogo y categorías en navegador. |
| RF05 y RF06 | UI08 a UI11, UI25, UI33 y UI34 | Login emergente y acceso de administrador. |
| RF07 | UI12 y UI18 a UI20 | Rutas informativas y blog. |
| RF08 a RF13 | UT01 a UT18, UI15, UI16 y CK01 a CK08 | Rechazo, reintento aprobado y revisión del pedido. |
| RF14 a RF19 | UT24, UT25, UT28 a UT31, UI13, UI14, UI17 y UI26 a UI37 | Recorrido de panel y CSV de inventario. |
| RNF01 a RNF05 | UT26 y UT27; suite de rutas | Build y revisión a 390 y 1440 px. |

### Condiciones de entrega

La entrega debe incluir código en una rama de trabajo, lockfile, pruebas Jasmine ejecutables, informe de cobertura con métricas y brechas, propuesta de pruebas y este ERS. El código se revisa localmente antes de publicar.

### Límites y evolución

La demo no ofrece sincronización entre dispositivos, autorización del lado del servidor, cifrado de contraseñas, correo real ni pagos o logística reales. Una versión productiva requiere backend, base de datos, autenticación y pasarela de pagos, además de pruebas de integración sobre esos servicios.

No se establece un SLA, una certificación de accesibilidad ni un porcentaje obligatorio de cobertura porque no forman parte de la rúbrica disponible. Los resultados medidos y las pruebas pendientes se describen de manera separada en el informe de testing.

### Fuentes del proyecto

Repositorio base: https://github.com/BDecinti/Ecommerce-full-stack-2. Contratos y organización: README.md. Implementación: src y pruebas en tests. Esta especificación documenta la versión local preparada para revisión el 21 de octubre de 2026.
