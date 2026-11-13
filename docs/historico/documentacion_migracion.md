# Documentación de la migración a React

Este documento describe cómo se migró **MiTienda** de HTML + CSS + JavaScript (varias páginas) a **React**, qué se tuvo que cambiar y por qué, y cómo cambió la forma en que funciona el código.

La regla que se siguió fue **cambiar solo lo necesario**: el aspecto visual (CSS), los textos, los datos y el comportamiento de cada pantalla se mantienen. Lo que cambia es la forma de construir la interfaz y de organizar el proyecto.

---

## 1. Resumen

| | Antes | Ahora |
|---|---|---|
| Tecnología | HTML + CSS + JavaScript "plano" | React 19 + React Router 7 |
| Herramienta de desarrollo | Live Server (abrir los HTML) | Vite (`npm run dev`) |
| Páginas | 21 archivos `.html` | 18 componentes `.jsx` dentro de **una sola** página (`index.html`) |
| Navegación | Enlaces `<a href="x.html">` que recargan la página | Rutas con `<Link>`; no se recarga la página |
| Actualizar la pantalla | `document.getElementById(...)`, `innerHTML`, `style.display` | Estado de React (`useState`) y JSX |
| Código repetido | Header y footer copiados en cada HTML | Un componente `Header` y uno `Footer` reutilizados |
| Estilos | 13 archivos CSS (uno o dos por página) | **Los mismos 13 CSS**, movidos a `src/styles/` |
| Datos | `localStorage` | `localStorage` (mismas claves) |

**Qué no cambió:** todas las clases CSS, los textos, los productos, los usuarios de prueba, la lógica de negocio (validaciones, flujo de compra, roles) y las claves de `localStorage` (`carrito`, `usuarios`, `usuarioLogueado`, `adminProductos`, `adminUsuarios`, `pedidos`). Por eso un carrito o una sesión guardados con la versión anterior siguen funcionando.

---

## 2. Cómo ejecutar el proyecto

```bash
npm install        # instala las dependencias (solo la primera vez)
npm run dev        # servidor de desarrollo en http://localhost:5173
npm run build      # genera la versión para publicar en la carpeta dist/
npm run preview    # prueba localmente la versión generada por build
```

Antes se abría el proyecto con Live Server. Ahora hace falta Node.js y estos comandos, porque los archivos `.jsx` el navegador no los entiende directamente: Vite los convierte a JavaScript normal.

---

## 3. Herramientas elegidas y por qué

- **React 19**: la librería pedida para la migración.
- **Vite**: es la herramienta recomendada hoy para crear proyectos React (reemplaza a `create-react-app`, que está descontinuado). Es rápida y no necesita configuración, salvo activar el plugin de React (`vite.config.js`).
- **React Router 7** (`react-router-dom`): React no trae navegación entre páginas. Como pasamos de 21 archivos HTML a una sola página, hace falta una librería que muestre un componente u otro según la URL.

Archivos nuevos de configuración: `package.json` (dependencias y comandos), `vite.config.js`, `.gitignore` (excluye `node_modules` y `dist`).

---

## 4. Cambio en la organización del proyecto

### Antes

```
Ecommerce-full-stack-2/
├── index.html
├── pages/  admin/ auth/ blog/ checkout/ company/ products/   (20 archivos .html)
├── js/     admin.js auth.js carrito.js contacto.js pago.js productos.js
├── css/    13 archivos .css
└── img/    9 imágenes .svg
```

### Ahora

```
Ecommerce-full-stack-2/
├── index.html                  ← una sola página con <div id="root">
├── package.json  vite.config.js  .gitignore
├── public/img/                 ← las imágenes (Vite las sirve tal cual)
└── src/
    ├── main.jsx                ← punto de entrada: monta React en #root
    ├── App.jsx                 ← tabla de rutas (qué componente va en qué URL)
    ├── styles/                 ← los mismos 13 CSS
    ├── data/                   ← productos.js, posts.js, adminPorDefecto.js
    ├── context/                ← AuthContext.jsx, CartContext.jsx
    ├── hooks/                  ← useLocalStorage.js, useTitulo.js
    ├── layouts/                ← TiendaLayout.jsx, AdminLayout.jsx
    ├── components/             ← Header, Footer, AdminHeader, ProductCard, ConfirmDialog
    └── pages/                  ← una pantalla por componente (misma agrupación en carpetas)
        ├── Home.jsx
        ├── admin/  auth/  blog/  checkout/  company/  products/
```

