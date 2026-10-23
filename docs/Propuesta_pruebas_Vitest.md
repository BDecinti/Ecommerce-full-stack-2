# Propuesta de pruebas con Vitest

Estrategia y escenarios de validación de MiTienda

23 de octubre de 2026

## 1 Estrategia y alcance

La estrategia combina reglas unitarias, componentes React y recorridos integrados de la compra. Vitest ejecuta los casos y mide la cobertura con su proveedor V8; React Testing Library dispara eventos y consulta la interfaz por nombres accesibles. JSDOM provee el DOM simulado. La configuración se encuentra en vite.config.js y src/test/setup.js.

Se implementaron 116 casos automatizados. Cada archivo .test.jsx o .test.js está junto al componente o módulo probado. Por ejemplo, ProductCard.jsx y ProductCard.test.jsx comparten src/components. Los 24 componentes reutilizables tienen un archivo de pruebas propio, incluidos los 9 del panel. src/App.test.jsx cubre rutas e integración; src/test solo contiene utilidades. Cada caso limpia el DOM y el almacenamiento.

| Tipo exigido | Aplicación concreta | Casos |
| --- | --- | --- |
| Renderizado | Tarjeta, inicio, catálogo vacío, rutas y panel. | UI01, UI04, UI06, UI07, UI18 a UI32 |
| Props | Producto, insignia y configuración inicial de filtros. | UI01 y UI05 |
| Estado | Carrito, catálogo, formularios y pedido persistente. | UI02, UI03, UI11, UI14 a UI17 |
| Eventos | Click, escritura, selección, envío y cambio de estado. | UI05, UI08, UI09, UI12, UI35 a UI37 y CK01 a CK08 |

### Pruebas de los componentes

CP01 a CP22 comprueban navegación, diálogos, cierre con Escape, foco, buscador, contador del carrito, avisos temporizados y carrusel. CP23 a CP34 cubren título, iconos, barra lateral, estados, datos del pedido, subtotales y cantidades limitadas al stock. CP35 a CP40 verifican filtros, límites de precio e imágenes con respaldo local ante errores.

### Organización del equipo

El README asigna catálogo a Alessandro, compra y usuarios a Nicolás y administración a Bruno. La revisión de estas pruebas puede repartirse por esas áreas.

### Ejecución reproducible

Con Node.js 24, ejecutar npm ci, npm test, npm run test:coverage y npm run build. Los resultados de casos se generan en reports/vitest-results.json y los porcentajes en coverage/coverage-summary.json. coverage/index.html permite inspeccionar líneas no ejercitadas.

## 2 Casos prioritarios de compra

| Caso | Preparación y acción | Resultado esperado |
| --- | --- | --- |
| CK01 | Entrar al pago con carrito vacío. | No aparece confirmación de pago; se ofrece catálogo. |
| CK02 y CK03 | Seleccionar envío y probar celular inválido. | Dirección requerida; costo visible; contacto inválido bloquea avance. |
| CK04 | Un producto de $10.000, envío y tarjeta 4242. | Pedido de $14.990, dirección registrada, stock -1 y carrito vacío. |
| CK05 | Mismo carrito con tarjeta 4000 terminada en 0002. | Rechazo; stock, carrito y pedidos sin cambios. |
| CK06 | Después del rechazo, cambiar a 4242 y confirmar. | Un pedido de retiro, sin cobro de envío. |
| CK07 | Ingresar otro número de tarjeta. | La revisión se bloquea con un error explicativo. |
| CK08 | Completar envío, avanzar y volver. | La dirección y los datos del receptor permanecen. |

### Casos de límites y reglas

UT01 comprueba $99.999 y $100.000 para envío gratuito. UT03 a UT08 verifican los campos de entrega por separado. UT10 a UT15 cubren ambos números demo, formato y vencimiento. UT16 incluye cantidad cero, negativa, fraccionaria, superior al stock y producto inexistente.

### Integridad de administración

UI14 verifica crear, editar, descontar, reponer y eliminar en ProductContext. UI35 crea una categoría desde su formulario. UI36 rechaza un código duplicado. UI37 cancela un pedido, comprueba la reposición y verifica el bloqueo de cambios posteriores.

## 3 Propuestas de ampliación

Los siguientes escenarios se proponen para una siguiente iteración. No se contabilizan como aprobados ni aumentan la cobertura informada hasta contar con su implementación y ejecución.

| Prioridad | Prueba propuesta | Motivo |
| --- | --- | --- |
| Alta | Crear, editar y eliminar por interfaz todos los registros permitidos; verificar dependencias. | Ampliar la regresión del panel más allá de rutas, código duplicado y categoría nueva. |
| Alta | Simular cuota de almacenamiento, datos con estructura inválida y dos pestañas editando. | La persistencia actual es local y las escrituras no constituyen una transacción de servidor. |
| Alta | Cambiar stock o precio desde administración durante la revisión de compra. | Detectar cambios concurrentes y mantener el resumen coherente. |
| Media | Navegación completa por teclado, lector de pantalla y contraste medido. | Complementar etiquetas, foco visible y diálogo nativo. |
| Media | Ejecutar la misma compra en Firefox, Safari y Android e iOS reales. | La revisión de navegador ejecutada corresponde a Edge en Windows. |
| Posterior | Integración con API, autenticación, correo y pasarela sandbox cuando exista backend. | Estos servicios no están implementados en esta entrega. |

### Criterios de revisión

Toda corrección funcional debe acompañarse de un caso que reproduzca el fallo. La suite y el build deben pasar antes de integrar cambios. La cobertura se evalúa por riesgo y por líneas sin ejecutar; un porcentaje global no sustituye la revisión de los flujos.

Se aplica la corrección del docente: Vitest reemplaza al ejecutor anterior y los casos se guardan junto a sus componentes. npm test ejecuta una vez; npm run test:watch repite al editar. Los componentes se verifican por su comportamiento visible, propiedades, estado y eventos.
