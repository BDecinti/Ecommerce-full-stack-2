# Cobertura de testing

Resultados medidos y trazabilidad de las pruebas de MiTienda

21 de octubre de 2026

## 1 Resultado de la ejecución

La suite terminó con 76 pruebas aprobadas de 76, sin fallos. Las pruebas cubren reglas del catálogo y compra, componentes React, estado compartido, navegación y regresión del panel. La revisión local del navegador también completó compra rechazada, reintento aprobado y descarga del inventario.

| Métrica global de src | Cubierto | Total | Porcentaje |
| --- | --- | --- | --- |
| Líneas | 4646 | 5598 | 82.99 % |
| Sentencias | 4646 | 5598 | 82.99 % |
| Funciones | 146 | 202 | 72.27 % |
| Ramas | 515 | 642 | 80.21 % |

La medición incluye todos los archivos JavaScript y JSX de src, también los que no se importan en un caso. Excluye CSS, fotografías, pruebas y dependencias. Las ramas de archivos nunca ejecutados se contabilizan según el tratamiento de V8 y c8; el porcentaje de ramas no debe interpretarse como cobertura de todas las decisiones posibles del producto.

La cobertura describe la ejecución automatizada, no certifica que todo el sistema esté libre de errores. La revisión visual y los recorridos en Edge se informan por separado y no se suman a los porcentajes de Jasmine.

### Entorno y reproducción

Windows, Node.js 24, Jasmine y JSDOM. Comandos: npm ci; npm test; npm run test:coverage; npm run build. Los scripts se encuentran en package.json y tests/run-tests.mjs.

Los reportes de datos se generan en reports/jasmine-results.json y coverage/coverage-summary.json. El reporte navegable se encuentra en coverage/index.html. La revisión corresponde a la versión local basada en 396c877.

## 2 Cobertura de módulos relevantes

| Archivo de src | Líneas | Funciones | Ramas |
| --- | --- | --- | --- |
| utils/checkout.js | 100 % | 100 % | 100 % |
| pages/checkout/Payment.jsx | 98.53 % | 77.77 % | 85.41 % |
| utils/filtrarProductos.js | 100 % | 100 % | 100 % |
| components/ProductFilters.jsx | 91.74 % | 50 % | 66.66 % |
| context/CartContext.jsx | 100 % | 100 % | 88.57 % |
| context/ProductContext.jsx | 100 % | 100 % | 100 % |
| context/AuthContext.jsx | 94.44 % | 83.33 % | 100 % |
| utils/reporteVentas.js | 100 % | 100 % | 97.67 % |
| pages/admin/ProductReports.jsx | 96.9 % | 66.66 % | 53.84 % |

### Verificación en navegador

Edge en Windows recorrió 23 rutas de tienda y administración sin errores de JavaScript. Se comprobó búsqueda de G502, carrito, dirección, rechazo con conservación del carrito, reintento aprobado, pedido persistido y descarga CSV. Se revisó el inicio en 1440 por 1000 px y en 390 por 844 px; el documento móvil midió 390 px, sin desbordamiento.

### Brechas y alcance

Los porcentajes inferiores a 100 % señalan rutas o funciones que requieren más casos. La tabla de módulos no representa una meta aprobada por el docente. La propuesta complementaria detalla las ampliaciones sugeridas.

La navegación del panel prueba que las vistas se presentan; no equivale a probar todas las combinaciones de sus formularios. No se ejecutaron pruebas sobre un backend, pagos bancarios, correo real, sincronización entre equipos, carga concurrente o certificación de accesibilidad.

### Registro de casos

Las páginas siguientes enumeran todos los casos ejecutados y sus estados. UT identifica reglas unitarias, UI componentes y navegación, y CK compra integrada. Los casos de compra ejercitan contextos reales y almacenamiento del navegador simulado.

## 3 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| UT01 | aplica envío y umbral de gratuidad | Aprobada |
| UT02 | acepta dirección y contacto válidos | Aprobada |
| UT03 | rechaza entrega con nombre inválido | Aprobada |
| UT04 | rechaza entrega con email inválido | Aprobada |
| UT05 | rechaza entrega con telefono inválido | Aprobada |
| UT06 | rechaza entrega con direccion inválido | Aprobada |
| UT07 | rechaza entrega con comuna inválido | Aprobada |
| UT08 | rechaza entrega con region inválido | Aprobada |
| UT09 | retiro no exige dirección | Aprobada |
| UT10 | acepta ambas tarjetas demo y números con espacios | Aprobada |
| UT11 | rechaza tarjeta con numero inválido | Aprobada |
| UT12 | rechaza tarjeta con titular inválido | Aprobada |
| UT13 | rechaza tarjeta con vencimiento inválido | Aprobada |
| UT14 | rechaza tarjeta con vencimiento inválido | Aprobada |
| UT15 | rechaza tarjeta con cvv inválido | Aprobada |
| UT16 | valida disponibilidad e integridad de las cantidades | Aprobada |
| UT17 | construye pedido con envío sin persistir la tarjeta | Aprobada |
| UT18 | omite dirección en pedido de retiro | Aprobada |
| UT19 | busca sin tildes y por código | Aprobada |

