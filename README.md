# Ecommerce-full-stack-2

## Ver la tienda rápidamente

Extrae el ZIP completo y abre **VER_TIENDA.html** con Chrome, Edge o Firefox. Esta vista incluye las imágenes y funciona sin instalar dependencias. Para desarrollar o ejecutar las pruebas, usa el proyecto completo.

En Windows también puedes iniciar el proyecto con **INICIAR_TIENDA.cmd** después de instalar Node.js 24.

## Revisión local y entrega actualizada

Las mejoras de tienda, compra y administración, las pruebas Vitest y los informes Word se describen en [docs/REVISION_LOCAL.md](docs/REVISION_LOCAL.md). Usa Node.js 24 o superior. Ejecuta `npm ci`, `npm run dev`, `npm test` y `npm run test:coverage`.

Esta versión incluye la migración a Vitest, pruebas junto a los componentes y los informes actualizados.

## Pruebas con Vitest

La corrección del docente se aplica con **Vitest 5**, React Testing Library y JSDOM. Vite ejecuta y compila la aplicación; Vitest ejecuta las pruebas.

```bash
npm test                   # ejecución completa, termina al finalizar
npm run test:watch         # repetir al editar durante el desarrollo
npm run test:coverage      # pruebas e informe de cobertura V8
npm run build              # comprobar la compilación
```

Cada componente reutilizable tiene su prueba en la misma carpeta:

```text
src/components/ProductCard.jsx
src/components/ProductCard.test.jsx
src/components/admin/OrderTable.jsx
src/components/admin/OrderTable.test.jsx
src/pages/checkout/Payment.jsx
src/pages/checkout/Payment.test.jsx
```

Las reglas y los contextos siguen la misma convención. `src/App.test.jsx` comprueba rutas e integración; `src/test/` solo contiene preparación y utilidades compartidas. Los casos usan expectativas sobre renderizado, props, estado y eventos, con proveedores reales para carrito, catálogo, pedidos y sesión. La ejecución genera `reports/vitest-results.json`; la cobertura se consulta en `coverage/index.html` y `coverage/coverage-summary.json`.


Proyecto semestral para el ramo de Full Stack II. Se tratará de un ecommerce 

## Cómo ejecutarlo

El proyecto está hecho con React + Vite. Requiere Node.js.

```bash
npm install     # solo la primera vez
npm run dev     # abre http://localhost:5173
```

La explicación de la migración desde HTML/JS a React está en [documentacion_migracion.md](documentacion_migracion.md).




# Plan de trabajo en equipo: Evaluación 2 (Tienda online con React)

Plan pensado para **3 estudiantes que están aprendiendo React** y necesitan trabajar en un mismo repositorio de GitHub **sin pisarse entre sí**.

Idea central: **cada persona es dueña de un área del proyecto y solo edita sus propios archivos. Lo compartido se acuerda antes y se cambia solo entre los tres.**

> En este documento "Persona A / B / C" son los 3 integrantes. Reemplacen por sus nombres en la sección 2.

---

## 1. Las 6 reglas que evitan casi todos los problemas

1. **Cada archivo tiene un dueño.** Si un archivo no es tuyo, no lo editas. Si necesitas un cambio ahí, lo pides (mensaje + issue) y lo hace su dueño.
2. **Lo compartido se define primero y se modifica poco.** Datos (`src/data/`), rutas y componentes comunes se construyen juntos en la Fase 0. Después, solo se **agregan** cosas; no se renombran ni se borran sin avisar.
3. **Antes de empezar a trabajar siempre se actualiza la rama** (`git pull` de `main`). Esto evita el clásico "trabajé 3 horas sobre una versión vieja".
4. **PRs chicos y frecuentes** (idealmente de menos de un día de trabajo). Un PR gigante = conflictos garantizados.


---

## 2. Reparto de responsabilidades (por áreas, no por tipo de tarea)

Se reparte por **vistas completas** (de punta a punta) y no "uno hace HTML, otro lógica". Así cada persona toca carpetas distintas.