La agrupación de `pages/` en carpetas se mantiene igual que antes, así es fácil encontrar el equivalente de cada archivo.

### Equivalencia archivo por archivo

**Páginas HTML → componentes**

| Antes | Ahora |
|---|---|
| `index.html` | `src/pages/Home.jsx` |
| `pages/products/products.html` | `src/pages/products/Products.jsx` |
| `pages/products/product-detail.html` | `src/pages/products/ProductDetail.jsx` |
| `pages/checkout/cart.html` | `src/pages/checkout/Cart.jsx` |
| `pages/checkout/payment.html` | `src/pages/checkout/Payment.jsx` |
| `pages/auth/login.html` | `src/pages/auth/Login.jsx` |
| `pages/auth/signup.html` | `src/pages/auth/Signup.jsx` |
| `pages/company/about.html` | `src/pages/company/About.jsx` |
| `pages/company/contact.html` | `src/pages/company/Contact.jsx` |
| `pages/blog/posts.html` | `src/pages/blog/Posts.jsx` |
| `pages/blog/post-1.html` + `post-2.html` | `src/pages/blog/Post.jsx` (una sola, con datos en `data/posts.js`) |
| `pages/admin/dashboard.html` | `src/pages/admin/Dashboard.jsx` |
| `pages/admin/products.html` | `src/pages/admin/Products.jsx` |
| `pages/admin/product-create.html` + `product-edit.html` | `src/pages/admin/ProductForm.jsx` |
| `pages/admin/product-detail.html` | `src/pages/admin/ProductDetail.jsx` |
| `pages/admin/users.html` | `src/pages/admin/Users.jsx` |
| `pages/admin/user-create.html` + `user-edit.html` | `src/pages/admin/UserForm.jsx` |
| `pages/admin/user-detail.html` | `src/pages/admin/UserDetail.jsx` |

21 páginas HTML pasan a 18 componentes porque tres pares eran prácticamente iguales (crear/editar producto, crear/editar usuario, las dos entradas del blog) y se fusionaron.

**Scripts JS → contextos, hooks y componentes**

| Antes | Ahora | Qué pasó |
|---|---|---|
| `js/auth.js` | `context/AuthContext.jsx`, `components/Header.jsx`, `components/Footer.jsx`, `layouts/AdminLayout.jsx`, `pages/auth/Login.jsx`, `Signup.jsx` | Se repartió: cada responsabilidad quedó en su lugar |
| `js/productos.js` | `data/productos.js`, `components/ProductCard.jsx`, `context/CartContext.jsx`, `pages/Home.jsx`, `Products.jsx` | Datos, tarjeta y carrito separados |
| `js/carrito.js` | `pages/checkout/Cart.jsx`, `components/ConfirmDialog.jsx`, `context/CartContext.jsx` | |
| `js/pago.js` | `pages/checkout/Payment.jsx` | |
| `js/admin.js` | `pages/admin/*.jsx`, `hooks/useLocalStorage.js`, `data/adminPorDefecto.js` | |
| `js/contacto.js` | `pages/company/Contact.jsx` | |

**Otros**

| Antes | Ahora |
|---|---|
| `css/*.css` | `src/styles/*.css` (sin cambios de contenido, salvo la excepción de la sección 8) |
| `img/*.svg` | `public/img/*.svg` |

### Rutas (URLs)

| Antes | Ahora |
|---|---|
| `index.html` | `/` |
| `pages/products/products.html` | `/products` |
| `pages/products/product-detail.html?id=3` | `/products/3` |
| `pages/checkout/cart.html` | `/cart` |
| `pages/checkout/payment.html` | `/payment` |
| `pages/auth/login.html` | `/login` |
| `pages/auth/signup.html` | `/signup` |
| `pages/company/about.html` | `/about` |
| `pages/company/contact.html` | `/contact` |
| `pages/blog/posts.html` | `/blog` |
| `pages/blog/post-1.html` | `/blog/1` |
| `pages/admin/dashboard.html` | `/admin` |
| `pages/admin/products.html` | `/admin/products` |
| `pages/admin/product-create.html` | `/admin/products/new` |
| `pages/admin/product-detail.html?id=0` | `/admin/products/0` |
| `pages/admin/product-edit.html?id=0` | `/admin/products/0/edit` |
| `pages/admin/users.html` y variantes | `/admin/users`, `/admin/users/new`, `/admin/users/0`, `/admin/users/0/edit` |

