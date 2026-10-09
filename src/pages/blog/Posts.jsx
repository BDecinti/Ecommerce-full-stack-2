import { Link } from "react-router-dom";
import useTitulo from "../../hooks/useTitulo.js";
import { posts } from "../../data/posts.js";
import { rutaImagen } from "../../data/productos.js";
import "../../styles/blogs.css";

export default function Posts() {
  useTitulo("MiTienda - Blogs");

  return (
    <>
      <section className="page-header">
        <h1>Blogs</h1>
        <p>Noticias, consejos y datos curiosos relacionados con nuestra tienda.</p>
      </section>
      <section className="container grid grid-2 blog-list">
        {posts.map((post) => (
          <article className="card blog-card" key={post.id}>
            <img src={rutaImagen("img/placeholder.svg")} alt="Imagen del blog" />
            <h2>{post.titulo}</h2>
            <p>{post.resumen}</p>
            <Link className="btn btn-secondary" to={`/blog/${post.id}`}>
              Leer más
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