| | Área | Vistas / componentes | Carpeta propia |
|---|---|---|---|
| **Alessandro** | Catálogo de la tienda + capa de datos | Home, Productos, Detalle de producto, Categorías, Categoría #1, Ofertas, Nosotros, Blogs, Detalle blog #1 y #2, Contacto | `src/pages/store/`, `src/components/catalog/`, `src/data/` |
| **Nicolas** | Usuarios y compra | Iniciar sesión, Registro, Carrito, Checkout, Pago correcto, Pago con error | `src/pages/shop/`, `src/pages/auth/`, `src/components/cart/`, `src/context/` |
| **Bruno** | Panel de administración | Dashboard, Órdenes/Boletas, Productos (nuevo, mostrar, editar, críticos, reportes), Categorías, Usuarios (nuevo, mostrar, editar, historial), Reportes, Perfil | `src/pages/admin/`, `src/components/admin/` |

Cada uno además **escribe las pruebas (Vitest) de sus propios componentes**, **en la misma carpeta del componente**, con el sufijo `.test.jsx`.

**Responsabilidades transversales** (para que nada quede sin dueño):

| Tema | Responsable principal | Apoyan |
|---|---|---|
| Mantener `main` sano y las reglas de GitHub | Persona C | Todos |
| Documento ERS V2 | Persona A (redacta) | B y C aportan su área |
| Documento de cobertura del testing | Persona B (consolida) | A y C entregan sus resultados |
| Preparar la presentación (15 min) | Todos, un bloque cada uno | |

> Persona C tiene el panel admin, que es lo más grande, pero también lo más repetitivo (formularios y tablas parecidas). Si ven que A o B terminan antes, **ayudan a C en revisión o pruebas, no editando sus archivos**.

### Carpetas compartidas (zona "de los tres")

| Carpeta / archivo | Qué es | Regla |
|---|---|---|
| `src/data/` | Datos simulados + funciones CRUD | Dueño: A. Cambios solo por PR **que revisan los 3**. Solo se agregan funciones/campos; no se renombran. |
| `src/components/common/` | Navbar, Footer, Botón, Tarjeta, etc. | Se crean en la Fase 0. Después, cambios solo por PR con aviso al grupo. |
| `src/App.jsx` / `src/routes.jsx` | Todas las rutas | Se crea completo en Fase 0 con páginas vacías. Cada uno solo reemplaza **su** componente, sin tocar las rutas de los demás. |

---

## 3. Estructura de carpetas propuesta

```
tienda-react/
├─ src/
│  ├─ components/
│  │  ├─ common/        ← compartido (Navbar, Footer, ProductCard...)
│  │  ├─ catalog/       ← Persona A
│  │  ├─ cart/          ← Persona B
│  │  └─ admin/         ← Persona C
│  ├─ pages/
│  │  ├─ store/         ← Persona A (Home, Productos, Blogs...)
│  │  ├─ auth/          ← Persona B (Login, Registro)
│  │  ├─ shop/          ← Persona B (Carrito, Checkout, Pago OK/Error)
│  │  └─ admin/         ← Persona C
│  ├─ context/          ← Persona B (estado global del carrito y sesión)
│  ├─ data/             ← Persona A (datos + CRUD, compartido)
│  ├─ test/             ← configuración y utilidades compartidas (sin casos)
│  ├─ App.jsx           ← rutas (compartido)
│  └─ main.jsx
├─ docs/                ← ERS V2, documento de testing, este plan
└─ README.md
```

---

## 4. Cómo usar Git y GitHub sin pisarse

### 4.1 Configuración inicial (una sola vez, la hace Persona C)
1. Crear el repositorio **público** en GitHub (la entrega lo exige) y agregar a los otros dos como colaboradores.
2. Agregar un `.gitignore` que incluya `node_modules/` (nunca se sube).
3. Proteger la rama `main` (Settings → Branches → Branch protection rule):
   - "Require a pull request before merging".
   - "Require approvals" = 1.
4. Crear un **tablero de tareas** (GitHub Projects) con columnas: *Por hacer / En curso / En revisión / Listo*. Cada vista del documento es una tarjeta con su dueño.

### 4.2 Flujo diario de cada persona