Las URLs son más limpias: el dato variable (`id`) pasó de ser un parámetro (`?id=3`) a formar parte de la ruta (`/3`). Se lee con `useParams()`.

---

## 5. Cambios de concepto (la parte importante)

### 5.1 De muchas páginas a una sola (SPA)

Antes, cada clic en un enlace pedía un archivo HTML nuevo, el navegador recargaba todo y volvían a ejecutarse los scripts. Ahora hay **un solo** `index.html` y React cambia el contenido sin recargar. Esto se llama *Single Page Application* (SPA).

`App.jsx` define la tabla de rutas:

```jsx
<Routes>
  <Route element={<TiendaLayout />}>        {/* header + footer de la tienda */}
    <Route path="/" element={<Home />} />
    <Route path="/products/:id" element={<ProductDetail />} />
    ...
  </Route>
  <Route path="/admin" element={<AdminLayout />}>   {/* panel protegido */}
    <Route index element={<Dashboard />} />
    <Route path="products/:id/edit" element={<AdminProductForm />} />
    ...
  </Route>
</Routes>
```

Consecuencias directas:
- Los enlaces `<a href="cart.html">` pasan a `<Link to="/cart">`.
- Las redirecciones `window.location.href = "..."` pasan a `navigate("/ruta")` (hook `useNavigate`).
- Desapareció la constante `RAIZ_SITIO` de `auth.js` y todo el trabajo de rutas relativas (`../../css/...`): ya no hay carpetas de páginas que calcular, todas las rutas parten de `/`.
- Como la página ya no se recarga, `App.jsx` incluye un pequeño componente `ScrollAlInicio` que sube la pantalla al cambiar de ruta (el navegador lo hacía solo antes).

### 5.2 De manipular el DOM a describirlo (programación declarativa)

Antes el código buscaba elementos y los modificaba paso a paso:

```js
// ANTES (carrito.js)
const contenedor = document.getElementById("carrito-lista");
contenedor.innerHTML = "";
carrito.forEach((item) => {
  const fila = document.createElement("div");
  fila.innerHTML = `<h3>${item.nombre}</h3> ...`;
  contenedor.appendChild(fila);
});
document.getElementById("carrito-total").textContent = "$" + total;
```

Ahora se describe cómo debe verse la pantalla **según los datos**, y React se encarga de actualizarla:

```jsx
// AHORA (Cart.jsx)
{carrito.map((item) => (
  <div className="carrito-item" key={item.id}>
    <h3>{item.nombre}</h3> ...
  </div>
))}
<span className="carrito-total">{formatearPrecio(total)}</span>
```

Esto elimina casi todos los `getElementById`, `innerHTML`, `appendChild`, `style.display` y los `addEventListener` del proyecto. Los equivalentes son:

| Antes | Ahora |
|---|---|
| `innerHTML = ...` con plantillas de texto | JSX (`<div>...</div>`) |
| `element.style.display = "none"` para ocultar | `{condicion && <Componente />}` (renderizado condicional) |
| `addEventListener("submit", ...)` / `onclick="..."` en el HTML | `onSubmit={...}` / `onClick={...}` en el JSX |
| `document.getElementById("x").value` para leer un campo | estado: `const [x, setX] = useState("")` + `value={x}` + `onChange` (campo "controlado") |
| `textContent = "mensaje"` | estado: `setMensaje("mensaje")` |
| `class="..."` | `className="..."` |
| `for="..."` en `<label>` | `htmlFor="..."` |
| `maxlength`, `minlength` | `maxLength`, `minLength` |

Una ventaja adicional: React escapa automáticamente el texto que se muestra. Antes, `innerHTML` con datos del usuario (por ejemplo la dirección en la confirmación de pago) podía interpretar HTML escrito por el usuario; ahora no.

### 5.3 Header y footer: de copiados a reutilizados

