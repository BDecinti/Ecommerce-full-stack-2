// Entradas del blog. Antes eran dos páginas HTML casi idénticas (post-1.html y post-2.html);
// ahora son datos y una sola página (Post.jsx) que se rellena según el id de la URL.
export const posts = [
  {
    id: 1,
    titulo: "Cómo elegir el producto adecuado",
    resumen:
      "Algunos consejos para comparar características, precio y utilidad antes de comprar.",
    contenido: [
      "Antes de comprar conviene revisar para qué se utilizará el producto, sus características principales, el precio y las alternativas disponibles. Comparar estos puntos ayuda a tomar una decisión informada y evitar compras innecesarias.",
      "En MiTienda seguimos trabajando para entregar una experiencia sencilla y útil a nuestros visitantes.",
    ],
  },
  {
    id: 2,
    titulo: "Datos curiosos del mundo online",
    resumen: "Descubre algunos datos interesantes sobre compras y tecnología.",
    contenido: [
      "Las tiendas online permiten organizar catálogos, automatizar parte del proceso de compra y guardar información temporal como el carrito mediante tecnologías del navegador. Una buena interfaz facilita que el usuario encuentre lo que busca.",
      "En MiTienda seguimos trabajando para entregar una experiencia sencilla y útil a nuestros visitantes.",
    ],
  },
];