```bash
# 1. Siempre empezar actualizando main
git switch main
git pull

# 2. Crear una rama para la tarea (una rama por tarea chica)
git switch -c feature/personaA-pagina-productos

# 3. Trabajar, y cada cierto tiempo guardar cambios
git add .
git commit -m "feat(productos): muestra la lista de productos desde data"

# 4. Subir la rama
git push -u origin feature/personaA-pagina-productos

# 5. En GitHub: abrir Pull Request hacia main y pedir revisión a otra persona
```

**Mientras trabajas en tu rama** (si pasan más de unas horas), trae lo nuevo de `main` para no quedarte atrás:

```bash
git switch main && git pull
git switch feature/personaA-pagina-productos
git merge main
```

### 4.3 Convenciones

- **Nombre de ramas:** `feature/<persona>-<tema>` (ej: `feature/personaB-checkout`). Arreglos: `fix/<persona>-<tema>`.
- **Mensajes de commit:** `feat(area): qué hiciste` / `fix(area): qué arreglaste` / `test(area): ...` / `docs: ...`. Ejemplo: `feat(carrito): suma y resta cantidad de producto`.
- **Commits chicos y frecuentes.** Cada persona commitea su propio trabajo: en la ronda de preguntas se mira el historial de GitHub.
- **Nunca** usar `git push --force` ni `git reset --hard` sin consultar al grupo.
- **No** hacer commits de "arreglé todo" con 40 archivos.

### 4.4 Cómo revisar un PR (checklist rápido, 5 a 10 minutos)
- [ ] ¿Solo toca archivos del área de su autor (o de lo compartido, avisado)?
- [ ] ¿Se ve bien en el navegador y no rompe otras páginas?
- [ ] ¿Los nombres son claros y el componente hace una sola cosa?
- [ ] ¿Entiendo lo que hace el código? (si no, preguntar en el PR; eso es parte del aprendizaje)
- [ ] ¿Corren las pruebas?

### 4.5 Si aparece un conflicto de merge
No entrar en pánico ni borrar cosas al azar. Pasos: (1) avisar al grupo, (2) abrir el archivo en conflicto (marcas `<<<<<<<`, `=======`, `>>>>>>>`), (3) resolver **junto con la otra persona** que tocó ese archivo, (4) probar la app, (5) commit. Si ocurre seguido, es señal de que alguien está editando archivos que no son suyos.

---

## 5. Contratos compartidos (lo que se acuerda ANTES de programar)

Casi todos los "se rompió porque cambié algo de otro" vienen de que cada uno asumió una forma distinta de los datos. Por eso la Fase 0 define esto **por escrito**.

### 5.1 Forma de los datos (ejemplo; ajústenla juntos en la Fase 0)

```js
// Producto
{ id: 1, nombre: "Minecraft", precio: 2695, precioOferta: null, enOferta: false,
  categoriaId: 2, stock: 15, stockCritico: 5, imagen: "minecraft.jpg", descripcion: "..." }

// Categoría
{ id: 2, nombre: "Sandbox" }

// Usuario
{ id: 1, nombre: "Pedro", apellidos: "Hacker", correo: "pedro@example.com",
  clave: "****", rol: "cliente" /* o "admin" */, direccion: { calle, depto, region, comuna } }

// Orden / Boleta
{ id: 20240705, usuarioId: 1, fecha: "2024-07-05", estado: "pagada" /* o "error" */,
  items: [{ productoId: 2, nombre: "Minecraft", precio: 2695, cantidad: 4 }], total: 10780,
  cliente: {...}, direccionEntrega: {...} }
```

### 5.2 Nombres de las funciones del archivo de datos (CRUD)

Se acuerdan los nombres y **no se cambian después**:

```
getProductos()        getProductoPorId(id)    crearProducto(p)   actualizarProducto(id, cambios)   eliminarProducto(id)
getCategorias()       crearCategoria(c)       actualizarCategoria(id, cambios)   eliminarCategoria(id)
getUsuarios()         getUsuarioPorId(id)     crearUsuario(u)    actualizarUsuario(id, cambios)    eliminarUsuario(id)
getOrdenes()          getOrdenPorId(id)       crearOrden(o)
```

Para que los datos "persistan" y la interfaz se actualice, el archivo guarda todo en `localStorage` (así lo plantea el propio template del carrito).