## 4 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| UT20 | combina marca precio y disponibilidad | Aprobada |
| UT21 | ordena sin mutar el catálogo | Aprobada |
| UT22 | devuelve vacío para límites incompatibles | Aprobada |
| UT23 | cuenta marcas y agrupa productos sin marca | Aprobada |
| UT24 | calcula valor unidades y productos críticos | Aprobada |
| UT25 | CSV escapa comillas separadores y fórmulas | Aprobada |
| UT26 | JSON corrupto usa el valor por defecto | Aprobada |
| UT27 | guarda y recupera datos versionados | Aprobada |
| UT28 | calcula inicios de día semana y mes | Aprobada |
| UT29 | desplaza fechas y compara año anterior | Aprobada |
| UT30 | excluye cancelados y respeta rango final abierto | Aprobada |
| UT31 | produce serie y desglose de ventas incluso productos eliminados | Aprobada |
| UI01 | renderiza las props y la insignia de producto | Aprobada |
| UI02 | clic añade al carrito y actualiza estado | Aprobada |
| UI03 | no permite agregar más unidades que el stock | Aprobada |
| UI04 | producto agotado deshabilita compra | Aprobada |
| UI05 | filtros notifican eventos y props | Aprobada |
| UI06 | inicio limita las selecciones a ocho productos | Aprobada |
| UI07 | búsqueda del catálogo muestra estado vacío | Aprobada |

## 5 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| UI08 | login informa credenciales inválidas | Aprobada |
| UI09 | cliente demo puede iniciar sesión y cierra el modal | Aprobada |
| UI10 | registro público no ofrece rol administrador | Aprobada |
| UI11 | registrar normaliza correo y bloquea duplicados y rol admin | Aprobada |
| UI12 | contacto guarda consulta local y confirma sin enviar correo | Aprobada |
| UI13 | inventario filtra stock crítico | Aprobada |
| UI14 | CRUD de producto y stock actualiza catálogo | Aprobada |
| UI15 | carrito reduce elimina y vacía sin superar stock | Aprobada |
| UI16 | catálogo eliminado retira el producto del carrito | Aprobada |
| UI17 | pedidos conservan identificador y cambios de estado | Aprobada |
| CK01 | no permite pagar un carrito vacío | Aprobada |
| CK02 | envío solicita dirección y muestra costo | Aprobada |
| CK03 | contacto inválido bloquea el paso a tarjeta | Aprobada |
| CK04 | aprueba envío registra total descuenta stock y vacía | Aprobada |
| CK05 | rechazo conserva carrito stock y pedidos | Aprobada |
| CK06 | reintento aprobado crea un único pedido | Aprobada |
| CK07 | tarjeta no autorizada bloquea revisión | Aprobada |
| CK08 | volver entre pasos conserva los datos de entrega | Aprobada |
| UI18 | muestra /about | Aprobada |

## 6 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| UI19 | muestra /blog | Aprobada |
| UI20 | muestra /blog/1 | Aprobada |
| UI21 | muestra /categories/7 | Aprobada |
| UI22 | muestra /products/90 | Aprobada |
| UI23 | muestra /cart | Aprobada |
| UI24 | muestra /ruta-no-existe | Aprobada |
| UI25 | muestra /admin | Aprobada |
| UI26 | renderiza /admin para administrador | Aprobada |
| UI27 | renderiza /admin/products para administrador | Aprobada |
| UI28 | renderiza /admin/categories para administrador | Aprobada |
| UI29 | renderiza /admin/users para administrador | Aprobada |
| UI30 | renderiza /admin/orders para administrador | Aprobada |
| UI31 | renderiza /admin/reports para administrador | Aprobada |
| UI32 | renderiza /admin/profile para administrador | Aprobada |
| UI33 | cliente no accede al panel | Aprobada |
| UI34 | login emergente se abre desde la tienda | Aprobada |
| UI35 | categoría nueva se crea y navega al listado | Aprobada |
| UI36 | producto nuevo valida código duplicado | Aprobada |
| UI37 | cancelar pedido devuelve stock una sola vez | Aprobada |