Antes el `<header>` y el `<footer>` estaban copiados en cada archivo HTML (21 veces), y `auth.js` los corregía al cargar la página (`sincronizarHeaderTienda()`, `construirFooter()`).

Ahora:
- `components/Header.jsx` y `components/Footer.jsx` se escriben una vez.
- `layouts/TiendaLayout.jsx` los junta con el contenido de la ruta (`<Outlet />`). Todas las páginas de la tienda se muestran dentro de este layout.
- `layouts/AdminLayout.jsx` hace lo mismo para el panel, con `AdminHeader`.

El header se dibuja directamente según el estado: si hay usuario, muestra "Hola, nombre" y "Cerrar sesión"; si no, "Iniciar sesión" y "Registrarse"; el enlace Admin solo aparece para el rol `admin`. Ya no hace falta ocultar/mostrar elementos a mano.

### 5.4 Estado compartido: Context en lugar de `localStorage` directo

Dos datos se usaban en muchas páginas a la vez: **la sesión** y **el carrito**. Antes cada script leía y escribía `localStorage` por su cuenta (incluso había funciones duplicadas: `obtenerCarrito` existía en `productos.js`, `carrito.js` y `pago.js`) y luego actualizaba a mano el contador del header (`span#cart-count`).

Ahora hay dos **contextos** (la forma de React de compartir estado entre componentes sin pasarlo uno por uno):

| Contexto | Reemplaza | Expone |
|---|---|---|
| `AuthContext` | `obtenerUsuarioActual`, `cerrarSesion`, `protegerAdmin`, `sincronizarHeaderTienda`, la lógica de login y registro | `usuario`, `iniciarSesion()`, `registrar()`, `cerrarSesion()` |
| `CartContext` | `obtenerCarrito`, `guardarCarrito`, `agregarAlCarrito`, `cambiarCantidad`, `eliminarDelCarrito`, `vaciarCarrito`, actualización del contador | `carrito`, `agregar()`, `cambiarCantidad()`, `eliminar()`, `vaciar()`, `cantidadTotal`, `total` |

Cuando el estado cambia, **todos** los componentes que lo usan se redibujan solos: al agregar un producto, el contador del header se actualiza sin que ninguna página lo ordene. `cantidadTotal` y `total` son valores calculados a partir de `carrito`, por lo que no hay que guardarlos ni mantenerlos sincronizados.

Los contextos se montan una vez, en `main.jsx`, envolviendo la aplicación. Los datos siguen guardándose en `localStorage` con las mismas claves.

### 5.5 Hooks usados

Los *hooks* son las funciones de React que empiezan con `use`. Los que aparecen en el proyecto:

| Hook | Para qué se usa aquí |
|---|---|
| `useState` | Guardar datos que cambian: campos de formularios, mensajes, qué producto se quiere eliminar, etc. |
| `useEffect` | Ejecutar código "por fuera" del dibujo: guardar el carrito en `localStorage` cuando cambia, escuchar la tecla Esc, subir la pantalla al cambiar de ruta |
| `useContext` | Leer un contexto (envuelto en `useAuth()` y `useCart()`) |
| `useRef` | Obtener un elemento real del DOM (para enfocar el botón "Cancelar" del diálogo) |
| `useParams` | Leer el `id` de la URL |
| `useNavigate` | Cambiar de página desde el código (redirecciones tras login, registro, guardar) |
| `useTitulo` *(propio)* | Cambiar el título de la pestaña; reemplaza al `<title>` que traía cada HTML |
| `useListaLocal` *(propio)* | Lista guardada en `localStorage`; reemplaza las variables globales y `save()` de `admin.js` |

---

## 6. Cómo cambió cada funcionalidad

### 6.1 Catálogo, tarjetas y ofertas
- **Antes:** `productos.js` tenía el arreglo de productos y funciones que rellenaban `#grid-productos` y `#grid-promo` al cargar la página.
- **Ahora:** el arreglo está en `data/productos.js`. `Home.jsx` y `Products.jsx` recorren el arreglo con `.map()` y dibujan un componente `ProductCard` por producto. La tarjeta de oferta es el mismo componente con `promo` activado (agrega la insignia "Oferta").
- Las imágenes están en `public/img` y los productos siguen guardando rutas como `"img/control.svg"`. La función `rutaImagen()` les antepone la base del sitio. Se hizo así a propósito para que los carritos que ya estaban en `localStorage` sigan mostrando sus imágenes.

