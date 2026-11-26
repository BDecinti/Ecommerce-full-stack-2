# Demostración local de MiTienda

Extrae el proyecto y abre INICIAR_TIENDA.cmd en Windows, o ejecuta npm ci y npm run dev:full. La primera preparación descarga dependencias y necesita Internet. Abre http://127.0.0.1:5173/ y mantén ambos servicios encendidos.

1. Recorre el inicio, categorías y filtros. Se conservan los colores oscuro y verde lima.
2. Ingresa como cliente@duoc.cl con Cliente123! y recarga la página. Debe aparecer Mis compras y mantenerse la cuenta.
3. Escribe /admin/users en la dirección. Debe aparecer acceso restringido. Una petición a la API sin JWT tampoco entrega los usuarios.
4. Agrega un producto y entra al checkout. Selecciona envío, completa domicilio y celular y prueba la tarjeta 4000000000000002 con datos ficticios. El rechazo debe conservar carrito y stock.
5. Cambia a 4242424242424242, vencimiento futuro y CVV 123. Debe guardarse un pedido con total calculado en el servidor, vaciarse el carrito y aparecer la compra en Mis compras.
6. Cierra sesión y recarga. Una ruta privada debe pedir ingreso. Escribir un rol admin en localStorage no debe conceder acceso.
7. Ingresa como vendedor@duoc.cl con Vendedor123!. El menú muestra productos, pedidos y perfil. Usuarios y categorías administrativas deben estar restringidos.
8. Ingresa como admin@duoc.cl con Admin123!. Comprueba dashboard y CRUD. Crea una categoría de prueba sin productos, edítala y elimínala. Los usuarios se desactivan y los productos se retiran conservando su historial.
9. Abre http://127.0.0.1:8080/swagger-ui.html. Revisa los contratos REST, los esquemas y bearerAuth. Obtén CSRF antes de probar formularios y usa un UUID en Idempotency-Key al comprar.
10. Revisa la tienda en vista móvil y comprueba que botones y formularios no se superponen. Reinicia el backend y verifica que la base conserva los cambios confirmados.

Para presentar el proyecto, acompaña el recorrido con ERS_v3.docx, Backend_y_seguridad.docx, Cobertura_testing.docx y Propuesta_pruebas_Vitest.docx. Los datos y tarjetas son de demostración. No se realizan cobros ni envíos reales.

Las pruebas se repiten con npm run test:coverage y npm run test:backend. La compilación completa usa npm run build:full. Detén el proceso que esté usando el JAR antes de reconstruirlo en Windows.