### 5.3 Tabla de rutas (con dueño)

| Ruta | Vista | Dueño |
|---|---|---|
| `/` | Home | A |
| `/productos`, `/productos/:id` | Productos, Detalle | A |
| `/categorias`, `/categorias/:id` | Categorías | A |
| `/ofertas` | Ofertas | A |
| `/nosotros`, `/blogs`, `/blogs/:id`, `/contacto` | Páginas informativas | A |
| `/login`, `/registro` | Autenticación | B |
| `/carrito`, `/checkout`, `/pago-correcto`, `/pago-error` | Compra | B |
| `/admin` | Dashboard | C |
| `/admin/ordenes`, `/admin/ordenes/:id` | Órdenes / Boleta | C |
| `/admin/productos`, `/admin/productos/nuevo`, `/admin/productos/:id/editar`, `/admin/productos/criticos`, `/admin/productos/reportes` | Productos admin | C |
| `/admin/categorias`, `/admin/categorias/nueva`, `/admin/categorias/:id/editar` | Categorías admin | C |
| `/admin/usuarios`, `/admin/usuarios/nuevo`, `/admin/usuarios/:id`, `/admin/usuarios/:id/editar` | Usuarios admin | C |
| `/admin/reportes`, `/admin/perfil` | Reportes, Perfil | C |

### 5.4 Qué se comparte entre áreas y cómo
- **Carrito y sesión** (B) se ofrecen al resto mediante un *Context* con funciones claras: `agregarAlCarrito(producto)`, `usuarioActual`. Persona A solo **usa** `agregarAlCarrito` en el botón "Añadir"; no toca la lógica del carrito.
- **Datos** (A) se consumen **solo a través de las funciones CRUD**. Nadie lee `localStorage` directo desde sus componentes.
- **Componentes comunes** (Navbar, ProductCard) se usan, no se copian y modifican.

---

## 6. Fases del proyecto

No conocemos la fecha de entrega, así que está en **porcentajes del tiempo total**. Cuando la tengan, conviertan cada fase en fechas reales y dejen **al menos 15% de colchón** al final.

### Fase 0: Cimientos y aprendizaje básico (≈15%) → **los tres juntos**
Esta fase es la más importante. Se hace **en conjunto** (videollamada o presencial, uno comparte pantalla y los otros miran y opinan).
- [ ] Crear el repo, ramas protegidas, tablero de tareas (4.1).
- [ ] Crear el proyecto React (con Vite) y subirlo como primer commit a `main`.
- [ ] Instalar Bootstrap y React Router.
- [ ] Crear `routes` con **todas** las rutas de la tabla 5.3, apuntando a páginas vacías ("Home – en construcción"). Así nadie edita `App.jsx` después.
- [ ] Crear los componentes comunes: Navbar y Footer (según el template HTML).
- [ ] Armar `src/data/` con datos de ejemplo y las funciones CRUD (al menos productos y categorías; el resto con la estructura lista).
- [ ] **Configurar Vitest + Testing Library y las pruebas junto a cada componente.** Confirmar que `npm test` funciona en el computador de los tres.
- [ ] Cada uno hace una prueba de todo el flujo Git: crea una rama, cambia algo mínimo, abre un PR y alguien lo revisa/aprueba.

**Hito:** los 3 pueden clonar el repo, correrlo, hacer un PR y ver las rutas funcionando.

### Fase 1: Páginas base, versión simple (≈25%) → **en paralelo, cada uno en su área**
Objetivo: que cada ruta de tu área exista y muestre **algo real**, aunque sea feo.
- **A:** Home, Productos (lista desde `getProductos()`), Detalle, páginas estáticas (Nosotros, Blogs, Contacto).
- **B:** Login y Registro (formularios simples), Carrito (agregar, quitar, total).
- **C:** Layout del panel admin (barra lateral + Dashboard), listado de productos y de usuarios.

Aprendizaje de esta fase: componentes, JSX, props, `map()` con `key`, `useState`, rutas.
**Hito:** se puede navegar por la tienda y el panel con datos reales del archivo de datos.