### 6.2 Detalle de producto
- **Antes:** `product-detail.html?id=3` y un script inline que buscaba el producto y rellenaba el DOM.
- **Ahora:** `ProductDetail.jsx` lee `id` con `useParams()` y muestra el producto, o "Producto no encontrado". El problema del parpadeo de la imagen de relleno desaparece porque ya no existe un HTML con una imagen provisional que luego se reemplaza.

### 6.3 Carrito
- La lógica se movió a `CartContext` (ver 5.4). `Cart.jsx` solo la usa y dibuja.
- Se mantiene que el botón "-" elimina el producto cuando la cantidad llega a 0, y que "Vaciar carrito" no pide confirmación.

### 6.4 Confirmación al eliminar un producto
- **Antes:** `confirmarAccion()` creaba el HTML del diálogo con `createElement`, lo agregaba al `body` y devolvía una *promesa* que se resolvía al hacer clic.
- **Ahora:** `ConfirmDialog.jsx` es un componente que se muestra según la propiedad `abierto`. `Cart.jsx` guarda en el estado `porEliminar` qué producto está pendiente (`null` = diálogo cerrado) y le pasa dos funciones: `onConfirmar` y `onCancelar`. Se conserva: foco inicial en "Cancelar", cierre con Esc y clic fuera del cuadro.

### 6.5 Pago
- **Antes:** `pago.js` mostraba y ocultaba bloques con `style.display` y leía los campos con `getElementById` al enviar.
- **Ahora:** `Payment.jsx` guarda cada campo en estado. Los campos de dirección solo existen cuando se elige "Envío a domicilio". Al pagar, se guarda el pedido en `localStorage` (clave `pedidos`, mismo formato), se vacía el carrito y se muestra la confirmación; para eso se usa el estado `confirmacion` (mientras sea `null` se ve el formulario).

### 6.6 Inicio de sesión, registro y protección del panel
- **Login / registro:** los formularios son controlados (cada campo en estado). La validación de credenciales y el chequeo de correo duplicado ahora están en `AuthContext` (`iniciarSesion`, `registrar`); las páginas solo muestran el resultado y redirigen con `navigate`. Se mantienen los mensajes, los colores y los tiempos de espera (1 s tras el login, 1,5 s tras el registro).
- **Redirección por rol:** admin va a `/admin`, el resto a `/`.
- **Protección del panel:** antes `protegerAdmin()` se ejecutaba al cargar cada página admin y redirigía con `window.location`. Ahora `AdminLayout` revisa el rol antes de dibujar cualquier ruta `/admin/*` y, si no corresponde, devuelve `<Navigate to="/login" />`. Como todas las pantallas del panel pasan por ese layout, la protección se escribe una sola vez.

### 6.7 Panel de administración (CRUD)
- **Antes:** `admin.js` cargaba dos arreglos globales al abrir cualquier página admin, y cada HTML llamaba a la función correspondiente (`renderAdminProductos()`, `configurarProductoForm(true)`, ...). Los formularios leían los campos usando los `id` como variables globales (`codigo.value`).
- **Ahora:** cada pantalla usa `useListaLocal("adminProductos", ...)`, que devuelve la lista y una función `guardar()` que actualiza el estado y `localStorage`. Los formularios de crear y editar son **un solo componente** (`ProductForm`, `UserForm`) que sabe si está editando según si la URL trae `:id`. Los títulos, el texto del botón y los valores iniciales cambian según el modo.
- El `id` sigue siendo la **posición** del elemento en la lista (igual que el `?id=0` anterior).

### 6.8 Blog
- **Antes:** `posts.html` más dos páginas casi iguales.
- **Ahora:** los textos están en `data/posts.js` y `Post.jsx` muestra la entrada según el `id` de la URL. Para agregar una entrada basta añadirla al arreglo.

### 6.9 Contacto
- La lógica del envío por FormSubmit es la misma, ahora dentro de `Contact.jsx` con estado para los campos, el mensaje y el botón deshabilitado mientras se envía. Sigue pendiente reemplazar `EMAIL_DESTINO` por el correo real.

