# Cobertura de testing

Resultados medidos y trazabilidad de las pruebas de MiTienda

23 de octubre de 2026

## 1 Resultado de la ejecución

La suite de 41 archivos terminó con 116 pruebas aprobadas de 116, sin fallos. Las pruebas cubren reglas del catálogo y compra, componentes React, estado compartido, navegación y regresión del panel. La revisión funcional anterior completó compra rechazada, reintento aprobado y descarga del inventario. La revisión del 23 de octubre verifica separación de acciones en escritorio y móvil y la vista HTML portátil.

| Métrica global de src | Cubierto | Total | Porcentaje |
| --- | --- | --- | --- |
| Líneas | 807 | 966 | 83.54 % |
| Sentencias | 927 | 1124 | 82.47 % |
| Funciones | 349 | 428 | 81.54 % |
| Ramas | 489 | 703 | 69.55 % |

La medición incluye todos los archivos JavaScript y JSX de src, aunque no se importen en un caso. Excluye CSS, fotografías, archivos .test y src/test. Se usa @vitest/coverage-v8, versión 5.0.5. Las métricas se calculan con el mapeo de código de Vitest; no son directamente comparables con las del ejecutor anterior.

La cobertura describe la ejecución automatizada, no certifica que todo el sistema esté libre de errores. La revisión visual y los recorridos en Edge se informan por separado y no se suman a los porcentajes de Vitest.

### Entorno y reproducción

Windows, Node.js 24, Vitest 5.0.5, React Testing Library y JSDOM. Comandos: npm ci; npm test; npm run test:coverage; npm run build. Los scripts se encuentran en package.json, vite.config.js y src/test/setup.js.

Los reportes de datos se generan en reports/vitest-results.json y coverage/coverage-summary.json. El reporte navegable se encuentra en coverage/index.html. La revisión corresponde a la versión local basada en 396c877.

## 2 Cobertura de módulos relevantes

| Archivo de src | Líneas | Funciones | Ramas |
| --- | --- | --- | --- |
| components/Header.jsx | 94.73 % | 100 % | 83.33 % |
| components/ConfirmDialog.jsx | 100 % | 100 % | 91.66 % |
| components/CartMessage.jsx | 100 % | 100 % | 100 % |
| components/admin/OrderProductPicker.jsx | 100 % | 100 % | 100 % |
| utils/checkout.js | 100 % | 100 % | 100 % |
| pages/checkout/Payment.jsx | 91.52 % | 86.66 % | 96.22 % |
| utils/filtrarProductos.js | 100 % | 100 % | 100 % |
| components/ProductFilters.jsx | 100 % | 100 % | 100 % |
| context/CartContext.jsx | 100 % | 95.83 % | 77.77 % |
| context/ProductContext.jsx | 100 % | 100 % | 100 % |
| context/AuthContext.jsx | 100 % | 100 % | 100 % |
| utils/reporteVentas.js | 98.07 % | 95.23 % | 96.66 % |
| pages/admin/ProductReports.jsx | 91.66 % | 85.71 % | 57.14 % |

### Verificación en navegador

Edge en Windows recorrió 23 rutas de tienda y administración sin errores de JavaScript. Se comprobó búsqueda de G502, carrito, dirección, rechazo con conservación del carrito, reintento aprobado, pedido persistido y descarga CSV. Se revisó el inicio en 1440 por 1000 px y en 390 por 844 px; el documento móvil midió 390 px, sin desbordamiento.

### Brechas y alcance

Los porcentajes inferiores a 100 % señalan rutas o funciones que requieren más casos. La tabla de módulos no representa una meta aprobada por el docente. La propuesta complementaria detalla las ampliaciones sugeridas.

La navegación del panel prueba que las vistas se presentan; no equivale a probar todas las combinaciones de sus formularios. No se ejecutaron pruebas sobre un backend, pagos bancarios, correo real, sincronización entre equipos, carga concurrente o certificación de accesibilidad.

### Registro de casos

Las páginas siguientes enumeran todos los casos ejecutados y sus estados. UT identifica reglas unitarias, UI componentes y navegación, CK compra integrada y CP los nuevos casos de componentes reutilizables. Los casos de compra ejercitan contextos reales y almacenamiento del navegador simulado.

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
| UT20 | combina marca precio y disponibilidad | Aprobada |

## 4 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
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
| UI08 | login informa credenciales inválidas | Aprobada |
| UI09 | cliente demo puede iniciar sesión y cierra el modal | Aprobada |

## 5 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| UI10 | registro público no ofrece rol administrador | Aprobada |
| UI11 | registrar normaliza correo y bloquea duplicados y rol admin | Aprobada |
| UI12 | contacto guarda consulta local y confirma sin enviar correo | Aprobada |
| UI13 | inventario filtra stock crítico | Aprobada |
| UI14 | CRUD de producto y stock actualiza catálogo | Aprobada |
| UI15 | carrito reduce elimina y vacía sin superar stock | Aprobada |
| UI16 | catálogo eliminado retira el producto del carrito | Aprobada |
| UI17 | pedidos conservan identificador y cambios de estado | Aprobada |
| UI18 | muestra /about | Aprobada |
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