### Fase 2: Funcionalidad y vistas nuevas (≈25%) → en paralelo
- **A:** Categorías y Categoría #1 (filtro por categoría), Ofertas, buscador en la navbar (filtro de búsqueda), Detalle con botón "Añadir al carrito".
- **B:** Checkout con formulario completo y validaciones (campos obligatorios, autocompletar si hay sesión), Pago correcto / Pago con error, botones de boleta, carrito persistente en `localStorage`.
- **C:** CRUD completo de productos y categorías (nuevo, editar, eliminar), usuarios (nuevo, editar, historial de compras), órdenes/boletas, productos críticos.

Aprendizaje: formularios controlados, `useEffect`, Context, CRUD con estado.
**Hito:** se puede hacer una compra completa y ver reflejada la orden en el panel admin.

### Fase 3: Pulido y responsividad (≈10%)
- Revisar todas las vistas en celular, tablet y escritorio (Bootstrap).
- Reportes y Perfil del admin, mensajes de error, mejoras de interactividad.
- Limpiar código muerto y dejar nombres claros.

### Fase 4: Pruebas con Vitest (≈10%, pero escribiendo desde la Fase 1)
Idealmente **cada vez que terminan un componente importante, escriben su prueba**, en vez de dejar todo para el final. Cubrir los 4 tipos que pide el docente:
- Renderizado (una lista muestra todos los elementos; un mensaje de error solo aparece si hay error).
- Props (un botón recibe su etiqueta y su `onClick`).
- Estado (un formulario cambia su estado al escribir).
- Eventos (simular un clic y comprobar el resultado).

Meta mínima sugerida: **al menos 4 a 6 pruebas por persona**, cubriendo los 4 tipos.

### Fase 5: Documentos y ensayo (≈10%) + colchón (≈15%)
- ERS V2 y documento de cobertura del testing (**empezar a redactarlos en la Fase 2**, no al final).
- Comprimir el proyecto frontend y verificar que el enlace de GitHub es público.
- **Ensayo de la presentación** (15 min + 5 de preguntas), con preguntas cruzadas (sección 8).

---

## 7. Plan de aprendizaje de React (solo lo necesario, en este orden)

La regla es **aprender justo antes de usar**, siempre con algo concreto de tu área. Cada concepto se aprende y se aplica el mismo día.

| Orden | Concepto | Primer uso en el proyecto |
|---|---|---|
| 1 | Componentes y JSX | Navbar, Footer, una tarjeta de producto |
| 2 | Props | `ProductCard` recibe nombre, precio, imagen |
| 3 | Listas con `map()` y `key` | Lista de productos, tabla del carrito |
| 4 | `useState` | Contador de cantidad, abrir/cerrar un menú |
| 5 | Renderizado condicional | "Sin stock", mensaje de error, "Oferta" |
| 6 | Eventos y formularios controlados | Login, Checkout, formularios del admin |
| 7 | React Router | Navegación, `/productos/:id` |
| 8 | `useEffect` | Cargar datos al abrir una página |
| 9 | Context | Carrito y sesión compartidos |
| 10 | `localStorage` | Persistencia de datos y carrito |

**Cómo aprender sin frenar el avance:**
- Sesión corta semanal (30 a 45 min) donde cada uno **explica a los otros dos** un concepto que usó esa semana. Enseñar es la mejor manera de estudiar para la ronda de preguntas.
- Antes de integrar cambios, revisen el código juntos. Regla del equipo: **no se hace commit de código que no puedas explicar con tus palabras.**
- Documentación recomendada: react.dev (sección "Learn"), documentación de React Router y de Bootstrap.

---

## 8. Rutina de equipo para no desordenarse

### Comunicación
- Un grupo de chat con un mensaje al empezar a trabajar: *"Hoy toco: página de Checkout (rama feature/personaB-checkout)"*.
- Si necesitas algo de otra área (un dato nuevo, un cambio en un componente común), **lo escribes en el chat y abres un issue en GitHub**. No lo editas tú.
- Reunión corta (15 min) 2 o 3 veces por semana: qué hice, qué haré, qué me bloquea. Un fin de semana de integración antes de cada hito para probar todo junto.