### 6.10 Títulos de la pestaña
- Antes cada HTML tenía su `<title>`. Ahora hay un solo `index.html` y cada página llama a `useTitulo("...")` para fijar el suyo.

---

## 7. Qué se conservó sin cambios

- Los **13 archivos CSS** (mismas clases y reglas). Los componentes usan los mismos nombres de clase, cambiando solo `class` por `className`.
- Todos los **textos, productos, imágenes, usuarios de prueba y validaciones** de los formularios (`required`, `minLength`, etc.).
- Las **claves y formatos de `localStorage`**.
- El diseño del footer, el diálogo de confirmación y la página de detalle hechos en las modificaciones anteriores.

---

## 8. Diferencias y cosas a tener en cuenta

1. **Un CSS global en lugar de uno por página.** En el sitio anterior cada HTML cargaba solo sus hojas de estilo. En una SPA los estilos importados se acumulan. Se revisó que no hubiera selectores en conflicto entre archivos y se encontró **uno**: `contacto.css` redefinía `.form-card`, que también usan el login, el registro y los formularios admin. Se resolvió acotando la regla con una clase propia (`.form-card.contacto-card`) y agregándola en `Contact.jsx`.
2. **El header del panel admin ahora tiene estilo en todas sus pantallas.** Los estilos de `.admin-header` solo estaban en `admin.css`, y en el sitio anterior únicamente la lista de productos lo cargaba; las demás pantallas del panel mostraban ese header sin estilos. Ahora `AdminHeader` importa `admin.css`, así que todas se ven igual. Es una mejora visual involuntaria, pero es un cambio respecto a la versión anterior.
3. **Al iniciar sesión, el header se actualiza de inmediato** (muestra "Hola, nombre" durante el segundo previo a la redirección). Antes cambiaba recién al cargar la página siguiente.
4. **Publicación (deploy).** Se usa `BrowserRouter`, que genera URLs limpias (`/cart`). Funciona con `npm run dev` y `npm run preview`. Al publicar en un servidor, este debe devolver `index.html` para cualquier ruta (si no, recargar en `/cart` daría error 404). Alternativa si el hosting no lo permite: cambiar `BrowserRouter` por `HashRouter` en `main.jsx` (las URLs pasan a ser `/#/cart`).
5. **Ya no se puede abrir con doble clic** el `index.html` ni con `file://`: hay que usar `npm run dev`.
6. **Lo que ya estaba así y no se tocó:** el formulario de registro permite elegirse el rol "Administrador" (cualquiera puede crearse una cuenta admin), las contraseñas se guardan en texto plano en `localStorage` y la lista de usuarios del panel admin es independiente de la lista de usuarios que pueden iniciar sesión. Son decisiones del proyecto original (simulan un backend) que conviene resolver cuando exista un servidor real.
7. **`EMAIL_DESTINO`** del formulario de contacto sigue con el valor de ejemplo.

---

## 9. Verificación realizada

- `npm run build` compila sin errores ni advertencias.
- Se ejecutó la aplicación completa sobre un DOM simulado (jsdom) con 47 comprobaciones automáticas, todas correctas. Cubren: Home y catálogo (11 tarjetas), contador del carrito, persistencia en `localStorage`, detalle de producto y producto inexistente, cambio de cantidad, diálogo de eliminación (confirmar, cancelar, Esc), pago con retiro y con envío a domicilio (incluida la validación de dirección), pedido guardado, login correcto e incorrecto, cierre de sesión, bloqueo del panel a invitados y a clientes, registro (incluido correo duplicado), CRUD de productos y usuarios en el panel (crear, editar sin duplicar, mostrar, RUN normalizado), blog y aviso de contacto sin correo configurado.
- Esas pruebas fueron temporales y no forman parte del repositorio.
- **No se probó en un navegador real**: conviene recorrer el sitio con `npm run dev` y comparar el aspecto visual con la versión anterior.

---

## 10. Volver a la versión anterior

La versión HTML/JS está en el historial de Git (último commit antes de la migración). Para consultarla o recuperarla:

```bash
git log --oneline                     # ubicar el commit anterior a la migración
git checkout <commit> -- .            # restaurar esos archivos
```

Se recomienda hacer la migración en una rama (`git switch -c migracion-react`) para poder comparar y no perder la versión anterior en `main`.
