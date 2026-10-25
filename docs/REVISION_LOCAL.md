# Revisión local de MiTienda

Esta entrega reúne la migración a Vitest, las pruebas de componentes y los informes actualizados. La revisión funcional parte de la versión `396c877`.

## Ejecutar

Requiere Node.js 24 o superior.

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Abrir la URL que imprime Vite, normalmente http://127.0.0.1:5173/.

## Recorrido sugerido

1. Revisar el inicio: categorías y dos selecciones de cuatro productos sin repetir.
2. Abrir Categorías, entrar a Teclados y mouse y buscar `g502`.
3. Añadir el mouse al carrito e ir a pagar.
4. Elegir envío y completar nombre, correo ficticio, celular válido, calle, comuna y región.
5. Probar rechazo con `4000 0000 0000 0002`, titular ficticio, `12/30` y CVV `123`. El carrito y el stock se conservan.
6. Pulsar reintentar y usar `4242 4242 4242 4242`. Se crea un pedido, se descuenta el stock y se vacía el carrito.
7. Abrir el login del encabezado e ingresar como `admin@duoc.cl` / `12345`.
8. Revisar el pedido en Pedidos. El detalle conserva la dirección. Una cancelación devuelve las unidades una vez.
9. Ir a Productos → Reporte de inventario, filtrar críticos y descargar el CSV.
10. Revisar Nosotros, Blog y Contacto en el footer. La consulta de contacto se guarda como demostración local.

El cliente demo es `cliente@duoc.cl` / `123`. Las cuentas creadas desde el registro público reciben siempre el rol cliente.

## Verificación

```powershell
npm test
npm run test:coverage
npm run build
```

Vitest ejecuta reglas, renderizado, props, estado, eventos y compra integrada en JSDOM. Los archivos de resultados se generan en `reports/` y `coverage/`; estas carpetas no se versionan.

La indicación actualizada del docente se aplica con Vitest y pruebas junto al componente: por ejemplo, `src/components/ProductCard.jsx` y `src/components/ProductCard.test.jsx`. `src/test/` contiene únicamente utilidades y preparación. `npm run test:watch` repite las pruebas durante el desarrollo.

Los 24 componentes reutilizables de `src/components/`, incluido el panel, tienen un archivo de pruebas propio. También se conservan los casos de reglas, contextos, rutas y compra. La integración conserva las fotografías incorporadas por el equipo y comprueba su respaldo local ante errores de carga.

La revisión del navegador recorrió 23 rutas y comprobó la compra, rechazo, reintento y CSV. El inicio se verificó en escritorio de 1440 px y móvil de 390 px sin desbordamiento horizontal.

## Documentos

- [ERS actualizado](ERS_v2.docx) y [fuente Markdown](ERS_v2.md).
- [Propuesta de pruebas con Vitest](Propuesta_pruebas_Vitest.docx) y [fuente Markdown](Propuesta_pruebas_Vitest.md).
- [Cobertura y resultados](Cobertura_testing.docx) y [fuente Markdown](Cobertura_testing.md).

`scripts/generar_documentos.py` regenera los informes con python-docx y los resultados de la última ejecución. El Word conserva formato editable. Los PNG y PDF de revisión no forman parte de la entrega.

## Alcance de la demostración

React comparte el estado por contextos y persiste los datos en localStorage del mismo origen y navegador. La aplicación no tiene backend, autenticación de servidor, pagos reales, correo real ni sincronización entre equipos. Las credenciales de demo y los datos locales no se deben usar para información real.

El envío simulado cuesta $4.990 bajo $100.000 de subtotal; desde ese monto es gratuito. El retiro es gratuito. La tarjeta y el CVV nunca se agregan al pedido guardado.

## Evidencia de esta revisión

La carpeta evidencia incluye capturas de inicio en escritorio y móvil, entrega, pago aprobado y rechazado e inventario. También contiene los resultados de Vitest, la cobertura y las rutas verificadas en navegador.