### Checklist antes de abrir un PR
- [ ] Actualicé mi rama con `main` y la app sigue funcionando.
- [ ] Solo modifiqué archivos de mi área (o avisé de los compartidos).
- [ ] No subí `node_modules` ni archivos temporales.
- [ ] El nombre del PR explica qué hace y qué vista toca.
- [ ] Corrí `npm test` y pasa.

### Qué hacer cuando algo se rompe porque otro cambió algo
1. Revisar en GitHub qué PR entró últimamente a `main` (pestaña *Pull requests → Closed*).
2. Avisar en el chat con el error exacto, sin culpar a nadie.
3. Resolverlo entre quien lo detectó y el dueño del archivo. Si hace falta, revertir ese PR en GitHub (botón *Revert*) y rehacerlo mejor.
4. Agregar una **prueba** o una nota en el contrato (sección 5) para que no vuelva a pasar.

### Preparación para la ronda de preguntas (cada integrante responde)
- Cada persona debe poder explicar: **su área completa**, **cómo funciona el archivo de datos**, **cómo se conectan los componentes con los datos**, y **qué cambios hizo en GitHub** (sus ramas, PRs y commits).
- Hacer **ensayos cruzados**: A le pregunta a B sobre el checkout, B le pregunta a C sobre el CRUD de productos, C le pregunta a A sobre cómo llegan los datos a la lista de productos.
- Armar una tabla "quién hizo qué" para la presentación; las revisiones de PRs que hizo cada uno también cuentan como conocimiento del código ajeno.

---

## 9. Lectura y revisión del código

- Cada integrante debe entender los componentes y pruebas de su área.
- Revisar juntos los cambios en rutas, contextos y datos compartidos.
- Mantener nombres claros, componentes con una responsabilidad y pruebas de los comportamientos principales.
- Antes de integrar un cambio, ejecutar Vitest y comprobar la navegación en el navegador.

---

## 10. Riesgos probables y cómo evitarlos

| Riesgo | Prevención |
|---|---|
| Versiones incompatibles del ejecutor y su cobertura | Instalar con `npm ci` para usar las versiones fijadas en el lockfile. |
| Dos personas editan el mismo archivo | Tabla de propiedad (sección 2) + rutas definidas de antemano + revisión de PRs. |
| Cambian la forma de los datos y se rompe todo | Contratos (sección 5), solo agregar campos, nunca renombrar; avisar en el chat. |
| Uno avanza mucho y los otros se quedan atrás | Reuniones cortas, tablero de tareas, ayuda con revisiones/pruebas (no editando archivos ajenos). |
| Dejar documentos y pruebas para el final | Redactar el ERS y el documento de testing desde la Fase 2 y escribir pruebas a medida que se terminan componentes. |
| Alguien no puede explicar su código | Revisión cruzada de PRs, sesiones de "explícale a los demás" y ensayos de preguntas. |
| El repositorio queda desordenado o con `node_modules` | `.gitignore` desde el primer commit y README con pasos de instalación. |

---

## 11. Preguntas para confirmar con el docente

1. ¿Cuál es la **fecha de entrega** y la **rúbrica** de evaluación?
2. La presentación debe mostrar "el desarrollo funcional integrado con el **backend** y frontend". ¿Hay un backend aparte de esta entrega, o basta con el archivo JS de datos simulados?
3. Indicación actualizada del docente: usar **Vitest** y mantener cada prueba en la carpeta del componente correspondiente.
4. ¿Qué nivel de cobertura de pruebas se espera?
5. En el diagrama del admin, bajo "Categoría" aparece "Editar usuario": ¿es un error y debería ser "Editar categoría"?


---

## 12. Catálogo de componentes y su única responsabilidad

Cada componente hace **una sola cosa**. Así se pueden reutilizar en varias páginas y, si algo cambia, se toca un solo archivo. Al crear un componente nuevo, agréguenlo a esta tabla; si no se puede describir su responsabilidad en una frase, hay que dividirlo.

### Componentes de la tienda (`src/components/`)

