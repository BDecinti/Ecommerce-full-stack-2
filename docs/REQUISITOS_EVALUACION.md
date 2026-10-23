# Requisitos de la Evaluación 2

Indicación actualizada del docente (23 de octubre de 2026): ejecutar las pruebas con Vitest y ubicar los archivos `.test.jsx` junto a los componentes correspondientes.

Este documento reúne los requisitos de la Evaluación 2 del proyecto académico de Full Stack II.

---

## 1. Objetivo de la evaluación

El equipo continuará desarrollando su tienda online con foco en el **frontend**, usando **React** y añadiendo nuevos flujos de navegación. Se proporciona un **template en HTML** como guía para que los estudiantes tomen ideas y actualicen sus proyectos con el framework. Además, se deben realizar pruebas para asegurar la calidad y el correcto funcionamiento de los componentes.

El template HTML de referencia (Figura 1) muestra una tienda de videojuegos con: barra superior con logo, buscador (campo "Buscar" + botón), botones "Iniciar Sesión" y "Crear Cuenta", menú de navegación (Home, Categorías con desplegable, Ofertas, Nosotros, Blog, Contacto), botón verde de carrito con el total (ej. "Carrito $5.000"), un carrusel de banners (1200x300, "Nuevos Lanzamientos - Descubre los últimos juegos disponibles en nuestra tienda") y una sección "Categorías" con tarjetas de imagen (400x200).

---

## 2. Requisitos del proyecto

1. **Migración de HTML a React**
   - Convertir las páginas HTML existentes en componentes de React reutilizables.
   - Asegurar que cada componente maneje su propio estado y propiedades (props) de manera eficiente.

2. **Archivo de datos en JavaScript**
   - Crear un archivo JavaScript que actúe como fuente de datos simulada (similar a una base de datos) para la aplicación.
   - Implementar funciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los datos dentro de ese archivo JS.

3. **Integración de persistencia**
   - Conectar el archivo de persistencia con los componentes de React para gestionar datos en tiempo real y actualizar la interfaz de usuario según sea necesario.

4. **Diseño responsivo con Bootstrap**
   - Incorporar Bootstrap para que el diseño sea responsivo y ofrezca una experiencia óptima en móviles, tabletas y escritorios.

5. **Vistas adicionales**
   - Añadir nuevas vistas según los requerimientos del negocio o cliente, como paneles de administración o páginas de detalle de productos.

6. **Interactividad mejorada**
   - Incorporar características interactivas con React, como formularios avanzados, filtros de búsqueda y navegación mejorada.

7. **Configuración de pruebas**
   - Configurar el entorno de pruebas usando **Vitest y React Testing Library** para ejecutar pruebas unitarias en componentes de React.

8. **Desarrollo de pruebas unitarias**
   - Escribir pruebas que verifiquen la lógica y el comportamiento de los componentes, asegurando que cada parte funcione como se espera.

### Buena práctica recomendada: Single Responsibility
Al crear un componente de React se debe seguir el principio de "Single Responsibility":
- Cada componente tiene una única responsabilidad o propósito en la aplicación (más fácil de entender, probar y reutilizar).
- Nombre claro y descriptivo.
- Usar **props** para recibir datos y funciones necesarias.
- Manejar estado propio solo cuando sea necesario.
- Mantener el JSX limpio y legible, dividiendo las partes complejas en componentes más pequeños.

---

## 3. Actualización del flujo entre páginas

Hay dos diagramas de navegación: uno para la **Tienda** (pública) y otro para el **Administrador**. En los diagramas, las cajas **verdes** son las vistas **nuevas** de esta entrega; las blancas son las que ya existían. Los contenidos de cada diseño son **sugerencias** para el desarrollo del proyecto.

### 3.1 Vistas de la tienda (públicas, cara visible de la tienda)

Se reorganiza la estructura de las páginas y se añaden otras complementarias.

Flujo de navegación de la TIENDA:
- Página principal (Home)
- Productos → Detalle de productos (ambos con ícono de carrito, es decir, se puede añadir al carrito)
- Registro de usuario
- Iniciar sesión (enlaza hacia Registro de usuario)
- Nosotros
- Blogs → Detalle blog #1 y Detalle blog #2
- Contacto
- **Categorías → Categoría #1** (NUEVA)
- **Comprar → Comprar → Pago correcto / Pago con error** (NUEVA)
- **Ofertas** (NUEVA)

