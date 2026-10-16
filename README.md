# Ecommerce-full-stack-2
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
2. **Nadie trabaja directo en `main`.** Siempre en una rama propia. `main` solo recibe código por Pull Request (PR) revisado por otra persona.
3. **Lo compartido se define primero y se modifica poco.** Datos (`src/data/`), rutas y componentes comunes se construyen juntos en la Fase 0. Después, solo se **agregan** cosas; no se renombran ni se borran sin avisar.
4. **Antes de empezar a trabajar siempre se actualiza la rama** (`git pull` de `main`). Esto evita el clásico "trabajé 3 horas sobre una versión vieja".
5. **PRs chicos y frecuentes** (idealmente de menos de un día de trabajo). Un PR gigante = conflictos garantizados.
6. **Todo PR lo revisa otra persona del equipo.** Sirve para detectar errores y para que los 3 entiendan todo el código, algo clave porque en la presentación **cada integrante responde preguntas** sobre el proyecto y los cambios en GitHub.

---

## 2. Reparto de responsabilidades (por áreas, no por tipo de tarea)

Se reparte por **vistas completas** (de punta a punta) y no "uno hace HTML, otro lógica". Así cada persona toca carpetas distintas.

| | Área | Vistas / componentes | Carpeta propia |
|---|---|---|---|
| **Persona A** | Catálogo de la tienda + capa de datos | Home, Productos, Detalle de producto, Categorías, Categoría #1, Ofertas, Nosotros, Blogs, Detalle blog #1 y #2, Contacto | `src/pages/store/`, `src/components/catalog/`, `src/data/` |
| **Persona B** | Usuarios y compra | Iniciar sesión, Registro, Carrito, Checkout, Pago correcto, Pago con error | `src/pages/shop/`, `src/pages/auth/`, `src/components/cart/`, `src/context/` |
| **Persona C** | Panel de administración | Dashboard, Órdenes/Boletas, Productos (nuevo, mostrar, editar, críticos, reportes), Categorías, Usuarios (nuevo, mostrar, editar, historial), Reportes, Perfil | `src/pages/admin/`, `src/components/admin/` |

Cada uno además **escribe las pruebas (Jasmine) de sus propios componentes**, en la misma carpeta o en `tests/<su-area>/`.

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
│  ├─ App.jsx           ← rutas (compartido)
│  └─ main.jsx
├─ tests/               ← pruebas Jasmine (una subcarpeta por área)
├─ docs/                ← ERS V2, documento de testing, este plan
├─ CLAUDE.md            ← contexto para Claude Code (ver sección 9)
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
- [ ] **Configurar Jasmine + Karma con UNA prueba trivial que pase.** Es probablemente lo más complicado técnicamente; resuélvanlo temprano con ayuda de Claude Code y confirmen que `npm test` funciona en el computador de los tres. Si se traba más de un par de horas, consulten al docente.
- [ ] Escribir el `CLAUDE.md` (sección 9) y un `README` con los pasos para levantar el proyecto (`npm install`, `npm run dev`, `npm test`).
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

### Fase 4: Pruebas con Jasmine (≈10%, pero escribiendo desde la Fase 1)
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
- Al usar Claude Code, pedirle que **explique antes de escribir** (ver sección 9). Regla del equipo: **no se hace commit de código que no puedas explicar con tus palabras.**
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

## 9. Cómo usar Claude Code en equipo sin caos

Agreguen esto al `CLAUDE.md` del repositorio (después del contexto de la evaluación) para que Claude Code respete las reglas del equipo:

```markdown
## Reglas de trabajo en equipo (obligatorias)

- Somos 3 estudiantes principiantes en React. Explica el código de forma simple y breve.
  Antes de escribir código nuevo, explica qué vas a hacer y por qué.
- Cada persona solo modifica su propia área (ver tabla de responsabilidades en docs/PLAN_EQUIPO.md).
  Nunca edites archivos fuera del área de quien te está hablando.
  Si hace falta cambiar algo compartido (src/data, src/components/common, rutas),
  detente, explícame qué habría que cambiar y por qué, y yo lo coordino con el equipo.
- No renombres ni elimines funciones del archivo de datos ni props de componentes comunes.
  Solo se pueden agregar cosas nuevas.
- Trabaja siempre en la rama de la tarea actual, nunca en main. Haz commits pequeños con
  el formato: feat(area): descripción / fix(area): ... / test(area): ...
- Respeta el principio Single Responsibility: componentes pequeños, nombres claros,
  props para datos y funciones, estado solo cuando sea necesario.
- Cuando escribas código, deja que pueda explicarlo yo en la presentación: prefiere soluciones simples
  y legibles sobre soluciones "ingeniosas".
- Cada componente importante debe venir con su prueba Jasmine (renderizado, props, estado o eventos).
```

**Plantillas de prompt para cada persona** (cambien el área):

- Para empezar una tarea:
  > "Soy Persona B y mi área es compra y usuarios. Voy a hacer la página de Checkout. Primero explícame en simple qué componentes y qué estado necesito, sin escribir código todavía. Luego lo vamos construyendo paso a paso, tocando solo archivos de mi área."
- Para entender código que no escribí:
  > "Explícame línea por línea qué hace este componente, como si no supiera React, y qué preguntas podría hacerme un profesor sobre él."
- Para pruebas:
  > "Escribe una prueba Jasmine para este componente que verifique renderizado y un evento, y explícame qué comprueba cada parte."
- Antes del PR:
  > "Revisa mis cambios de esta rama: ¿toqué algo fuera de mi área? ¿hay algo que pueda romper el trabajo de mis compañeros?"

**Cuidado:** si dos personas piden a Claude Code que modifique el mismo archivo, vuelven los conflictos. Las reglas de la sección 1 aplican igual para lo que genere la IA.

---

## 10. Riesgos probables y cómo evitarlos

| Riesgo | Prevención |
|---|---|
| Jasmine + Karma no funciona con React | Configurarlo en la Fase 0 con una prueba trivial; si se traba, consultar al docente. |
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
3. ¿Es obligatorio **Karma** con Jasmine, o se acepta otra forma de ejecutar Jasmine con React?
4. ¿Qué nivel de cobertura de pruebas se espera?
5. En el diagrama del admin, bajo "Categoría" aparece "Editar usuario": ¿es un error y debería ser "Editar categoría"?