| Componente | Única responsabilidad |
|---|---|
| `Header` | Mostrar el navbar de la tienda: logo, enlace a Categoría, buscador, sesión y carrito. |
| `SearchBar` | Recibir el texto de búsqueda y llevar a `/products?q=...`; no filtra productos. |
| `Breadcrumb` | Mostrar la ruta de navegación pequeña bajo el navbar a partir de una lista de pasos. |
| `CategoryMenu` | Mostrar el menú lateral de categorías, con sus subcategorías al pasar el mouse. |
| `ProductFilters` | Mostrar los controles de filtro (marca, precio, stock y orden); avisa los cambios, el estado vive en la página. |
| `CategoryDropdown` | Abrir y cerrar el menú desplegable de categorías del navbar (botón con icono de tres barras). |
| `Footer` | Mostrar el pie de página de la tienda. |
| `ProductCard` | Dibujar un producto en tarjeta y permitir añadirlo al carrito (deshabilitado sin stock). |
| `ConfirmDialog` | Pedir confirmación al usuario y avisar su respuesta por callbacks; no sabe qué se está confirmando. |
| `CartMessage` | Avisar con un mensaje emergente de 3 segundos que se añadió un producto al carrito, con enlace al carrito. |

### Componentes del panel de administración (`src/components/admin/`)

| Componente | Única responsabilidad |
|---|---|
| `AdminSidebar` | Mostrar la barra lateral del admin, resaltar la pestaña actual y ofrecer cerrar sesión. |
| `AdminTitle` | Mostrar el encabezado de una página admin (título, descripción y acciones opcionales). |
| `AdminIcon` | Dibujar un icono de línea de un solo color a partir de su nombre. |
| `EstadoBadge` | Mostrar el estado de un pedido como etiqueta de color. |
| `EstadoSelect` | Ofrecer la lista desplegable de estados de pedido; avisa el valor elegido, no guarda nada. |
| `OrderTable` | Dibujar una tabla con los pedidos que recibe; no filtra, ordena ni lee datos. Se usa en Pedidos y en el Dashboard. |
| `OrderItemsTable` | Dibujar los productos de un pedido con subtotales y total. |
| `OrderInfo` | Presentar los datos de un pedido (cliente, fecha, pago y entrega) en filas etiqueta/valor. |
| `OrderProductPicker` | Mostrar los productos con un campo de cantidad limitado por su stock; avisa los cambios, no guarda nada. |

### Layouts (`src/layouts/`)

| Layout | Única responsabilidad |
|---|---|
| `TiendaLayout` | Armar la estructura de las páginas de la tienda: header, contenido de la ruta y footer. |
| `AdminLayout` | Proteger el panel (solo rol admin) y armar su estructura: barra lateral y contenido. |

### Contextos y hooks (`src/context/`, `src/hooks/`)

| Archivo | Única responsabilidad |
|---|---|
| `AuthContext` | Guardar y compartir la sesión del usuario (iniciar, registrar y cerrar sesión). |
| `ProductContext` | Guardar y compartir el catálogo de productos: crear, editar, eliminar y ajustar stock. |
| `CategoryContext` | Guardar y compartir las categorías y subcategorías (dos niveles) y consultar su ruta. |
| `CartContext` | Guardar y compartir el carrito (solo `id` y `cantidad`) respetando el stock del catálogo. |
| `PedidoContext` | Guardar y compartir los pedidos realizados y su estado. |
| `useLocalStorage` | Leer y escribir JSON en `localStorage` de forma segura. |
| `useTitulo` | Cambiar el título de la pestaña del navegador. |

### Páginas del admin (`src/pages/admin/`)

Las páginas solo **componen** componentes y contextos; la lógica de dibujo vive en los componentes de arriba.

| Página | Única responsabilidad |
|---|---|
| `Dashboard` | Resumir indicadores, stock y últimos pedidos de la tienda. |
| `Categories` / `CategoryForm` | Listar categorías y subcategorías, y crearlas, editarlas o eliminarlas. |
| `Orders` | Listar los pedidos y filtrarlos por estado. |
| `OrderForm` | Crear un pedido manual (cliente, productos, entrega y pago) y descontar el stock. |
| `OrderDetail` | Mostrar un pedido y permitir cambiar su estado (cancelar devuelve el stock). |
| `Products` / `ProductDetail` / `ProductForm` | Listar, mostrar y crear/editar productos. |
| `Users` / `UserDetail` / `UserForm` | Listar, mostrar y crear/editar usuarios. |