#### Nuevas vistas de la tienda

**a) Categorías**
- Vista que separa los productos por categorías.
- Diseño propuesto (Figura 4): navbar igual al resto, fila de tarjetas de categorías (Categoría 1 a 4, con imagen 100x100) y debajo la sección "Categoría 1" con una grilla de tarjetas de producto (imagen 400x300 con nombre).

**b) Compra** (carrito + checkout + resultado)
- Se incorpora **Checkout** (paso de pago): el cliente introduce la dirección de envío y selecciona opciones de entrega.
- Se incorporan nuevas vistas para indicar si la compra fue exitosa o no, y se genera un resumen.

*Carrito de compra (Figura 5):*
- Aviso informativo (alert de Bootstrap, descartable) que indica que es una vista de carrito diseñada para aprender y demostrar la implementación mediante JS, y que la información se obtiene mediante JS y se almacena en **localStorage**.
- A la izquierda, "Lista de productos": tarjetas de juegos (ej. The Legend of Zelda, Super Mario Odyssey, Minecraft, Fortnite, Overwatch, Red Dead Redemption 2, Among Us, The Witcher 3) con imagen, nombre, categoría/plataforma, precio (algunos con precio tachado y precio en oferta, Fortnite "FREE"), stock disponible y botón "Añadir".
- A la derecha, "Carrito de Compras": tabla con columnas Imagen, Nombre, Precio, Cantidad (con controles +/-), Subtotal y Acciones (botón rojo "Eliminar"), fila de Total, y botones "Limpiar" y "Comprar ahora".
- El botón del carrito en la navbar muestra el total actualizado.

*Checkout (Figura 6):*
- Tarjeta "Carrito de compra" con la tabla de productos (Imagen, Nombre, Precio, Cantidad, Subtotal) y un recuadro azul "Total a pagar: $ X".
- Sección **Información del cliente**: Nombre*, Apellidos*, Correo* (obligatorios).
- Sección **Dirección de entrega de los productos**: Calle*, Departamento (opcional, ej. "603"), Región* (select, ej. Región Metropolitana de Santiago), Comuna* (select, ej. Cerrillos), Indicaciones para la entrega (opcional, textarea, ej. "Entre calles, color del edificio, no tiene timbre").
- Botón verde "Pagar ahora $ X".
- **Nota: si el usuario ha iniciado sesión, toda esta información se añade de forma automática.**

*Compra exitosa (Figura 7):*
- Título con ícono de check: "Se ha realizado la compra. nro #20240705" y código de orden (ej. ORDER12345).
- Muestra los datos del cliente y la dirección de entrega (en campos de solo lectura), el detalle de productos, "Total pagado: $ X".
- Botones: "Imprimir boleta en PDF" (rojo) y "Enviar boleta por email" (verde).

*Pago con error (Figura 8):*
- Título con ícono de error: "No se pudo realizar el pago. nro #20240705" y "Detalle de compra".
- Botón verde "VOLVER A REALIZAR EL PAGO".
- Muestra los mismos datos del cliente, dirección y detalle de productos con el total.

**c) Ofertas**
- Vista que muestra todos los productos que están en oferta.

### 3.2 Vista del administrador

El desarrollo del sistema administrativo es un proceso colaborativo, donde el docente propone y guía el flujo de trabajo. La propuesta es una **hoja de ruta inicial** que los estudiantes pueden adaptar y personalizar, experimentando con distintas estrategias y aplicando resolución de problemas en un contexto práctico, para fortalecer competencias técnicas y de gestión de proyectos, creatividad e innovación, y desarrollar un sistema administrativo funcional y eficaz.

*Diseño propuesto del panel (Figura 9)* (ruta de ejemplo: /admin/index.html):
- Encabezado "Company name" y barra lateral con: Dashboard, Órdenes, Productos, Categorías, Usuarios, Reportes, Perfil, y abajo botones "Tienda" (oscuro) y "Cerrar Sesión" (rojo).
- Dashboard con tarjetas de métricas: **Compras** (ej. 1,234; "Probabilidad de aumento: 20%"), **Productos** (ej. 400; "Inventario actual: 500"), **Usuarios** (ej. 890; "Nuevos usuarios este mes: 120").
- Debajo, tarjetas de acceso rápido: Dashboard (visión general de métricas y estadísticas clave), Órdenes (gestión y seguimiento de órdenes de compra), Productos (administrar inventario y detalles), Categorías (organizar productos en categorías), Usuarios (gestión de cuentas y roles), Reportes (informes detallados de operaciones), Perfil (información personal y configuración de cuenta), Tienda (ver la tienda en tiempo real y los reportes de los usuarios).