## 6 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| UI30 | renderiza /admin/orders para administrador | Aprobada |
| UI31 | renderiza /admin/reports para administrador | Aprobada |
| UI32 | renderiza /admin/profile para administrador | Aprobada |
| UI33 | cliente no accede al panel | Aprobada |
| UI34 | login emergente se abre desde la tienda | Aprobada |
| UI35 | categoría nueva se crea y navega al listado | Aprobada |
| UI36 | producto nuevo valida código duplicado | Aprobada |
| UI37 | cancelar pedido devuelve stock una sola vez | Aprobada |
| CK01 | no permite pagar un carrito vacío | Aprobada |
| CK02 | envío solicita dirección y muestra costo | Aprobada |
| CK03 | contacto inválido bloquea el paso a tarjeta | Aprobada |
| CK04 | aprueba envío registra total descuenta stock y vacía | Aprobada |
| CK05 | rechazo conserva carrito stock y pedidos | Aprobada |
| CK06 | reintento aprobado crea un único pedido | Aprobada |
| CK07 | tarjeta no autorizada bloquea revisión | Aprobada |
| CK08 | volver entre pasos conserva los datos de entrega | Aprobada |
| CP01 | enlaza los antecesores y marca la página actual | Aprobada |
| CP02 | oculto no presenta acciones | Aprobada |
| CP03 | presenta las props, enfoca cancelar y confirma al pulsar | Aprobada |
| CP04 | cancelar, Escape y fondo cancelan; el contenido no cancela | Aprobada |

## 7 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| CP05 | abre el diálogo nativo y presenta el formulario | Aprobada |
| CP06 | cerrar, cancelar nativo y fondo notifican sin cerrar por clic interno | Aprobada |
| CP07 | cerrado no muestra un formulario interactivo | Aprobada |
| CP08 | precarga q y envía la búsqueda recortada y codificada | Aprobada |
| CP09 | búsqueda vacía navega al catálogo sin q | Aprobada |
| CP10 | abre el portal y Escape lo cierra | Aprobada |
| CP11 | cierra al elegir categoría y al pulsar fuera | Aprobada |
| CP12 | muestra enlaces de categorías y resalta la categoría activa | Aprobada |
| CP13 | ofrece catálogo, información de la empresa y registro | Aprobada |
| CP14 | refleja las unidades del carrito y abre/cierra el inicio de sesión | Aprobada |
| CP15 | administrador ve su panel y cerrar sesión actualiza el header | Aprobada |
| CP16 | se oculta al bajar y reaparece al subir | Aprobada |
| CP17 | confirma el añadido y desaparece después de tres segundos | Aprobada |
| CP18 | otro añadido reinicia el tiempo y el enlace cierra el aviso | Aprobada |
| CP19 | flechas y puntos cambian el banner y vuelven al principio | Aprobada |
| CP20 | avanza automáticamente, pausa con el puntero y reanuda | Aprobada |
| CP21 | activa el botón al superar el umbral y desplaza hasta arriba | Aprobada |
| CP22 | cambia el contenido de Outlet al navegar | Aprobada |
| CP23 | presenta título, descripción y acciones recibidas | Aprobada |
| CP24 | usa el tamaño recibido y oculta el icono decorativo al lector | Aprobada |

## 8 Casos ejecutados

| ID | Verificación | Estado |
| --- | --- | --- |
| CP25 | marca la sección activa y ofrece el retorno a la tienda | Aprobada |
| CP26 | traduce el estado y conserva estados desconocidos | Aprobada |
| CP27 | acepta props, todos y comunica el valor seleccionado | Aprobada |
| CP28 | envío presenta dirección completa y teléfono | Aprobada |
| CP29 | retiro omite dirección; envío sin teléfono indica su ausencia | Aprobada |
| CP30 | presenta cantidad, subtotal y total de los items recibidos | Aprobada |
| CP31 | muestra cantidades y deshabilita agotados | Aprobada |
| CP32 | limita al stock, elimina negativos y redondea las fracciones | Aprobada |
| CP33 | presenta pedido, entrega, estado y enlace al detalle | Aprobada |
| CP34 | lista vacía conserva los encabezados sin pedidos ficticios | Aprobada |
| CP35 | combina marca, orden y límites de precio mediante sus eventos | Aprobada |
| CP36 | muestra límites incompatibles y permite quitar una marca seleccionada | Aprobada |
| CP37 | presenta la ruta local y las propiedades de accesibilidad y carga | Aprobada |
| CP38 | conserva la URL HTTPS de una imagen externa | Aprobada |
| CP39 | reemplaza la imagen fallida por el respaldo local y tolera otro error | Aprobada |
| CP40 | usa el respaldo sin src y actualiza la imagen al recibir otras props | Aprobada |