*Flujo de navegación del ADMINISTRADOR (Figura 10)* (en verde = nuevas vistas):
- Home / Dashboard
- **Órdenes / Boletas → Mostrar boleta** (NUEVA)
- Producto →
  - Nuevo producto
  - Mostrar producto → Editar producto
  - **Listado de productos críticos** (NUEVA)
  - **Reportes** (NUEVA)
- Categoría →
  - Nueva categoría
  - Editar usuario (tal como aparece en el diagrama; probablemente debería ser "Editar categoría")
- Usuario →
  - Nuevo usuario
  - Mostrar usuario → Editar usuario y **Historial de compras** (NUEVA)
- **Reportes** (NUEVA)
- **Perfil** (NUEVA)

Nota del documento: ver el template HTML, donde se detalla completamente este sistema.

---

## 4. Propuesta de pruebas con Vitest (alcance propuesto por el docente)

Usar Vitest para escribir y ejecutar pruebas unitarias que aseguren la funcionalidad y calidad del código de la aplicación React, verificando renderizado, props, estado y eventos.

- **Pruebas de renderizado**
  - *Renderizado correcto:* los componentes se renderizan con los datos proporcionados. Tarea: asegurar que los componentes de lista rendericen todos los elementos de un conjunto de datos.
  - *Renderizado condicional:* los componentes muestran u ocultan elementos según condiciones. Tarea: verificar que un mensaje de error solo se muestre cuando hay un error presente.
- **Pruebas de propiedades (props)**
  - *Propiedades recibidas:* los componentes reciben y usan las props adecuadas. Tarea: asegurar que un componente de botón reciba correctamente la etiqueta y la función de evento `onClick`.
- **Pruebas de estado (state)**
  - *Gestión del estado:* comprobar la lógica de cambios de estado. Tarea: verificar que el estado de un formulario cambie correctamente cuando el usuario introduce texto.
- **Pruebas de eventos**
  - *Simulación de eventos:* simular eventos de usuario para verificar que los componentes reaccionen como se espera. Tarea: simular un clic en un botón y comprobar que el estado del componente cambie o que se ejecute una función específica.

---

## 5. Instrucciones para la Entrega II

La entrega consta de 2 partes:
1. Entrega y presentación de la solución de la propuesta.
2. Ronda de preguntas abiertas: **cada integrante del grupo** responde preguntas formuladas por el docente, que evalúan la comprensión técnica y los **cambios realizados en GitHub** durante el desarrollo del frontend.

El equipo debe:
- Definir los requerimientos, herramientas y propuestas del proyecto mediante un **documento ERS** (documento actualizado).
- Entregar un **documento de cobertura del testing**: propuesta y análisis de los tests realizados.

### Entregables
- Enlace de GitHub público del proyecto frontend.
- Proyecto frontend comprimido.
- Documento ERS (actualizado, V2).
- Documento de cobertura del testing.

### Presentación del caso
- 15 minutos por equipo, más 5 minutos para una ronda de preguntas.
- Presentación del desarrollo funcional integrado con el backend y el frontend.
- Ronda de preguntas abiertas.

---

## 6. Cómo quiero que me ayudes

- Prioriza cumplir los requisitos de la sección 2 y construir todas las vistas de la sección 3 (las nuevas en verde son obligatorias dentro de la entrega).
- Respeta el principio de Single Responsibility: componentes pequeños, reutilizables, con nombres claros, props y estado solo cuando haga falta.
- Mantén el código simple y comprensible, porque **cada integrante debe poder explicarlo** en la ronda de preguntas. Explica brevemente las decisiones importantes.
- Haz commits pequeños y con mensajes claros, ya que se evaluarán los cambios en GitHub.
- Usa Bootstrap para el diseño responsivo, un archivo JS de datos simulados con CRUD, y localStorage para persistir el carrito y otros datos cuando corresponda.
- Configura Vitest + React Testing Library y escribe pruebas de renderizado, props, estado y eventos; ayúdame también a documentar la cobertura para el documento de testing.
- Cuando algo del documento sea ambiguo (por ejemplo, fechas, rúbrica o detalles del backend, que no se indican), pregúntame antes de asumir.
